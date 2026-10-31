import React, { useState } from 'react';

const API = "/api/auth";

export default function Login({ setToken, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/login" : "/register";
    
    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Giriş işlemi başarısız oldu.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.username);
      
      setToken(data.token);
      setUser(data.username);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form className="glass-panel" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: 'none' }}>
          {isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </h2>
        
        {error && <div className="error" style={{ marginBottom: '1rem', padding: '0.8rem' }}>{error}</div>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
          {loading ? "Bekleniyor..." : (isLogin ? "Giriş Yap" : "Hesap Oluştur")}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{ display: 'inline', background: 'none', color: 'var(--primary)', padding: 0, fontWeight: 'bold' }}
          >
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </form>
    </div>
  );
}