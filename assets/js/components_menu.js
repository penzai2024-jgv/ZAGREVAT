class ZagMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="fixed inset-0 z-[60] bg-white flex-col p-6 hidden" data-menu-overlay>
        <div class="flex items-center justify-between mb-16">
          <div class="flex items-center gap-3">
            <img src="./assets/Isologotipo.svg" alt="ZAGREVAT logo" class="h-8 w-8">
            <span class="font-bold text-xl tracking-tight text-slate-900">ZAGREVAT</span>
          </div>
          <button aria-label="Cerrar menú" class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-slate-900" data-menu-close>
            <span class="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>
        <nav class="flex flex-col gap-7">
          <a class="text-4xl font-extrabold flex items-center justify-between" href="#inicio">
            <span class="text-pink-600">Inicio</span>
            <span class="material-symbols-outlined text-pink-600">check_circle</span>
          </a>
          <a class="text-4xl font-extrabold text-slate-900/80" href="#ecosistema">Pilatos</a>
          <a class="text-4xl font-extrabold text-slate-900/40 hover:text-slate-900 transition-colors" href="#servicios">Servicios</a>
          <a class="text-4xl font-extrabold text-slate-900/40 hover:text-slate-900 transition-colors" href="#impacto">Impacto</a>
          <a class="text-4xl font-extrabold text-slate-900/40 hover:text-slate-900 transition-colors" href="#contacto">Contacto</a>
        </nav>
        <div class="mt-auto pb-12">
          <p class="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-semibold">Conéctate con nosotros</p>
          <div class="flex gap-4">
            <a class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-700" href="#contacto"><span class="material-symbols-outlined">mail</span></a>
            <a class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-700" href="#"><span class="material-symbols-outlined">share</span></a>
            <a class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-700" href="#"><span class="material-symbols-outlined">language</span></a>
          </div>
        </div>
      </div>

      <nav class="sticky top-0 bg-black/90 backdrop-blur border-b border-gray-800 z-50">
        <div class="header max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img src="./assets/Isologotipo.svg" alt="ZAGREVAT logo" class="h-8 w-8">
            <h1 class="font-bold text-xl tracking-tight text-white">ZAGREVAT</h1>
          </div>
          <a href="#contacto" class="hidden md:inline-block text-sm font-semibold text-white hover:text-gray-300">Contáctanos</a>
          <button aria-label="Abrir menú" class="md:hidden text-white" data-menu-open>
            <span class="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </nav>
    `;

    const overlay = this.querySelector('[data-menu-overlay]');
    const openButton = this.querySelector('[data-menu-open]');
    const closeButton = this.querySelector('[data-menu-close]');

    openButton?.addEventListener('click', () => {
      overlay?.classList.remove('hidden');
      overlay?.classList.add('flex');
      document.body.classList.add('overflow-hidden');
    });

    closeButton?.addEventListener('click', () => {
      overlay?.classList.add('hidden');
      overlay?.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    });

    overlay?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }
}

customElements.define('zag-menu', ZagMenu);
