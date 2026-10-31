import React from 'react';

export default function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <section className="grid stats">
      <article className="glass-panel">
        <h3>Bugün Okunan</h3>
        <strong>{stats.pagesToday ?? 0}</strong>
        <p>sayfa</p>
      </article>
      <article className="glass-panel">
        <h3>Günlük Ortalama</h3>
        <strong>{stats.avgPagesPerDay ?? 0}</strong>
        <p>sayfa</p>
      </article>
      <article className="glass-panel">
        <h3>Bu Yıl Biten</h3>
        <strong>{stats.booksFinishedThisYear ?? 0}</strong>
        <p>kitap</p>
      </article>
      <article className="glass-panel">
        <h3>Toplam Kitap</h3>
        <strong>{stats.totalBooks ?? 0}</strong>
        <p>kitap</p>
      </article>
    </section>
  );
}
