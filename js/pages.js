/* ==========================================================================
   ServiX — Page-specific behaviour, selected with <body data-page="...">
   ========================================================================== */
(function () {
  'use strict';

  const { CATALOG } = window.ServixData;
  const params = new URLSearchParams(window.location.search);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const serviceOptions = selected => Object.values(CATALOG)
    .map(item => `<option value="${item.id}"${item.id === selected ? ' selected' : ''}>${item.name}</option>`)
    .join('');

  /* ---------- Login / sign up ---------- */
  function initLogin() {
    const form = $('#loginForm');
    const nameInput = $('#fullName');
    let mode = 'login';

    const redirect = role => {
      try { sessionStorage.setItem('servix:role', role); } catch (error) { /* storage unavailable */ }
      window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'home.html';
    };

    const renderMode = () => {
      const signup = mode === 'signup';
      $$('[data-signup-only]').forEach(node => { node.hidden = !signup; });
      $$('[data-login-only]').forEach(node => { node.hidden = signup; });
      nameInput.required = signup;
      $('[data-auth-title]').textContent = signup ? 'Create your account' : 'Welcome back!';
      $('[data-auth-subtitle]').textContent = signup ? 'Sign up to start requesting services' : 'Sign in to continue and enjoy our services';
      $('[data-auth-submit]').firstChild.textContent = signup ? 'Sign Up ' : 'Log In ';
      $('[data-auth-switch-text]').textContent = signup ? 'Already have an account?' : "Don't have an account?";
      $('[data-auth-toggle]').textContent = signup ? 'Log in' : 'Create an account';
    };

    $('[data-auth-toggle]').addEventListener('click', event => {
      event.preventDefault();
      mode = mode === 'login' ? 'signup' : 'login';
      renderMode();
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const identity = form.elements.identity.value.trim().toLowerCase();
      redirect(identity.startsWith('admin') ? 'admin' : 'client');
    });

    $$('[data-signin]').forEach(button =>
      button.addEventListener('click', () => redirect(button.dataset.signin)));

    renderMode();
  }

  /* ---------- Request a service (with image upload) ---------- */
  function initRequest() {
    const select = $('#serviceCategory');
    select.innerHTML = `<option value="" disabled selected>Select service type</option>${serviceOptions(params.get('service'))}`;

    const input = $('#imageInput');
    const preview = $('#imagePreview');
    const hint = $('#imageHint');
    const MAX_SIZE = 5 * 1024 * 1024;

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/') || file.size > MAX_SIZE) {
        window.ServixUI.toast('Please choose an image smaller than 5 MB', 'error');
        input.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
        preview.hidden = false;
        hint.hidden = true;
      };
      reader.readAsDataURL(file);
    });

    $('#requestForm').addEventListener('reset', () => {
      preview.hidden = true;
      hint.hidden = false;
    });
  }

  /* ---------- Service details ---------- */
  function initDetails() {
    const item = CATALOG[params.get('service')] || CATALOG['general-maintenance'];
    document.title = `ServiX | ${item.name}`;

    $$('[data-bind]').forEach(node => { node.textContent = item[node.dataset.bind]; });
    $('#detailsBook').href = `booking.html?service=${item.id}`;

    $('#quickBook').addEventListener('submit', event => {
      event.preventDefault();
      const query = new URLSearchParams({ service: item.id });
      const { name, note } = event.target.elements;
      if (name.value) query.set('name', name.value);
      if (note.value) query.set('note', note.value);
      window.location.href = `booking.html?${query}`;
    });
  }

  /* ---------- Booking ---------- */
  function initBooking() {
    const form = $('#bookingForm');
    const service = form.elements.service;
    service.innerHTML = `<option value="" disabled selected>Choose a service</option>${serviceOptions(params.get('service'))}`;

    form.elements.date.min = new Date().toISOString().slice(0, 10);
    if (params.get('name')) form.elements.name.value = params.get('name');
    if (params.get('note')) form.elements.note.value = params.get('note');

    const updateSummary = () => {
      const item = CATALOG[service.value];
      const { date, time } = form.elements;
      $('[data-summary="service"]').textContent = item ? item.name : 'Not selected yet';
      $('[data-summary="price"]').textContent = item ? item.price : 'Not selected';
      $('[data-summary="date"]').textContent = date.value
        ? new Date(`${date.value}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Not selected';
      $('[data-summary="time"]').textContent = time.value || 'Not selected';
    };

    form.addEventListener('input', updateSummary);
    form.addEventListener('reset', () => setTimeout(updateSummary));
    updateSummary();
  }

  /* ---------- AI assistant (canned replies) ---------- */
  function initAssistant() {
    const log = $('#chatLog');
    const form = $('#chatForm');
    const input = $('#chatInput');

    const REPLIES = [
      { words: ['car', 'engine', 'tire', 'oil', 'battery'], text: 'We offer several car services: Car Maintenance, Engine Repair, Oil Change, Tire Replacement and Car Battery. Open Car Services to book one.' },
      { words: ['home', 'house', 'repair'], text: 'For your home we can send plumbers, electricians, AC technicians, cleaners, painters and carpenters. Browse Home Services to get started.' },
      { words: ['plumb', 'leak', 'pipe'], text: 'Our plumbers handle leaks, pipe repairs and installations. You can book one from the Plumbing page.' },
      { words: ['medical', 'doctor', 'nurse', 'health', 'lab'], text: 'Medical services include doctor visits, nursing care, lab tests, dental care and home healthcare.' },
      { words: ['ac', 'air', 'cool'], text: 'AC technicians can clean, repair, install and inspect your unit. Check the AC Maintenance page.' },
      { words: ['track', 'status', 'order', 'request'], text: 'You can follow every request from the Service Requests list in your account. Need a new one? Use Request Service.' },
      { words: ['emergency', 'urgent', 'ambulance'], text: 'For emergencies call 1234 right away or open the Emergency page to request immediate help.' }
    ];

    const addBubble = (text, isUser) => {
      const bubble = document.createElement('div');
      bubble.className = `max-w-[min(80%,460px)] rounded-[14px] px-3.5 py-2.5 text-[.92rem] ${isUser ? 'self-end bg-navy-800 text-white' : 'bg-brand-100'}`;
      bubble.textContent = text;
      log.append(bubble);
      log.scrollTop = log.scrollHeight;
    };

    const reply = message => {
      const lower = message.toLowerCase();
      const match = REPLIES.find(entry => entry.words.some(word => lower.includes(word)));
      return match ? match.text : "I can help you find services, book appointments and answer your questions. Try asking about car, home or medical services.";
    };

    const send = message => {
      addBubble(message, true);
      setTimeout(() => addBubble(reply(message), false), 500);
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      input.value = '';
      send(message);
    });

    $$('[data-prompt]').forEach(button =>
      button.addEventListener('click', () => send(button.dataset.prompt)));
  }

  const PAGES = {
    login: initLogin,
    request: initRequest,
    details: initDetails,
    booking: initBooking,
    assistant: initAssistant
  };

  PAGES[document.body.dataset.page]?.();
})();
