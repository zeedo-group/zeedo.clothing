/**
 * ZEEDO CLOTHING — Shared Header Injector v2
 *
 * Injects:
 *   1. Universal top header (logo left, nav center, search+cart right)
 *   2. Sub-navbar ONLY on shop.html and category pages
 *
 * To update nav links or sub-nav items, edit ONLY this file.
 * Usage: <script src="header.js" defer></script>
 * Requires an empty <header></header> tag on every page.
 */

(function () {
  'use strict';

  // ── CONFIG ─────────────────────────────────────────────────

  const NAV_LINKS = [
    { label: 'Home', href: 'home.html' },
    { label: 'Shop', href: 'shop.html' },
  ];

  // Sub-navbar tabs — only shown on shop + category pages
  const SUB_NAV_LINKS = [
    { label: 'Clothing',     href: '#clothing'     },
    { label: 'Accessories',  href: '#accessories'  },
    { label: 'Footwear',     href: '#footwear'     },
    { label: 'Lifestyle',    href: '#lifestyle'    },
  ];

  // Pages that should display the sub-navbar
  const SUB_NAV_PAGES = [
    'shop.html',
    'tshirts.html',
    'shirts.html',
    'trousers.html',
    'shoes.html',
    'watches.html',
    'perfumes.html',
    'more-accessories.html',
  ];

  // ───────────────────────────────────────────────────────────

  /**
   * Format integer price → "1,250 BDT"
   * Exposed globally as window.ZEEDO.formatPrice()
   */
  function formatPrice(raw) {
    const num = parseInt(raw, 10);
    if (isNaN(num)) return raw;
    return num.toLocaleString('en-BD') + ' BDT';
  }
  window.ZEEDO = window.ZEEDO || {};
  window.ZEEDO.formatPrice = formatPrice;

  /**
   * Get the current page filename (e.g. "shop.html")
   */
  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1);
    return file || 'home.html';
  }

  /**
   * Build the top header bar HTML string.
   */
  function buildTopHeader(activePage) {
    const navHTML = NAV_LINKS.map(link => {
      const active = activePage === link.href ? 'active' : '';
      return `<a href="${link.href}" class="${active}">${link.label}</a>`;
    }).join('');

    return `
      <div class="header-inner">

        <!-- LOGO — far left -->
        <a href="home.html" class="header-logo">
          ZEEDO <span>clothing</span>
        </a>

        <!-- MAIN NAV — center -->
        <nav class="header-nav" aria-label="Main navigation">
          ${navHTML}
        </nav>

        <!-- ICONS — far right -->
        <div class="header-icons">
          <!-- Search: decorative placeholder, no JS needed -->
          <a href="#" class="header-icon-btn" aria-label="Search" tabindex="0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </a>

          <!-- Cart: static for now, badge ready for dynamic count -->
          <a href="#" class="header-icon-btn header-cart" aria-label="Cart" tabindex="0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span class="cart-count" id="cart-count">0</span>
          </a>
        </div>

      </div>
    `;
  }

  /**
   * Build the sub-navbar HTML string.
   */
  function buildSubNav(activePage) {
    const linksHTML = SUB_NAV_LINKS.map(link => {
      return `<a href="${link.href}" class="sub-nav__link">${link.label}</a>`;
    }).join('');

    return `
      <div class="sub-nav" role="navigation" aria-label="Shop categories">
        <div class="sub-nav__inner">
          ${linksHTML}
        </div>
      </div>
    `;
  }

  /**
   * Inject header (and conditionally sub-nav) into the page.
   */
  function buildHeader() {
    const headerEl = document.querySelector('header');
    if (!headerEl) {
      console.warn('[header.js] No <header> element found.');
      return;
    }

    const activePage   = getCurrentPage();
    const showSubNav   = SUB_NAV_PAGES.includes(activePage);

    headerEl.innerHTML = buildTopHeader(activePage);

    // Inject sub-nav as a sibling immediately after <header>
    if (showSubNav) {
      const existing = document.getElementById('zeedo-sub-nav');
      if (existing) existing.remove();

      const subNavEl = document.createElement('div');
      subNavEl.id    = 'zeedo-sub-nav';
      subNavEl.innerHTML = buildSubNav(activePage);
      headerEl.insertAdjacentElement('afterend', subNavEl);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeader);
  } else {
    buildHeader();
  }

})();
