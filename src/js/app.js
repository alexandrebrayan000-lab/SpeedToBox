/**
 * StockPro Main Application Controller
 * Wires routing, active tab mounting, reactive store updates, and layout dynamics.
 */

class StockProApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.sidebar = null;
    this.topbar = null;
    this.currentViewInstance = null;
  }

  init() {
    // Instantiate layout components
    const sidebarEl = document.getElementById('sidebar-mount');
    const topbarEl = document.getElementById('topbar-mount');

    this.sidebar = new CyberSidebar(this.currentTab, (tab) => this.navigate(tab));
    this.sidebar.renderTo(sidebarEl);
    window.appSidebar = this.sidebar;

    this.topbar = new CyberTopBar();
    this.topbar.renderTo(topbarEl);
    window.cyberTopBar = this.topbar;

    // Sidebar collapse responsiveness
    window.onSidebarToggle = (collapsed) => {
      const mainContainer = document.getElementById('main-content-container');
      if (mainContainer) {
        if (collapsed) {
          mainContainer.classList.remove('ml-64');
          mainContainer.classList.add('ml-20');
        } else {
          mainContainer.classList.remove('ml-20');
          mainContainer.classList.add('ml-64');
        }
      }
    };

    // Global store subscription: automatically re-render active view on data changes
    window.dataStore.subscribe(() => {
      this.renderActiveView();
      if (this.sidebar) this.sidebar.render();
      if (this.topbar) this.topbar.render();
    });

    // Mount initial view
    this.renderActiveView();

    // Setup global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Ctrl + N => Nova venda
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        window.cyberModals.openNewSaleModal();
      }
      // Ctrl + P => Novo produto
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.cyberModals.openNewProductModal();
      }
      // Esc => Fecha modais
      if (e.key === 'Escape') {
        window.cyberModals.close();
      }
    });

    console.log('%c STOCKPRO CYBERPUNK NEON v2.0 READY ', 'background: #8B35FF; color: #fff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
  }

  navigate(tabKey) {
    if (this.currentTab === tabKey) return;
    this.currentTab = tabKey;
    this.renderActiveView();
  }

  renderActiveView() {
    const viewContainer = document.getElementById('view-content-mount');
    if (!viewContainer) return;

    if (this.currentTab === 'dashboard') {
      if (!window.dashboardViewInstance) window.dashboardViewInstance = new DashboardView();
      window.dashboardViewInstance.renderTo(viewContainer);
    } else if (this.currentTab === 'produtos') {
      if (!window.productsViewInstance) window.productsViewInstance = new ProductsView();
      window.productsViewInstance.renderTo(viewContainer);
    } else if (this.currentTab === 'lotes') {
      if (!window.lotsViewInstance) window.lotsViewInstance = new LotsView();
      window.lotsViewInstance.renderTo(viewContainer);
    } else if (this.currentTab === 'movimentacoes') {
      if (!window.movementsViewInstance) window.movementsViewInstance = new MovementsView();
      window.movementsViewInstance.renderTo(viewContainer);
    } else if (this.currentTab === 'vendas') {
      if (!window.salesViewInstance) window.salesViewInstance = new SalesView();
      window.salesViewInstance.renderTo(viewContainer);
    } else if (this.currentTab === 'relatorios') {
      if (!window.reportsViewInstance) window.reportsViewInstance = new ReportsView();
      window.reportsViewInstance.renderTo(viewContainer);
    } else if (this.currentTab === 'alertas') {
      if (!window.alertsViewInstance) window.alertsViewInstance = new AlertsView();
      window.alertsViewInstance.renderTo(viewContainer);
    } else if (this.currentTab === 'configuracoes') {
      if (!window.settingsViewInstance) window.settingsViewInstance = new SettingsView();
      window.settingsViewInstance.renderTo(viewContainer);
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Bootstrap application on page load
window.addEventListener('DOMContentLoaded', () => {
  window.stockProApp = new StockProApp();
  window.stockProApp.init();
});
