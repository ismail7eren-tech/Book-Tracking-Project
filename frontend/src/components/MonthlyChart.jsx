import React from 'react';

export default function MonthlyChart({ monthlyPages }) {
  if (!monthlyPages || monthlyPages.length === 0) return null;
  const maxMonthlyPages = Math.max(...monthlyPages.map((m) => m.pages), 1);

  return (
    <section className="chart glass-panel">
      <h2>Son 12 Ay Okuma Trendi (Sayfa)</h2>
      <div className="bars">
        {monthlyPages.map((item) => (
          <div key={item.month} className="bar-item">
            <div
              className="bar"
              style={{ height: `${Math.max((item.pages / maxMonthlyPages) * 140, 6)}px` }}
              title={`${item.month}: ${item.pages} sayfa`}
            />
            <span>{item.month.slice(5)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
