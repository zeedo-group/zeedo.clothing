/**
 * ZEEDO CLOTHING — Shared Header Injector v6 (Cart Drawer + Mobile Hamburger Menu)
 *
 * Injects:
 *   1. Universal top header (Logo left, nav center, search+cart+hamburger right)
 *   2. Mobile category drawer (Displays all 7 category pages on click)
 *   3. Sub-navbar ONLY on shop.html and category pages
 *   4. Cart drawer with thumbnail layouts, item variants, subtotal, and checkout loops
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

  // Sub-navbar tabs — shown on desktop shop + category pages[cite: 2]
  const SUB_NAV_LINKS = [
    { label: 'Clothing',     href: '#clothing'     },
    { label: 'Accessories',  href: '#accessories'  },
    { label: 'Footwear',     href: '#footwear'     },
    { label: 'Lifestyle',    href: '#lifestyle'    },
  ];

  // Global brand category mappings for the 3-line mobile navigation menu[cite: 1, 2]
  const CATEGORY_MAP = [
    { label: 'T-Shirts',    href: 'tshirts.html' },
    { label: 'Shirts',      href: 'shirts.html' },
    { label: 'Trousers',    href: 'trousers.html' },
    { label: 'Shoes',       href: 'shoes.html' },
    { label: 'Watches',     href: 'watches.html' },
    { label: 'Perfumes',    href: 'perfumes.html' },
    { label: 'Accessories', href: 'more-accessories.html' }
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

  // ── PRICE FORMATTER ────────────────────────────────────────

  function formatPrice(raw) {
    const num = parseInt(raw, 10);
    if (isNaN(num)) return raw;
    return num.toLocaleString('en-BD') + ' BDT';
  }
  window.ZEEDO = window.ZEEDO || {};
  window.ZEEDO.formatPrice = formatPrice;

  // ── CART COUNT BADGE SYNC ──────────────────────────────────

  function updateHeaderCartCount() {
    const countBadges = document.querySelectorAll('.cart-count');
    if (countBadges.length === 0) return;
    try {
      const cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];
      const totalItems = cart.reduce((total, item) => total + parseInt(item.quantity || 1, 10), 0);
      countBadges.forEach(badge => {
        badge.textContent = totalItems;
      });
    } catch (err) {
      console.error('[header.js] Failed to update cart indicator display:', err);
      countBadges.forEach(badge => {
        badge.textContent = '0';
      });
    }
  }
  window.ZEEDO.updateCartCount = updateHeaderCartCount;

  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1);
    return file || 'home.html';
  }

  // ── HEADER DOM INJECTION ───────────────────────────────────

  function buildTopHeader(activePage) {
    const navHTML = NAV_LINKS.map(link => {
      const active = activePage === link.href ? 'active' : '';
      return `<a href="${link.href}" class="${active}">${link.label}</a>`;
    }).join('');

    return `
      <div class="header-inner">
        <!-- BRAND LOGO — Left -->
        <a href="home.html" class="header-logo">
          ZEEDO <span>clothing</span>
        </a>

        <!-- DESKTOP NAV — Center -->
        <nav class="header-nav" aria-label="Main navigation">
          ${navHTML}
        </nav>

        <!-- UTILITY ACTIONS — Right -->
        <div class="header-icons">
          <!-- Search Trigger Link -->
          <a href="#" class="header-icon-btn" aria-label="Search" tabindex="0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </a>

          <!-- Cart Drawer Trigger Link -->
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

          <!-- 3-LINE HAMBURGER MENU BUTTON — Mobile Viewports Only -->
          <button class="header-icon-btn mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle Navigation Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  function buildSubNav() {
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

  // Inject Drawers (Cart Drawer + Mobile 3-Line Menu Drawer)
  function injectDrawers() {
    // 1. Appends Dim Overlay Backdrop
    if (!document.getElementById('zeedo-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'zeedo-overlay';
      overlay.className = 'zeedo-overlay';
      document.body.appendChild(overlay);
    }

    // 2. Appends Complete Shopping Cart Sidebar Drawer Panel
    if (!document.getElementById('cart-drawer')) {
      const drawer = document.createElement('div');
      drawer.id = 'cart-drawer';
      drawer.className = 'cart-drawer';
      drawer.innerHTML = `
        <div class="cart-drawer__inner">
          <div class="cart-drawer__header">
            <h2 class="cart-drawer__title">YOUR BAG (<span class="cart-count">0</span>)</h2>
            <button id="cart-close-btn" class="cart-close-btn" aria-label="Close Cart">✕</button>
          </div>
          
          <div id="cart-items" class="cart-drawer__items"></div>
          
          <div class="cart-drawer__footer">
            <div class="cart-drawer__subtotal-row">
              <span class="subtotal-label">Subtotal</span>
              <span id="cart-subtotal-value" class="subtotal-value">0 BDT</span>
            </div>
            <p class="cart-drawer__shipping-note">Shipping calculated at checkout.</p>
            <button id="place-order-btn" class="place-order-btn">Place Order</button>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
    }

    // 3. Appends Mobile 3-Line Hamburger Menu Drawer Panel (7 Core Categories)
    if (!document.getElementById('mobile-menu-drawer')) {
      const mobileNavHTML = CATEGORY_MAP.map(cat => {
        return `<a href="${cat.href}" class="mobile-menu__link">${cat.label}</a>`;
      }).join('');

      const mobileDrawer = document.createElement('div');
      mobileDrawer.id = 'mobile-menu-drawer';
      mobileDrawer.className = 'mobile-menu-drawer';
      mobileDrawer.innerHTML = `
        <div class="mobile-menu__inner">
          <div class="mobile-menu__header">
            <span class="mobile-menu__brand">ZEEDO</span>
            <button id="mobile-menu-close" class="mobile-menu-close" aria-label="Close Menu">✕</button>
          </div>
          <nav class="mobile-menu__nav" aria-label="Mobile categories navigation">
            ${mobileNavHTML}
          </nav>
        </div>
      `;
      document.body.appendChild(mobileDrawer);
    }
  }

  function buildHeader() {
    const headerEl = document.querySelector('header');
    if (!headerEl) {
      console.warn('[header.js] No <header> element found.');
      return;
    }
    const activePage = getCurrentPage();
    const showSubNav = SUB_NAV_PAGES.includes(activePage);
    
    headerEl.innerHTML = buildTopHeader(activePage);
    updateHeaderCartCount();
    
    if (showSubNav) {
      const existing = document.getElementById('zeedo-sub-nav');
      if (existing) existing.remove();
      const subNavEl = document.createElement('div');
      subNavEl.id = 'zeedo-sub-nav';
      subNavEl.innerHTML = buildSubNav();
      headerEl.insertAdjacentElement('afterend', subNavEl);
    }
    
    injectDrawers();
    bindInterfaceEvents();
  }

  // ── DRAWER AND USER TIMING INTERFACES ──────────────────────

  function bindInterfaceEvents() {
    const cartBtn = document.querySelector('.header-cart');
    const menuToggleBtn = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('zeedo-overlay');
    
    const cartDrawer = document.getElementById('cart-drawer');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const placeOrderBtn = document.getElementById('place-order-btn');
    
    const menuDrawer = document.getElementById('mobile-menu-drawer');
    const menuCloseBtn = document.getElementById('mobile-menu-close');

    if (!overlay || !cartDrawer || !menuDrawer) return;

    // Open Cart Drawer Panel
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        menuDrawer.classList.remove('open'); // Mutual exclusion toggle
        cartDrawer.classList.add('open');
        overlay.classList.add('active');
        renderCartItems();
      });
    }

    // Close Cart Drawer Panel
    if (cartCloseBtn) {
      cartCloseBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // Open Mobile 3-Line Category Menu Drawer Panel
    if (menuToggleBtn) {
      menuToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartDrawer.classList.remove('open'); // Mutual exclusion toggle
        menuDrawer.classList.add('open');
        overlay.classList.add('active');
      });
    }

    // Close Mobile Menu Drawer Panel
    if (menuCloseBtn) {
      menuCloseBtn.addEventListener('click', () => {
        menuDrawer.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // Overlay Clicking Closes All Open Sidebar Windows
    overlay.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
      menuDrawer.classList.remove('open');
      overlay.classList.remove('active');
    });

    // Checkout Push Loop
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];
        if (cart.length === 0) {
          alert('Your shopping bag is empty.');
          return;
        }
        window.location.href = 'order.html';
      });
    }
  }

  // ── CART CONTENT RENDERING ENGINE ──────────────────────────

  function renderCartItems() {
    const container = document.getElementById('cart-items');
    const subtotalDisplay = document.getElementById('cart-subtotal-value');
    const placeOrderBtn = document.getElementById('place-order-btn');
    
    if (!container) return;
    container.innerHTML = '';
    
    const cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];
    
    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-drawer__empty-state">
          <p>Your bag is empty.</p>
          <a href="shop.html" class="cart-drawer__shop-link" onclick="document.getElementById('zeedo-overlay').click();">Continue Shopping</a>
        </div>
      `;
      if (subtotalDisplay) subtotalDisplay.textContent = '0 BDT';
      if (placeOrderBtn) placeOrderBtn.style.display = 'none';
      return;
    }

    if (placeOrderBtn) placeOrderBtn.style.display = 'block';
    let currentCalculatedSubtotal = 0;

    cart.forEach((item, index) => {
      // Parse data and secure pricing calculations
      const itemPrice = parseInt(item.price || 0, 10);
      const itemQty = parseInt(item.quantity || 1, 10);
      const finalLineCost = itemPrice * itemQty;
      currentCalculatedSubtotal += finalLineCost;

      // Extract details or build clean presentation default text fallbacks
      const name = item.name || 'Premium Product';
      const category = item.category || 'Apparel';
      const color = item.color || 'Standard';
      const imageSrc = item.image || item.thumb || '';

      const row = document.createElement('div');
      row.className = 'cart-drawer-item';
      row.innerHTML = `
        <!-- Thumbnail Layout Frame Block -->
        <div class="cart-drawer-item__thumb">
          ${imageSrc ? `<img src="${imageSrc}" alt="${name}" />` : `<div class="cart-drawer-item__thumb-placeholder"></div>`}
        </div>

        <!-- Structural Metadata Core Information Block -->
        <div class="cart-drawer-item__details">
          <div class="cart-drawer-item__row-main">
            <h3 class="cart-drawer-item__name">${name}</h3>
            <button class="cart-drawer-item__cancel-btn" data-index="${index}" aria-label="Remove item">✕</button>
          </div>
          <p class="cart-drawer-item__meta">Category: <span>${category}</span></p>
          <p class="cart-drawer-item__meta">Color: <span>${color}</span></p>
          <div class="cart-drawer-item__row-price">
            <span class="cart-drawer-item__qty">Qty: <b>${itemQty}</b></span>
            <span class="cart-drawer-item__price">${window.ZEEDO.formatPrice(finalLineCost)}</span>
          </div>
        </div>
      `;
      container.appendChild(row);
    });

    // Write localized currency metrics into global components
    if (subtotalDisplay) {
      subtotalDisplay.textContent = window.ZEEDO.formatPrice(currentCalculatedSubtotal);
    }

    // Bind item drop events locally inside loop rows
    container.querySelectorAll('.cart-drawer-item__cancel-btn').forEach(btn => {
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
    
    // Dispatch global custom sync trigger event across window modules
    window.dispatchEvent(new Event('cartUpdated'));
  }

  // Global listeners mapping data across cross-page workflows
  window.addEventListener('cartUpdated', () => {
    updateHeaderCartCount();
    // Synchronize current matching lists if the cart module drawer panel is currently open
    const drawer = document.getElementById('cart-drawer');
    if (drawer && drawer.classList.contains('open')) {
      renderCartItems();
    }
  });

  // Native initialization engine calls
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeader);
  } else {
    buildHeader();
  }

})();
