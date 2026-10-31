import React from 'react';

const API = "/api";

export default function BookList({ books, stats, fetchDashboard, token }) {
  
  async function updateBookStatus(bookId, status, currentPage, totalPages) {
    await fetch(`${API}/books/${bookId}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({
        status,
        currentPage: status === "COMPLETED" ? totalPages : currentPage,
      }),
    });
    fetchDashboard();
  }

  async function deleteBook(bookId) {
    if (!window.confirm("Bu kitabı silmek istediğinize emin misiniz?")) return;
    
    await fetch(`${API}/books/${bookId}`, { 
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchDashboard();
  }

  return (
    <section className="grid two-cols">
      <article>
        <h2>Kitaplarım</h2>
        
        {books.length === 0 && <p style={{ color: '#94a3b8' }}>Henüz kitap eklenmedi.</p>}
        
        {books.map((book, index) => {
          const progressPercent = book.totalPages > 0
            ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
            : 0;

          return (
            <div key={book.id} className="book-card" style={{ '--item-index': index }}>
              <div className="book-header">
                <div>
                  <h3>{book.title}</h3>
                  <p>Yazar: {book.author}</p>
                </div>
                <span className={`status-badge status-${book.status}`}>
                  {book.status === 'READING' ? 'OKUNUYOR' : book.status === 'ON_HOLD' ? 'ARA VERİLDİ' : 'TAMAMLANDI'}
                </span>
              </div>

              <div className="progress-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                  <span>İlerleme</span>
                  <span>{book.currentPage} / {book.totalPages} (%{progressPercent})</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {book.topics?.length > 0 && (
                <p><strong>Konular:</strong> {book.topics.join(", ")}</p>
              )}

              {book.insights?.length > 0 && (
                <ul className="insights-list">
                  {book.insights.slice(0, 2).map((insight) => (
                    <li key={insight.id}>{insight.content}</li>
                  ))}
                </ul>
              )}

              <div className="actions">
                {book.status !== 'READING' && (
                  <button type="button" onClick={() => updateBookStatus(book.id, "READING", book.currentPage, book.totalPages)}>
                    Okunuyor
                  </button>
                )}
                {book.status !== 'ON_HOLD' && (
                  <button className="secondary" type="button" onClick={() => updateBookStatus(book.id, "ON_HOLD", book.currentPage, book.totalPages)}>
                    Ara Ver
                  </button>
                )}
                {book.status !== 'COMPLETED' && (
                  <button className="secondary" type="button" onClick={() => updateBookStatus(book.id, "COMPLETED", book.currentPage, book.totalPages)}>
                    Tamamla
                  </button>
                )}
                <button type="button" className="danger" onClick={() => deleteBook(book.id)}>
                  Sil
                </button>
              </div>
            </div>
          );
        })}
      </article>

      <article className="glass-panel" style={{ alignSelf: 'start' }}>
        <h2>Konu Dağılımı</h2>
        <ul className="topic-list">
          {(!stats?.topicBreakdown?.length) ? (
            <li style={{ color: '#94a3b8', border: 'none' }}>Henüz konu verisi yok.</li>
          ) : (
            stats.topicBreakdown.map((topic) => (
              <li key={topic.topic}>
                <span>{topic.topic}</span>
                <strong>{topic.count} kitap</strong>
              </li>
            ))
          )}
        </ul>
      </article>
    </section>
  );
}