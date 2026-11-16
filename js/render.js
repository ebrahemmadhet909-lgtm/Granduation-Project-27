/* ==========================================================================
   ServiX — Renders tables, card grids, lists and charts from ServixData
   ========================================================================== */
(function () {
  'use strict';

  const { CATALOG, COLLECTIONS, RECORDS } = window.ServixData;

  /* ---------- Helpers ---------- */
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const initials = name => name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase();
  const BADGE_BASE = 'inline-block whitespace-nowrap rounded-full px-2.5 py-[3px] text-[.74rem] font-bold';
  const BADGE_TONES = {
    green: 'bg-ok-bg text-ok', active: 'bg-ok-bg text-ok', completed: 'bg-ok-bg text-ok', low: 'bg-ok-bg text-ok',
    blue: 'bg-brand-100 text-brand-600', 'in-progress': 'bg-brand-100 text-brand-600', user: 'bg-brand-100 text-brand-600',
    amber: 'bg-warn-bg text-warn', pending: 'bg-warn-bg text-warn', medium: 'bg-warn-bg text-warn',
    red: 'bg-bad-bg text-bad', blocked: 'bg-bad-bg text-bad', suspended: 'bg-bad-bg text-bad', high: 'bg-bad-bg text-bad', new: 'bg-bad-bg text-bad',
    purple: 'bg-plum-bg text-plum', admin: 'bg-plum-bg text-plum', 'service-provider': 'bg-plum-bg text-plum'
  };
  const badge = (text, tone) =>
    `<span class="${BADGE_BASE} ${BADGE_TONES[tone || slug(text)] || 'bg-mute-bg text-mute'}">${escapeHtml(text)}</span>`;

  /* Chart palette (matches tailwind.config.js) */
  const CHART = ['#1688f0', '#16a34a', '#f5a31a', '#e5484d', '#7c3aed'];
  const chartColor = index => CHART[(index - 1) % CHART.length];
  const serviceUrl = item => item.href || `service-details.html?service=${item.id}`;

  const person = (name, sub) => `
    <div class="flex items-center gap-2.5 [&_strong]:block [&_strong]:text-[.88rem] [&_small]:block">
      <span class="inline-grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-brand-100 text-[.8rem] font-extrabold text-navy-800">${initials(name)}</span>
      <div><strong>${escapeHtml(name)}</strong>${sub ? `<small>${escapeHtml(sub)}</small>` : ''}</div>
    </div>`;

  const menuButton = `<button class="relative inline-grid place-items-center rounded-full transition hover:brightness-95 bg-brand-100 text-navy-800 h-9 w-9" type="button" aria-label="More actions" data-toast="More actions coming soon">⋮</button>`;
  const checkbox = label => `<td><input type="checkbox" aria-label="Select ${escapeHtml(label)}"></td>`;

  /* ---------- Table row templates ---------- */
  const ROW_TEMPLATES = {
    services: s => `
      <tr data-item data-category="${escapeHtml(s.category)}" data-status="${escapeHtml(s.status)}">
        ${checkbox(s.name)}
        <td><div class="flex items-center gap-2.5 [&_strong]:block [&_strong]:text-[.88rem] [&_small]:block"><span class="inline-grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] bg-brand-100 text-[1.1rem]">${s.icon}</span><div><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.desc)}</small></div></div></td>
        <td>${badge(s.category, s.tone)}</td>
        <td>${escapeHtml(s.provider)}</td>
        <td>${badge(s.status)}</td>
        <td><strong>${escapeHtml(s.price)}</strong> <small>${escapeHtml(s.note || '')}</small></td>
        <td><div class="flex gap-1.5">
          <button class="relative inline-grid place-items-center rounded-full transition hover:brightness-95 bg-brand-100 text-navy-800 h-7 w-7 text-[.8rem]" type="button" aria-label="View" data-toast="Viewing ${escapeHtml(s.name)}">👁</button>
          <button class="relative inline-grid place-items-center rounded-full transition hover:brightness-95 bg-brand-100 text-navy-800 h-7 w-7 text-[.8rem]" type="button" aria-label="Edit" data-toast="Editing ${escapeHtml(s.name)}">✏️</button>
          <button class="relative inline-grid place-items-center rounded-full transition hover:brightness-95 bg-bad-bg text-bad h-7 w-7 text-[.8rem]" type="button" aria-label="Delete" data-action="delete">🗑</button>
        </div></td>
      </tr>`,

    requests: r => `
      <tr data-item data-status="${escapeHtml(r.status)}" data-category="${escapeHtml(r.type)}">
        ${checkbox(r.id)}
        <td><strong>${escapeHtml(r.id)}</strong></td>
        <td>${person(r.user, r.email)}</td>
        <td>${escapeHtml(r.type)}</td>
        <td>${escapeHtml(r.location)}</td>
        <td>${badge(r.status)}</td>
        <td>${badge(r.priority)}</td>
        <td>${escapeHtml(r.date)}</td>
        <td>${menuButton}</td>
      </tr>`,

    users: u => `
      <tr data-item data-status="${escapeHtml(u.status)}" data-category="${escapeHtml(u.role)}">
        ${checkbox(u.name)}
        <td>${person(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.phone)}</td>
        <td>${badge(u.role)}</td>
        <td>${badge(u.status)}</td>
        <td>${escapeHtml(u.joined)}</td>
        <td>${menuButton}</td>
      </tr>`,

    providers: p => `
      <tr data-item data-status="${escapeHtml(p.status)}" data-category="${escapeHtml(p.type)}">
        <td><strong>${escapeHtml(p.id)}</strong></td>
        <td>${person(p.name)}</td>
        <td>${escapeHtml(p.email)}</td>
        <td>${escapeHtml(p.phone)}</td>
        <td>${escapeHtml(p.type)}</td>
        <td>${badge(p.status)}</td>
        <td><span style="color:var(--gold)">★</span> ${escapeHtml(p.rating)}</td>
        <td>${menuButton}</td>
      </tr>`,

    reports: r => `
      <tr data-item data-category="${escapeHtml(r.category)}">
        <td><strong>${escapeHtml(r.id)}</strong></td>
        <td>${escapeHtml(r.name)}</td>
        <td>${escapeHtml(r.category)}</td>
        <td>${escapeHtml(r.period)}</td>
        <td>${escapeHtml(r.total)}</td>
        <td class="text-ok"><strong>${escapeHtml(r.change)}</strong></td>
      </tr>`
  };

  function updateCounts(name) {
    document.querySelectorAll(`[data-count-for="${name}"]`).forEach(node => {
      node.textContent = node.dataset.template.replaceAll('{n}', RECORDS[name].length);
    });
  }

  function renderTable(body) {
    const name = body.dataset.source;
    body.innerHTML = RECORDS[name].map(ROW_TEMPLATES[name]).join('');
    updateCounts(name);
  }

  /** Adds a record coming from an "Add ..." dialog and re-renders its table. */
  function addRecord(name, data) {
    const today = new Date().toISOString().slice(0, 10).replaceAll('-', '/');
    const defaults = {
      services: { desc: 'Newly added service.', tone: 'blue', status: 'Active', note: '(Starting)', icon: '🛠️', price: `$${data.price || 0}` },
      users: { status: 'Pending', joined: today },
      providers: { id: `#P-${String(RECORDS.providers.length + 1).padStart(3, '0')}`, status: 'Pending', rating: '—' }
    };
    RECORDS[name].push({ ...defaults[name], ...data, ...(name === 'services' ? { price: defaults.services.price } : {}) });
    const body = document.querySelector(`[data-render="table"][data-source="${name}"]`);
    if (body) renderTable(body);
  }

  /* ---------- Card grids ---------- */
  function renderCards(host) {
    const showPrice = host.dataset.showPrice !== undefined;
    host.innerHTML = COLLECTIONS[host.dataset.source].map(id => {
      const item = CATALOG[id];
      const footer = showPrice
        ? `<div class="flex items-center justify-between gap-2 text-[.85rem] font-bold text-brand-600"><span>${escapeHtml(item.price)}</span>${item.status ? badge(item.status) : ''}</div>`
        : '<span class="text-[.85rem] font-bold text-brand-600 group-[.tiles--dark]:text-[#6cb8ff]">View Details →</span>';
      return `
        <a class="flex flex-col gap-1.5 rounded-2xl bg-white p-4 shadow-card transition [a&]:hover:-translate-y-[3px] [a&]:hover:shadow-lg [&_h3]:text-base [&_p]:flex-1 [&_p]:text-[.85rem] [&_p]:text-mute group-[.tiles--dark]:bg-navy-800 group-[.tiles--dark]:text-white group-[.tiles--dark]:items-center group-[.tiles--dark]:text-center group-[.tiles--dark]:[&_h3]:text-white group-[.tiles--dark]:[&_p]:text-[#c4d8f2]" href="${serviceUrl(item)}" data-item data-group="${item.group}">
          <span class="grid h-12 w-12 place-items-center rounded-xl text-2xl group-[.tiles--dark]:bg-white bg-brand-100" aria-hidden="true">${item.icon}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.desc)}</p>
          ${footer}
        </a>`;
    }).join('');
  }

  function renderRecent(host) {
    host.innerHTML = RECORDS.recent.map(r => `
      <li class="flex items-center gap-3 border-b border-line pb-3 last:border-0 last:pb-0 [&_strong]:block [&_strong]:text-[.9rem]">
        <span class="inline-grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] bg-brand-100 text-[1.1rem]">${r.icon}</span>
        <div><strong>${escapeHtml(r.title)}</strong><small>${escapeHtml(r.sub)}</small></div>
        <div class="ml-auto text-right [&_small]:block">${badge(r.status)}<small>${escapeHtml(r.time)}</small></div>
      </li>`).join('');
  }

  /* ---------- Charts ---------- */
  const niceMax = value => {
    const step = Math.pow(10, Math.floor(Math.log10(value)));
    return Math.ceil(value / step) * step;
  };

  function renderLineChart(host) {
    const { labels, series } = JSON.parse(host.dataset.lineChart);
    const W = 600, H = 240, pad = { l: 40, r: 16, t: 16, b: 30 };
    const max = niceMax(Math.max(...series.flatMap(s => s.values)));
    const x = i => pad.l + i * ((W - pad.l - pad.r) / (labels.length - 1));
    const y = v => pad.t + (1 - v / max) * (H - pad.t - pad.b);

    const grid = [0, 1, 2, 3, 4].map(i => {
      const v = (max / 4) * i;
      return `<line class="stroke-line" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/>
              <text class="fill-mute text-[11px]" x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end">${Math.round(v)}</text>`;
    }).join('');

    const xLabels = labels.map((label, i) =>
      `<text class="fill-mute text-[11px]" x="${x(i)}" y="${H - 8}" text-anchor="middle">${escapeHtml(label)}</text>`).join('');

    const lines = series.map((s, index) => {
      const color = chartColor(s.color || index + 1);
      const points = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
      const area = `${x(0)},${y(0)} ${points} ${x(labels.length - 1)},${y(0)}`;
      const dots = s.values.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${color}"/>`).join('');
      return `<polygon points="${area}" fill="${color}" opacity="0.08"/>
              <polyline class="fill-none [stroke-width:2.5] [stroke-linejoin:round]" points="${points}" stroke="${color}"/>${dots}`;
    }).join('');

    const legend = series.map((s, index) =>
      `<li><span class="h-2.5 w-2.5 rounded-full" style="background:${chartColor(s.color || index + 1)}"></span>${escapeHtml(s.name)}</li>`).join('');

    host.innerHTML = `
      <ul class="flex min-w-[170px] text-[.85rem] [&_li]:flex [&_li]:items-center [&_li]:gap-2 [&_b]:ml-auto [&_b]:pl-3 mb-2 flex-row flex-wrap gap-4 [&_b]:m-0 [&_b]:p-0">${legend}</ul>
      <svg class="h-auto w-full" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHtml(host.dataset.label || 'Line chart')}">${grid}${xLabels}${lines}</svg>`;
  }

  function renderDonut(host) {
    const data = JSON.parse(host.dataset.donut);
    const suffix = host.dataset.suffix || '';
    const total = data.reduce((sum, [, value]) => sum + value, 0);
    let offset = 0;
    const stops = data.map(([, value], index) => {
      const start = offset;
      offset += (value / total) * 100;
      return `${chartColor(index + 1)} ${start}% ${offset}%`;
    }).join(', ');

    const legend = data.map(([label, value], index) =>
      `<li><span class="h-2.5 w-2.5 rounded-full" style="background:${chartColor(index + 1)}"></span>${escapeHtml(label)}<b>${value}${suffix}</b></li>`).join('');

    host.innerHTML = `
      <div class="relative grid h-[150px] w-[150px] place-items-center rounded-full after:absolute after:inset-[22%] after:rounded-full after:bg-white after:content-['']" style="background:conic-gradient(${stops})" role="img" aria-label="${escapeHtml(host.dataset.caption || 'Distribution')}">
        <div class="relative z-[1] text-center text-[.72rem] text-mute [&_strong]:block [&_strong]:text-[1.15rem] [&_strong]:text-navy-800"><strong>${escapeHtml(host.dataset.total || total)}</strong>${escapeHtml(host.dataset.caption || '')}</div>
      </div>
      <ul class="flex min-w-[170px] text-[.85rem] [&_li]:flex [&_li]:items-center [&_li]:gap-2 [&_b]:ml-auto [&_b]:pl-3 flex-col gap-2">${legend}</ul>`;
  }

  /* ---------- Boot ---------- */
  document.querySelectorAll('[data-render="table"]').forEach(renderTable);
  document.querySelectorAll('[data-render="cards"]').forEach(renderCards);
  document.querySelectorAll('[data-render="recent"]').forEach(renderRecent);
  document.querySelectorAll('[data-line-chart]').forEach(renderLineChart);
  document.querySelectorAll('[data-donut]').forEach(renderDonut);

  window.ServixRender = { addRecord, updateCounts };
})();
