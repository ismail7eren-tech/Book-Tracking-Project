const express = require("express");
const cors = require("cors");
const dayjs = require("dayjs");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-cv-project";

app.use(cors());
app.use(express.json());

const bookSchema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  totalPages: z.coerce.number().int().positive(),
  currentPage: z.coerce.number().int().nonnegative().optional().default(0),
  status: z.enum(["READING", "COMPLETED", "ON_HOLD"]).optional().default("READING"),
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional(),
  topicNames: z.array(z.string().min(2)).optional().default([]),
});

const sessionSchema = z.object({
  bookId: z.coerce.number().int().positive(),
  date: z.string().datetime(),
  pagesRead: z.coerce.number().int().positive(),
  fromPage: z.coerce.number().int().nonnegative().optional(),
  toPage: z.coerce.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});

const insightSchema = z.object({
  bookId: z.coerce.number().int().positive(),
  content: z.string().min(5),
  learnedAt: z.string().datetime().optional(),
});

function normalizeTopic(name) {
  return name.trim().toLowerCase();
}

// Auth Middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Yetkisiz erişim" });
  
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Geçersiz veya süresi dolmuş token" });
  }
}

// Auth Rotaları
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password || username.length < 3 || password.length < 6) {
    return res.status(400).json({ error: "Geçersiz kullanıcı adı veya şifre" });
  }
  
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) return res.status(400).json({ error: "Kullanıcı adı kullanımda" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, password: hashedPassword } });
  
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, username: user.username });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Kullanıcı adı ve şifre zorunlu" });

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: "Hatalı bilgi" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Hatalı bilgi" });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, username: user.username });
});

app.get("/api/health", (_, res) => res.json({ ok: true }));

// Korunan API Rotaları
app.use("/api", requireAuth);

app.get("/api/books", async (req, res) => {
  const books = await prisma.book.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      topics: { include: { topic: true } },
      sessions: { orderBy: { date: "desc" } },
      insights: { orderBy: { learnedAt: "desc" } },
    },
  });

  const formatted = books.map((book) => ({
    ...book,
    topics: book.topics.map((t) => t.topic.name),
  }));

  res.json(formatted);
});

app.post("/api/books", async (req, res) => {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { topicNames, startedAt, finishedAt, ...bookData } = parsed.data;
  const uniqueTopics = [...new Set(topicNames.map(normalizeTopic).filter(Boolean))];

  const createdBook = await prisma.book.create({
    data: {
      ...bookData,
      userId: req.user.id,
      startedAt: startedAt ? new Date(startedAt) : null,
      finishedAt: finishedAt ? new Date(finishedAt) : null,
    },
  });

  for (const topicName of uniqueTopics) {
    const topic = await prisma.topic.upsert({
      where: { name: topicName },
      update: {},
      create: { name: topicName },
    });
    
    await prisma.bookTopic.create({
      data: { bookId: createdBook.id, topicId: topic.id },
    });
  }

  const withTopics = await prisma.book.findUnique({
    where: { id: createdBook.id },
    include: { topics: { include: { topic: true } } },
  });

  return res.status(201).json({
    ...withTopics,
    topics: withTopics.topics.map((t) => t.topic.name),
  });
});

app.patch("/api/books/:id", async (req, res) => {
  const id = Number(req.params.id);
  
  const parsed = z.object({
    currentPage: z.coerce.number().int().nonnegative().optional(),
    status: z.enum(["READING", "COMPLETED", "ON_HOLD"]).optional(),
    finishedAt: z.string().datetime().optional().nullable(),
  }).safeParse(req.body);

  if (Number.isNaN(id) || !parsed.success) return res.status(400).json({ error: "Geçersiz veri" });

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book || book.userId !== req.user.id) return res.status(403).json({ error: "Erişim engellendi" });

  //  Temiz payload oluşturma
  const payload = {};
  if (parsed.data.currentPage !== undefined) payload.currentPage = parsed.data.currentPage;
  if (parsed.data.status) payload.status = parsed.data.status;
  if (parsed.data.finishedAt !== undefined) {
    payload.finishedAt = parsed.data.finishedAt ? new Date(parsed.data.finishedAt) : null;
  }

  if (parsed.data.status === "COMPLETED" && parsed.data.finishedAt === undefined) {
    payload.finishedAt = new Date();
  }
  
  if (parsed.data.status !== "COMPLETED" && parsed.data.finishedAt === undefined) {
    payload.finishedAt = null;
  }

  const updated = await prisma.book.update({ where: { id }, data: payload });
  res.json(updated);
});

