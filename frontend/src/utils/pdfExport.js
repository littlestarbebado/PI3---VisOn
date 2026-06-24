function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderFields(fields = []) {
  if (!fields.length) return '';
  return `
    <div class="fields">
      ${fields.map(item => `
        <div class="field">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value || 'N/D')}</strong>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTable(columns = [], rows = []) {
  if (!rows.length) return '<p class="empty">Sem dados para apresentar.</p>';
  return `
    <table>
      <thead>
        <tr>${columns.map(column => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            ${columns.map(column => `<td>${escapeHtml(row[column.key] || 'N/D')}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderSection(section) {
  return `
    <section>
      <h2>${escapeHtml(section.title)}</h2>
      ${section.description ? `<p class="description">${escapeHtml(section.description)}</p>` : ''}
      ${renderFields(section.fields)}
      ${section.table ? renderTable(section.table.columns, section.table.rows) : ''}
    </section>
  `;
}

export function exportReportToPdf({ title, clientName, sections = [] }) {
  const issuedAt = new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date());

  const html = `
    <!doctype html>
    <html lang="pt">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page { margin: 18mm; }
          * { box-sizing: border-box; }
          body { margin: 0; color: #111827; font-family: Inter, Arial, sans-serif; background: #fff; }
          .report { max-width: 920px; margin: 0 auto; }
          header { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 22px; border-bottom: 3px solid #111827; }
          .brand { display: flex; align-items: center; gap: 12px; }
          .brand-mark { width: 44px; height: 44px; display: grid; place-items: center; color: #fff; background: #111827; border-radius: 12px; font-weight: 800; }
          .brand strong { display: block; font-size: 18px; letter-spacing: -0.02em; }
          .brand span, .meta span { color: #667085; font-size: 12px; }
          .meta { text-align: right; }
          .meta strong { display: block; margin-top: 4px; font-size: 13px; }
          h1 { margin: 28px 0 6px; font-size: 30px; letter-spacing: -0.04em; }
          .client { margin: 0 0 24px; color: #475467; font-size: 14px; }
          section { margin-top: 24px; break-inside: avoid; }
          h2 { margin: 0 0 12px; font-size: 17px; color: #1d2939; }
          .description { margin: 0 0 14px; color: #475467; line-height: 1.55; white-space: pre-wrap; }
          .fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 14px; }
          .field { padding: 12px; border: 1px solid #e4e7ec; border-radius: 10px; background: #f8fafc; }
          .field span { display: block; color: #667085; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
          .field strong { display: block; margin-top: 4px; font-size: 14px; white-space: pre-wrap; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { text-align: left; color: #344054; background: #f2f4f7; }
          th, td { padding: 10px; border: 1px solid #e4e7ec; vertical-align: top; }
          td { color: #1d2939; white-space: pre-wrap; }
          .empty { padding: 14px; color: #667085; background: #f8fafc; border: 1px solid #e4e7ec; border-radius: 10px; }
          footer { margin-top: 28px; padding-top: 14px; border-top: 1px solid #e4e7ec; color: #98a2b3; font-size: 11px; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="report">
          <header>
            <div class="brand">
              <div class="brand-mark">CB</div>
              <div><strong>CyberBox Secur</strong><span>Relatorio de ciberseguranca</span></div>
            </div>
            <div class="meta">
              <span>Data de emissao</span>
              <strong>${escapeHtml(issuedAt)}</strong>
            </div>
          </header>
          <h1>${escapeHtml(title)}</h1>
          <p class="client"><strong>Cliente:</strong> ${escapeHtml(clientName || 'N/D')}</p>
          ${sections.map(renderSection).join('')}
          <footer>Documento gerado pela plataforma CyberBox Secur.</footer>
        </div>
        <script>
          window.addEventListener('load', () => {
            window.focus();
            window.print();
          });
        </script>
      </body>
    </html>
  `;

  const popup = window.open('', '_blank', 'width=1000,height=800');
  if (!popup) {
    throw new Error('O browser bloqueou a janela de exportacao.');
  }

  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}
