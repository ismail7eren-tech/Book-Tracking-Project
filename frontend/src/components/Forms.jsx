import React, { useState } from 'react';

const API = "/api";
const initialBook = { title: "", author: "", totalPages: "", currentPage: "", topicNames: "" };

export default function Forms({ books, readingBooks, fetchDashboard, token }) {
  const [bookForm, setBookForm] = useState(initialBook);
  const [sessionForm, setSessionForm] = useState({ bookId: "", date: new Date().toISOString(), pagesRead: "", fromPage: "", toPage: "", notes: "" });
  const [insightForm, setInsightForm] = useState({ bookId: "", content: "", learnedAt: new Date().toISOString() });

  const reqHeaders = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

  async function createBook(e) {
    e.preventDefault();
    const payload = {
      ...bookForm,
      totalPages: Number(bookForm.totalPages),
      currentPage: Number(bookForm.currentPage) || 0,
      topicNames: bookForm.topicNames.split(",").map(t => t.trim()).filter(Boolean),
      startedAt: new Date().toISOString(),
    };

    const res = await fetch(`${API}/books`, { method: "POST", headers: reqHeaders, body: JSON.stringify(payload) });
    
    if (res.ok) {
      setBookForm(initialBook);
      fetchDashboard();
    }
  }

  async function addSession(e) {
    e.preventDefault();
    const payload = {
      ...sessionForm,
      bookId: Number(sessionForm.bookId),
      pagesRead: Number(sessionForm.pagesRead),
      fromPage: sessionForm.fromPage ? Number(sessionForm.fromPage) : undefined,
      toPage: sessionForm.toPage ? Number(sessionForm.toPage) : undefined,
    };

    const res = await fetch(`${API}/sessions`, { method: "POST", headers: reqHeaders, body: JSON.stringify(payload) });
    
    if (res.ok) {
      setSessionForm(prev => ({ ...prev, pagesRead: "", fromPage: "", toPage: "", notes: "" }));
      fetchDashboard();
    }
  }

  async function addInsight(e) {
    e.preventDefault();
    const res = await fetch(`${API}/insights`, {
      method: "POST", headers: reqHeaders,
      body: JSON.stringify({ ...insightForm, bookId: Number(insightForm.bookId) }),
    });

    if (res.ok) {
      setInsightForm(prev => ({ ...prev, content: "" }));
      fetchDashboard();
    }
  }

  return (
    <section className="grid forms">
      <form onSubmit={createBook} className="glass-panel">
        <h2>Yeni Kitap Ekle</h2>
        <input placeholder="Kitap adı" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} required />
        <input placeholder="Yazar" value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} required />
        <input type="number" placeholder="Toplam sayfa" value={bookForm.totalPages} onChange={e => setBookForm({ ...bookForm, totalPages: e.target.value })} required />
        <input type="number" placeholder="Şu anki sayfa" value={bookForm.currentPage} onChange={e => setBookForm({ ...bookForm, currentPage: e.target.value })} />
        <input placeholder="Konular (virgülle ayır)" value={bookForm.topicNames} onChange={e => setBookForm({ ...bookForm, topicNames: e.target.value })} />
        <button type="submit">Kitabı Kaydet</button>
      </form>

      <form onSubmit={addSession} className="glass-panel">
        <h2>Günlük Okuma Gir</h2>
        <select value={sessionForm.bookId} onChange={e => setSessionForm({ ...sessionForm, bookId: e.target.value })} required>
          <option value="">Kitap seç</option>
          {readingBooks.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
        </select>
        <input type="datetime-local" value={sessionForm.date.slice(0, 16)} onChange={e => setSessionForm({ ...sessionForm, date: new Date(e.target.value).toISOString() })} required />
        <input type="number" placeholder="Okunan sayfa" value={sessionForm.pagesRead} onChange={e => setSessionForm({ ...sessionForm, pagesRead: e.target.value })} required />
        <input type="number" placeholder="Başlangıç sayfası" value={sessionForm.fromPage} onChange={e => setSessionForm({ ...sessionForm, fromPage: e.target.value })} />
        <input type="number" placeholder="Bitiş sayfası" value={sessionForm.toPage} onChange={e => setSessionForm({ ...sessionForm, toPage: e.target.value })} />
        <textarea placeholder="Okuma notların (opsiyonel)" value={sessionForm.notes} onChange={e => setSessionForm({ ...sessionForm, notes: e.target.value })} />
        <button type="submit">Okumayı Ekle</button>
      </form>

      <form onSubmit={addInsight} className="glass-panel">
        <h2>Kitaptan Öğrendiklerim</h2>
        <select value={insightForm.bookId} onChange={e => setInsightForm({ ...insightForm, bookId: e.target.value })} required>
          <option value="">Kitap seç</option>
          {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
        </select>
        <textarea placeholder="Bu kitaptan ne öğrendin?" value={insightForm.content} onChange={e => setInsightForm({ ...insightForm, content: e.target.value })} required />
        <button type="submit">Öğrenimi Kaydet</button>
      </form>
    </section>
  );
}