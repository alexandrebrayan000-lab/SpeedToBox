/**
 * Cyberpunk Toast Notification Manager
 */

class CyberToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', title = null, duration = 3500) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `cyber-toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    } else {
      iconSvg = `<svg class="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="flex-1">
        ${title ? `<div class="font-semibold text-xs tracking-wider uppercase text-cyan-300 mb-0.5">${title}</div>` : ''}
        <div class="text-sm font-medium text-slate-100">${message}</div>
      </div>
      <button class="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer transition-colors" onclick="this.parentElement.remove()">✕</button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, duration);
  }

  success(msg, title = 'Sucesso') {
    this.show(msg, 'success', title);
  }

  error(msg, title = 'Atenção') {
    this.show(msg, 'error', title);
  }

  info(msg, title = 'Sistema') {
    this.show(msg, 'info', title);
  }
}

window.cyberToast = new CyberToastManager();
