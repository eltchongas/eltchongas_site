// This file is loaded only by pages that support switching themes.
(() => {
  let dark = false;
  try { dark = localStorage.getItem('eltchongas-theme') === 'dark'; } catch (_) {}
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    function sync() {
      button.textContent = dark ? 'Modo claro' : 'Modo escuro';
      button.setAttribute('aria-pressed', String(dark));
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    }
    button?.addEventListener('click', () => {
      dark = !dark;
      try { localStorage.setItem('eltchongas-theme', dark ? 'dark' : 'light'); } catch (_) {}
      sync();
    });
    if (button) sync();
  });
})();
