import { useEffect, useState, useMemo } from "react";
import "./App.css"; // Bileşene özel stil dosyası

import DashboardStats from "./components/DashboardStats";
import Forms from "./components/Forms";
import BookList from "./components/BookList";
import MonthlyChart from "./components/MonthlyChart";
import Login from "./components/Login";

const API = "/api";

function App() {
  // Auth state'leri localStorage üzerinden başlatılıyor
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  
  // Uygulama dataları
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [monthlyPages, setMonthlyPages] = useState([]);
  const [error, setError] = useState("");

  // Sadece şu an okunan kitapları filtreliyoruz
  const readingBooks = useMemo(() => books.filter((b) => b.status === "READING"), [books]);

  // Tüm dashboard verilerini tek seferde çeken fonksiyon
  async function fetchDashboard() {
    if (!token) return;
    
    try {
      setError("");
      const headers = { Authorization: `Bearer ${token}` };
      
      const [booksRes, statsRes, monthlyRes] = await Promise.all([
        fetch(`${API}/books`, { headers }),
        fetch(`${API}/stats/overview`, { headers }),
        fetch(`${API}/stats/monthly-pages`, { headers }),
      ]);

      // Token geçersizse veya süresi dolduysa çıkış yap
      if (booksRes.status === 401 || statsRes.status === 401) {
        handleLogout();
        return;
      }

      if (!booksRes.ok || !statsRes.ok || !monthlyRes.ok) {
        throw new Error("Veriler sunucudan çekilemedi.");
      }

      const booksData = await booksRes.json();
      const statsData = await statsRes.json();
      const monthlyData = await monthlyRes.json();
      
      setBooks(booksData);
      setStats(statsData);
      setMonthlyPages(monthlyData);
    } catch (err) {
      setError(err.message || "Sunucuya bağlanılamıyor, lütfen tekrar deneyin.");
    }
  }

  // Token değiştiğinde (örneğin giriş yapıldığında) verileri getir
  useEffect(() => {
    fetchDashboard();
  }, [token]);

  // Çıkış işlemi ve state temizliği
  function handleLogout() {
    setToken("");
    setUser("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Token yoksa sadece Login sayfasını göster
  if (!token) {
    return (
      <div className="container">
        <header>
          <h1>Kitap Takibi</h1>
          <p>Devam etmek için giriş yapın veya kayıt olun.</p>
        </header>
        <Login setToken={setToken} setUser={setUser} />
      </div>
    );
  }

  // Ana Dashboard Görünümü
  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h1>Kitap Takip Paneli</h1>
          <p>Hoş geldin, <strong>{user}</strong>. Nerede kaldığını ve yıllık hedeflerini tek yerden yönet.</p>
        </div>
        <button onClick={handleLogout} className="danger" style={{ height: 'fit-content' }}>
          Çıkış Yap
        </button>
      </header>

      {error && <div className="error">{error}</div>}

      <DashboardStats stats={stats} />
      <Forms books={books} readingBooks={readingBooks} fetchDashboard={fetchDashboard} token={token} />
      <BookList books={books} stats={stats} fetchDashboard={fetchDashboard} token={token} />
      <MonthlyChart monthlyPages={monthlyPages} />
    </div>
  );
}

export default App;