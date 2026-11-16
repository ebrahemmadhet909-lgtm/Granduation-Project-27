/* ==========================================================================
   ServiX — Builds the shared sidebar + topbar around each page's <main>
   Configure per page through <body data-layout data-active data-title>.
   Styling uses Tailwind utility classes (see tailwind.config.js).
   ========================================================================== */
(function () {
  'use strict';

  const NAVIGATION = {
    client: [
      { id: 'home', label: 'Home', icon: '🏠', href: 'home.html' },
      { id: 'services', label: 'Services', icon: '🧰', href: 'services.html' },
      { id: 'about', label: 'About Us', icon: 'ℹ️', href: 'about.html' },
      { id: 'emergency', label: 'Emergency', icon: '🚨', href: 'emergency.html' },
      { id: 'contact', label: 'Contact', icon: '✉️', href: 'contact.html' },
      { id: 'request', label: 'Request Service', icon: '📝', href: 'request-service.html' },
      { id: 'assistant', label: 'AI Assistant', icon: '✨', href: 'ai-assistant.html' }
    ],
    admin: [
      { id: 'dashboard', label: 'Home', icon: '🏠', href: 'admin-dashboard.html' },
      { id: 'admin-services', label: 'Service Management', icon: '🗂️', href: 'admin-services.html' },
      { id: 'admin-users', label: 'Users', icon: '👤', href: 'admin-users.html' },
      { id: 'admin-requests', label: 'Service Requests', icon: '📋', href: 'admin-requests.html' },
      { id: 'admin-providers', label: 'Service Providers', icon: '🧑‍🔧', href: 'admin-providers.html' },
      { id: 'admin-reports', label: 'Reports', icon: '📊', href: 'admin-reports.html' },
      { id: 'admin-settings', label: 'Settings', icon: '⚙️', href: 'admin-settings.html' }
    ]
  };

  const HOME = { client: 'home.html', admin: 'admin-dashboard.html' };
  const PROFILE = { client: 'account.html', admin: 'admin-settings.html' };
  const USER = { name: 'Ahmed Mohamed', initials: 'AM', roles: { client: 'Client', admin: 'Admin' } };

  /* ---------- Tailwind class sets ---------- */
  const CLS = {
    app: 'flex min-h-screen',
    sidebar: 'sticky top-0 z-[60] flex h-screen w-60 shrink-0 flex-col overflow-y-auto bg-navy-800 px-3 py-4 text-white ' +
             'max-[991px]:fixed max-[991px]:inset-y-0 max-[991px]:left-0 max-[991px]:-translate-x-full max-[991px]:transition-transform',
    sidebarClosed: 'max-[991px]:-translate-x-full',
    backdrop: 'fixed inset-0 z-[55] bg-navy-900/55',
    brand: 'flex items-center gap-2 px-2 pb-[22px] pt-1 text-[1.7rem] font-extrabold text-white [&_b]:text-accent [&_img]:h-[42px] [&_img]:w-[42px]',
    nav: 'flex flex-col gap-1.5',
    link: 'flex items-center gap-3 rounded-lg px-3.5 py-[11px] font-semibold transition-colors',
    linkIdle: 'text-[#dbe9ff] hover:bg-white/10',
    linkActive: 'bg-brand-500 text-white',
    icon: 'w-[22px] text-center',
    footer: 'mt-auto flex flex-col gap-1.5 border-t border-white/20 pt-5',
    copy: 'px-3.5 pt-2.5 text-xs text-[#9fbbe0]',
    main: 'flex min-w-0 flex-1 flex-col',
    topbar: 'sticky top-0 z-40 flex min-h-16 items-center gap-3.5 px-6 py-2.5 max-[600px]:px-4',
    topbarClient: 'border-b border-line bg-white',
    topbarAdmin: 'bg-navy-800 text-white',
    title: 'text-[1.15rem] font-extrabold',
    titleClient: 'text-navy-800',
    titleAdmin: 'text-white max-[600px]:hidden',
    spacer: 'flex-1',
    search: 'w-full min-w-0 rounded-full border-0 bg-[#1d4f8a] px-4 py-2 text-white placeholder:text-[#b7cdea] focus:outline-none',
    searchForm: 'min-w-0 flex-[0_1_340px]',
    menuBtn: 'menu-toggle relative hidden h-9 w-9 place-items-center rounded-full bg-brand-100 text-navy-800 max-[991px]:inline-grid',
    iconBtn: 'relative inline-grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-navy-800 transition hover:brightness-95',
    dot: 'absolute right-[6px] top-[5px] h-[9px] w-[9px] rounded-full border-2 border-white bg-bad',
    chip: 'flex items-center gap-2.5',
    avatar: 'inline-grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-brand-100 text-[.8rem] font-extrabold text-navy-800',
    chipText: 'flex flex-col leading-tight max-[600px]:hidden',
    chipName: 'text-[.85rem]',
    chipRoleClient: '',
    chipRoleAdmin: '!text-[#b7cdea]'
  };

  const create = (tag, className, html) => {
    const node = document.createElement(tag);
    node.className = className;
    node.innerHTML = html;
    return node;
  };

  const navLink = ({ id, label, icon, href }, active, extra = '') =>
    `<a class="${CLS.link} ${id === active ? CLS.linkActive : CLS.linkIdle} ${extra}" href="${href}"${id === active ? ' aria-current="page"' : ''}>
       <span class="${CLS.icon}" aria-hidden="true">${icon}</span>${label}
     </a>`;

  function buildSidebar(layout, active) {
    const links = NAVIGATION[layout].map(link => navLink(link, active)).join('');
    const account = layout === 'client'
      ? navLink({ id: 'account', label: 'My Account', icon: '👤', href: 'account.html' }, active)
      : '';

    return create('aside', CLS.sidebar, `
      <a class="${CLS.brand}" href="${HOME[layout]}"><img src="assets/logo.svg" alt=""><span>Servi<b>X</b></span></a>
      <nav class="${CLS.nav}" aria-label="Main navigation">${links}</nav>
      <div class="${CLS.footer}">
        ${account}
        <a class="${CLS.link} ${CLS.linkIdle}" href="index.html" data-logout><span class="${CLS.icon}" aria-hidden="true">↪</span>Log Out</a>
        <p class="${CLS.copy}">© 2026 ServiX. All rights reserved.</p>
      </div>`);
  }

  function buildTopbar(layout, title) {
    const isAdmin = layout === 'admin';
    const heading = isAdmin ? 'Welcome, Admin' : title;
    const search = isAdmin
      ? `<form class="${CLS.searchForm}" action="admin-requests.html" role="search">
           <input class="${CLS.search}" type="search" name="q" placeholder="Search for a service or user..." aria-label="Search">
         </form>`
      : '';

    return create('header', `${CLS.topbar} ${isAdmin ? CLS.topbarAdmin : CLS.topbarClient}`, `
      <button class="${CLS.menuBtn}" type="button" aria-label="Open menu" aria-expanded="false">☰</button>
      <h2 class="${CLS.title} ${isAdmin ? CLS.titleAdmin : CLS.titleClient}">${heading}</h2>
      <span class="${CLS.spacer}"></span>
      ${search}
      <button class="${CLS.iconBtn}" type="button" aria-label="Notifications" data-toast="You have 3 new notifications">🔔<span class="${CLS.dot}"></span></button>
      <a class="${CLS.chip}" href="${PROFILE[layout]}">
        <span class="${CLS.avatar}">${USER.initials}</span>
        <span class="${CLS.chipText}"><strong class="${CLS.chipName}">${USER.name}</strong><small class="${isAdmin ? CLS.chipRoleAdmin : CLS.chipRoleClient}">${USER.roles[layout]}</small></span>
      </a>`);
  }

  function init() {
    const { layout, active = '', title = document.title.replace(/^ServiX\s*\|\s*/, '') } = document.body.dataset;
    const content = document.querySelector('main');
    if (!layout || !content) return;

    const sidebar = buildSidebar(layout, active);
    const topbar = buildTopbar(layout, title);
    const backdrop = create('div', CLS.backdrop, '');
    backdrop.hidden = true;

    const main = create('div', CLS.main, '');
    main.append(topbar, content);

    const app = create('div', CLS.app, '');
    app.append(sidebar, backdrop, main);
    document.body.prepend(app);

    const toggle = topbar.querySelector('.menu-toggle');
    const setMenu = open => {
      // On small screens the sidebar is off-canvas; opening it removes the translate class.
      sidebar.classList.toggle(CLS.sidebarClosed, !open);
      backdrop.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    };
    const isOpen = () => !sidebar.classList.contains(CLS.sidebarClosed);

    toggle.addEventListener('click', () => setMenu(!isOpen()));
    backdrop.addEventListener('click', () => setMenu(false));
    sidebar.addEventListener('click', event => event.target.closest('a') && setMenu(false));
    document.addEventListener('keydown', event => event.key === 'Escape' && setMenu(false));
    window.addEventListener('resize', () => window.innerWidth > 991 && setMenu(false));
    backdrop.hidden = true;

    sidebar.querySelector('[data-logout]').addEventListener('click', () => {
      try { sessionStorage.removeItem('servix:role'); } catch (error) { /* storage unavailable */ }
    });
  }

  init();
})();
