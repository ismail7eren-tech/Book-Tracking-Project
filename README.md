# 📚 Kitap Takip | Book Tracker

A modern full-stack web application that helps readers manage their personal libraries, track reading habits, document valuable insights, and visualize their reading progress through an interactive dashboard.

---

## 🇹🇷 Türkçe

### 🌟 Proje Hakkında

**Kitap Takip**, okuma alışkanlıklarını düzenli bir şekilde takip etmek, kişisel kitap arşivini yönetmek ve kitaplardan edinilen önemli bilgileri kayıt altına almak amacıyla geliştirilmiş full-stack bir web uygulamasıdır.

Kullanıcıların okuma süreçlerini tek bir platform üzerinden yönetmelerini sağlayan uygulama; kişiselleştirilmiş dashboard, kapsamlı okuma istatistikleri, dinamik veri görselleştirmeleri ve kitap bazlı not yönetimi özelliklerini bir araya getirir.

Modern arayüz tasarımı, güvenli kimlik doğrulama mekanizması ve düzenli yazılım mimarisiyle işlevsellik, performans ve kullanıcı deneyimini bir arada sunmayı hedefler.

### ✨ Temel Özellikler

- **🔐 Güvenli Kullanıcı Kimlik Doğrulama:** JWT (JSON Web Token) tabanlı oturum yönetimi ve Bcrypt ile parola şifreleme. Her kullanıcının kendi kitaplığına güvenli ve bağımsız erişimi.
- **📊 Okuma İstatistikleri ve Analizler:** Tamamlanan kitap sayısı, günlük ortalama sayfa sayısı ve yıllık okuma performansının takibi.
- **📈 Dinamik Veri Görselleştirme:** Son 12 aylık okuma aktivitelerini ve sayfa istatistiklerini gösteren interaktif sütun grafikleri.
- **📝 Kitap Notları ve Öğrenimler:** Kitaplardan edinilen önemli fikirleri, çıkarımları ve kişisel notları kaydetme ve yönetme.
- **🏷️ Konu ve Etiket Yönetimi:** Okuma notlarını konu bazlı sınıflandırma ve etiketler üzerinden içerik dağılımını takip etme.
- **🎨 Modern Arayüz (Glassmorphism):** Buzlu cam efektleri, CSS değişkenleri, özel animasyonlar, Outfit tipografisi ve karanlık tema ile tasarlanmış modern dashboard.
- **⚡ Ayrı Frontend ve Backend Mimarisi:** React tabanlı frontend ve Express.js tabanlı backend uygulamalarının birbirinden bağımsız geliştirilmesine olanak sağlayan yapı.

### 🛠️ Teknolojik Altyapı

| Kategori | Teknolojiler |
|---|---|
| Frontend | React, Vite |
| Styling | CSS3, CSS Variables, Keyframe Animations |
| Backend | Node.js, Express.js |
| Data Validation | Zod |
| Database | SQLite |
| ORM | Prisma ORM |
| Authentication | JWT, Bcryptjs |
| Typography | Outfit |

---

## 🇬🇧 English

### 🌟 About The Project

**Kitap Takip (Book Tracker)** is a modern full-stack web application designed to help readers manage their personal book collections, track reading habits, document valuable insights, and analyze their reading progress through an interactive dashboard.

The platform brings together personalized reading analytics, dynamic data visualizations, structured note management, and individual library organization to provide a centralized reading experience.

Built with a modern technology stack, the application combines secure authentication, data validation, and a visually refined Glassmorphism interface to deliver a seamless and responsive user experience.

### ✨ Key Features

- **🔐 Secure Authentication:** JWT-based authentication and Bcrypt password hashing, providing secure access and isolated personal libraries for each user.
- **📊 Reading Analytics:** Track completed books, average daily page counts, and annual reading performance.
- **📈 Interactive Data Visualization:** Dynamic bar charts displaying reading activity and page statistics over the past 12 months.
- **📝 Book Insights & Notes:** Record, organize, and revisit important ideas, personal notes, and key takeaways from books.
- **🏷️ Topic & Tag Management:** Categorize reading insights and analyze content distribution based on topics and tags.
- **🎨 Modern Glassmorphism Interface:** A dark-themed dashboard featuring frosted-glass effects, CSS variables, custom animations, and Outfit typography.
- **⚡ Separated Frontend & Backend Architecture:** An independent React-based frontend and Express.js backend structure, enabling modular development and maintenance.

### 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite |
| Styling | CSS3, CSS Variables, Keyframe Animations |
| Backend | Node.js, Express.js |
| Data Validation | Zod |
| Database | SQLite |
| ORM | Prisma ORM |
| Authentication | JWT, Bcryptjs |
| Typography | Outfit |

---

## ⚙️ Kurulum ve Çalıştırma | Getting Started

### 1. Depoyu Klonlayın | Clone the Repository

```bash
git clone https://github.com/your-username/kitap-takip-projesi.git
cd kitap-takip-projesi
```

### 2. Bağımlılıkları Yükleyin | Install Dependencies

**Backend:**

```bash
cd backend
npm install
npx prisma generate
```

**Frontend:**

```bash
cd ../frontend
npm install
```

### 3. Uygulamayı Çalıştırın | Run the Application

Uygulamayı geliştirme modunda çalıştırmak için backend ve frontend sunucularını ayrı terminallerde başlatın.

To run the application in development mode, start the backend and frontend servers in separate terminals.

**Backend Server**

```bash
cd backend
npm run dev
```

<sub>Port: 4000</sub>

**Frontend Development Server**

```bash
cd frontend
npm run dev
```

<sub>Port: 5173</sub>

---

## 🎯 Project Vision

Kitap Takip aims to make reading a more organized, measurable, and meaningful experience by bringing personal library management, reading analytics, and knowledge organization together in one platform.

**Read. Track. Reflect. Grow.**

---

*Kitap Takip | Okuduklarını takip et, öğrendiklerini kaydet, gelişimini keşfet.*