app.delete("/api/books/:id", async (req, res) => {
  const id = Number(req.params.id);
  const book = await prisma.book.findUnique({ where: { id } });
  
  if (!book || book.userId !== req.user.id) return res.status(403).json({ error: "Erişim reddedildi" });

  await prisma.book.delete({ where: { id } });
  return res.status(204).send();
});

app.post("/api/sessions", async (req, res) => {
  const parsed = sessionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const book = await prisma.book.findUnique({ where: { id: parsed.data.bookId } });
  if (!book || book.userId !== req.user.id) return res.status(403).json({ error: "Erişim reddedildi" });

  const created = await prisma.readingSession.create({
    data: { ...parsed.data, date: new Date(parsed.data.date) },
  });

  await prisma.book.update({
    where: { id: parsed.data.bookId },
    data: { currentPage: parsed.data.toPage ?? undefined },
  });

  res.status(201).json(created);
});

app.post("/api/insights", async (req, res) => {
  const parsed = insightSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const book = await prisma.book.findUnique({ where: { id: parsed.data.bookId } });
  if (!book || book.userId !== req.user.id) return res.status(403).json({ error: "Erişim reddedildi" });

  const created = await prisma.insight.create({
    data: {
      bookId: parsed.data.bookId,
      content: parsed.data.content,
      learnedAt: parsed.data.learnedAt ? new Date(parsed.data.learnedAt) : new Date(),
    },
  });
  
  res.status(201).json(created);
});

app.get("/api/stats/overview", async (req, res) => {
  const todayStart = dayjs().startOf("day").toDate();
  const tomorrowStart = dayjs().add(1, "day").startOf("day").toDate();
  const yearStart = dayjs().startOf("year").toDate();
  const lastYearStart = dayjs().subtract(1, "year").startOf("day").toDate();

  const [todaySessions, sessionsLastYear, finishedThisYear, totalBooks, topics] = await Promise.all([
    prisma.readingSession.findMany({
      where: { date: { gte: todayStart, lt: tomorrowStart }, book: { userId: req.user.id } },
      select: { pagesRead: true },
    }),
    prisma.readingSession.findMany({
      where: { date: { gte: lastYearStart }, book: { userId: req.user.id } },
      select: { pagesRead: true },
    }),
    prisma.book.count({
      where: { status: "COMPLETED", finishedAt: { gte: yearStart }, userId: req.user.id },
    }),
    prisma.book.count({ where: { userId: req.user.id } }),
    prisma.bookTopic.groupBy({
      where: { book: { userId: req.user.id } },
      by: ["topicId"],
      _count: { topicId: true },
    }),
  ]);

  const topicDetails = await prisma.topic.findMany();
  const topicNameMap = new Map(topicDetails.map((t) => [t.id, t.name]));
  const totalPagesLastYear = sessionsLastYear.reduce((acc, s) => acc + s.pagesRead, 0);

  res.json({
    pagesToday: todaySessions.reduce((acc, s) => acc + s.pagesRead, 0),
    avgPagesPerDay: Math.round(totalPagesLastYear / 365),
    booksFinishedThisYear: finishedThisYear,
    totalBooks,
    topicBreakdown: topics
      .map((t) => ({ topic: topicNameMap.get(t.topicId), count: t._count.topicId }))
      .filter((t) => t.topic)
      .sort((a, b) => b.count - a.count),
  });
});

app.get("/api/stats/monthly-pages", async (req, res) => {
  const startDate = dayjs().subtract(11, "month").startOf("month").toDate();
  
  const sessions = await prisma.readingSession.findMany({
    where: { date: { gte: startDate }, book: { userId: req.user.id } },
    select: { date: true, pagesRead: true },
    orderBy: { date: "asc" },
  });

  const monthMap = new Map();
  for (let i = 11; i >= 0; i -= 1) {
    const key = dayjs().subtract(i, "month").format("YYYY-MM");
    monthMap.set(key, 0);
  }

  for (const session of sessions) {
    const key = dayjs(session.date).format("YYYY-MM");
    if (monthMap.has(key)) monthMap.set(key, monthMap.get(key) + session.pagesRead);
  }

  res.json([...monthMap.entries()].map(([month, pages]) => ({ month, pages })));
});

// Statik dosyaları sunma (Frontend kısmı)
const frontendDistPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// Hata yakalayıcı 
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Sunucuda beklenmeyen bir hata oluştu." });
});

app.listen(PORT, () => {
  console.log(`Sunucu hazır: http://localhost:${PORT}`);
});