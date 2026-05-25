/**
 * ZEEDO CLOTHING — Shared Header Injector v3 (Cart Drawer Integration)
 *
 * Injects:
 *   1. Universal top header (logo left, nav center, search+cart right)
 *   2. Sub-navbar ONLY on shop.html and category pages
 *   3. Cart drawer with item list, cancel buttons, and Place Order
 *
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

  const SUB_NAV_LINKS = [
    { label: 'Clothing',     href: '#clothing'     },
    { label: 'Accessories',  href: '#accessories'  },
    { label: 'Footwear',     href: '#footwear'     },
    { label: 'Lifestyle',    href: '#lifestyle'    },
  ];

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

  function formatPrice(raw) {
    const num = parseInt(raw, 10);
    if (isNaN(num)) return raw;
    return num.toLocaleString('en-BD') + ' BDT';
  }
  window.ZEEDO = window.ZEEDO || {};
  window.ZEEDO.formatPrice = formatPrice;

  function updateHeaderCartCount() {
    const countBadge = document.getElementById('cart-count');
    if (!countBadge) return;

    try {
      const cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];
      const totalItems = cart.reduce((total, item) => total + parseInt(item.quantity || 1, 10), 0);
      countBadge.textContent = totalItems;
    } catch (err) {
      console.error('[header.js] Failed to update cart indicator display:', err);
      countBadge.textContent = '0';
    }
  }
  window.ZEEDO.updateCartCount = updateHeaderCartCount;

  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1);
    return file || 'home.html';
  }

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
          <a href="#" class="header-icon-btn" aria-label="Search" tabindex="0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </a>

          <!-- Cart: now opens drawer -->
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

      <!-- CART DRAWER -->
      <div id="cart-drawer" class="cart-drawer">
        <div class="cart-drawer__inner">
          <button id="cart-close-btn" class="cart-close-btn" aria-label="Close Cart">✕</button>
          <h2>Your Cart</h2>
          <div id="cart-items"></div>
          <div class="cart-drawer__footer">
            <button id="place-order-btn">Place Order</button>
          </div>
        </div>
      </div>
    `;
  }

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

  function buildHeader() {
    const headerEl = document.querySelector('header');
    if (!headerEl) {
      console.warn('[header.js] No <header> element found.');
      return;
    }

    const activePage   = getCurrentPage();
    const showSubNav   = SUB_NAV_PAGES.includes(activePage);

    headerEl.innerHTML = buildTopHeader(activePage);
    updateHeaderCartCount();

    if (showSubNav) {
      const existing = document.getElementById('zeedo-sub-nav');
      if (existing) existing.remove();

      const subNavEl = document.createElement('div');
      subNavEl.id    = 'zeedo-sub-nav';
      subNavEl.innerHTML = buildSubNav(activePage);
      headerEl.insertAdjacentElement('afterend', subNavEl);
    }

    bindCartDrawerEvents();
  }

  // ── CART DRAWER LOGIC ──────────────────────────────────────

  function bindCartDrawerEvents() {
    const cartBtn = document.querySelector('.header-cart');
    const drawer = document.getElementById('cart-drawer');
    const closeBtn = document.getElementById('cart-close-btn');
    const placeOrderBtn = document.getElementById('place-order-btn');

    if (!cartBtn || !drawer) return;

    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.classList.add('open');
      renderCartItems();
    });

    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });

    placeOrderBtn.addEventListener('click', () => {
      window.location.href = 'order.html';
    });
  }

  function renderCartItems() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];
    if (cart.length === 0) {
      container.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item.name} (${item.quantity})</span>
        <button class="remove-btn" data-index="${index}">✕</button>
      `;
      container.appendChild(div);
    });

    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        removeCartItem(idx);
      });
    });
  }

  function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];
    cart.splice(index, 1);
    localStorage.setItem('ZEEDO_CART', JSON.stringify(cart));
    renderCartItems();
    updateHeaderCartCount();
  }

  // ───────────────────────────────────────────────────────────

  window.addEventListener('cartUpdated', updateHeaderCartCount);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeader);
  } else {
    buildHeader();
  }

})();
