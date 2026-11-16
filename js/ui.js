/* ==========================================================================
   ServiX — Shared UI behaviour: toasts, modals, filters, forms, CSV export
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Toast ---------- */
  const TOAST_TONES = { info: 'bg-navy-800', success: 'bg-ok', error: 'bg-bad' };
  function toast(message, type = 'info') {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack fixed bottom-5 right-5 z-[300] flex max-w-[calc(100vw-40px)] flex-col gap-2';
      stack.setAttribute('role', 'status');
      document.body.append(stack);
    }
    const node = document.createElement('div');
    node.className = `animate-toast-in rounded-[10px] px-4 py-3 text-white shadow-xl ${TOAST_TONES[type] || TOAST_TONES.info}`;
    node.textContent = message;
    stack.append(node);
    setTimeout(() => node.remove(), 3200);
  }
  window.ServixUI = { toast };

  /* ---------- CSV export ---------- */
  function exportTable(table) {
    const cell = node => `"${node.innerText.replace(/\s+/g, ' ').trim().replaceAll('"', '""')}"`;
    const rows = [...table.querySelectorAll('tr')]
      .filter(row => !row.hidden)
      .map(row => [...row.cells].map(cell).join(','));
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'servix-report.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    toast('Report exported successfully', 'success');
  }

  /* ---------- Delegated clicks ---------- */
  document.addEventListener('click', event => {
    const toastTrigger = event.target.closest('[data-toast]');
    if (toastTrigger) {
      event.preventDefault();
      toast(toastTrigger.dataset.toast);
      return;
    }

    const opener = event.target.closest('[data-modal-open]');
    if (opener) {
      document.querySelector(opener.dataset.modalOpen)?.showModal();
      return;
    }

    const closer = event.target.closest('[data-modal-close]');
    if (closer) {
      closer.closest('dialog').close();
      return;
    }

    const remove = event.target.closest('[data-action="delete"]');
    if (remove && window.confirm('Delete this item?')) {
      remove.closest('tr').remove();
      toast('Item deleted', 'success');
      return;
    }

    const page = event.target.closest('.pagination button');
    if (page) {
      page.parentElement.querySelectorAll('button').forEach(button => button.classList.remove('is-active'));
      page.classList.add('is-active');
      return;
    }

    const exporter = event.target.closest('[data-export]');
    if (exporter) exportTable(document.querySelector(exporter.dataset.export));
  });

  /* ---------- Search & filter for tables and card grids ---------- */
  function matches(item, control) {
    const value = control.value.trim().toLowerCase();
    if (!value) return true;
    if (control.tagName === 'SELECT') {
      return (item.dataset[control.dataset.key || 'category'] || '').toLowerCase() === value;
    }
    return item.textContent.toLowerCase().includes(value);
  }

  function initListFilters() {
    const controls = [...document.querySelectorAll('[data-filter-list]')];
    const params = new URLSearchParams(window.location.search);

    [...new Set(controls.map(control => control.dataset.filterList))].forEach(listId => {
      const group = controls.filter(control => control.dataset.filterList === listId);
      const apply = () => {
        document.querySelectorAll(`#${listId} [data-item]`).forEach(item => {
          item.hidden = !group.every(control => matches(item, control));
        });
      };
      group.forEach(control => control.addEventListener('input', apply));

      const search = group.find(control => control.tagName === 'INPUT');
      if (search && params.get('q')) search.value = params.get('q');
      apply();
    });
  }

  /* ---------- Forms ---------- */
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        toast(form.dataset.success || 'Saved successfully', 'success');
        form.reset();
        if (form.dataset.redirect) {
          setTimeout(() => { window.location.href = form.dataset.redirect; }, 1200);
        }
      });
    });

    document.querySelectorAll('form[data-add]').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        window.ServixRender.addRecord(form.dataset.add, Object.fromEntries(new FormData(form)));
        form.reset();
        form.closest('dialog').close();
        toast('Added successfully', 'success');
      });
    });
  }

  initListFilters();
  initForms();
})();
