/**
 * ZEEDO CLOTHING — header.js v3
 * ─────────────────────────────────────────────────────────────
 * Responsibilities:
 *   1. Inject universal top header (logo · nav · search · cart)
 *   2. Inject sub-navbar conditionally on shop + category pages
 *   3. Inject slide-out cart drawer + dim overlay into DOM
 *   4. Mobile hamburger menu with all 7 category links
 *   5. Cart localStorage engine (ZEEDO_CART key)
 *   6. Live badge sync via #cart-count
 *   7. Per-item remove (Cancel) with live UI update
 *   8. Global cartUpdated event broadcast + listener
 *
 * Single edit point for ALL nav/cart behaviour across the site.
 * Usage: <script src="header.js" defer></script>
 * Requires: an empty <header></header> on every page.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ============================================================
     1. STATIC CONFIG — edit here to change links site-wide
  ============================================================ */

  const NAV_LINKS = [
    { label: 'Home', href: 'home.html' },
    { label: 'Shop', href: 'shop.html' },
  ];

  // Sub-navbar category links (shop.html + category pages only)
  const SUB_NAV_LINKS = [
    { label: 'T-Shirts',         href: 'tshirts.html'          },
    { label: 'Shirts',           href: 'shirts.html'           },
    { label: 'Trousers',         href: 'trousers.html'         },
    { label: 'Shoes',            href: 'shoes.html'            },
    { label: 'Watches',          href: 'watches.html'          },
    { label: 'Perfumes',         href: 'perfumes.html'         },
    { label: 'More Accessories', href: 'more-accessories.html' },
  ];

  // Pages that render the sub-navbar
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

  // All 7 category pages — used in mobile menu
  const CATEGORY_LINKS = [
    { label: 'T-Shirts',     href: 'tshirts.html'          },
    { label: 'Shirts',       href: 'shirts.html'           },
    { label: 'Trousers',     href: 'trousers.html'         },
    { label: 'Shoes',        href: 'shoes.html'            },
    { label: 'Watches',      href: 'watches.html'          },
    { label: 'Perfumes',     href: 'perfumes.html'         },
    { label: 'Accessories',  href: 'more-accessories.html' },
  ];

  // localStorage key for cart data
  const CART_KEY = 'ZEEDO_CART';

  /* ============================================================
     2. GLOBAL UTILITY — window.ZEEDO.formatPrice
  ============================================================ */

  function formatPrice(raw) {
    const num = parseInt(raw, 10);
    if (isNaN(num)) return String(raw);
    return num.toLocaleString('en-BD') + ' BDT';
  }

  window.ZEEDO              = window.ZEEDO || {};
  window.ZEEDO.formatPrice  = formatPrice;

  /* ============================================================
     3. HELPERS
  ============================================================ */

  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1);
    return file || 'home.html';
  }

  // Read cart array from localStorage (always returns an array)
  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  // Write cart array back to localStorage + broadcast update
  function writeCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('[header.js] Could not write cart to localStorage:', e);
    }
    window.dispatchEvent(new Event('cartUpdated'));
  }

  // Total quantity across all items
  function cartTotalQty(cart) {
    return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  }

  // Total price across all items
  function cartTotalPrice(cart) {
    return cart.reduce((sum, item) => sum + (parseInt(item.price, 10) || 0) * (item.qty || 1), 0);
  }

  /* ============================================================
     4. HTML BUILDERS
  ============================================================ */

  // ── 4a. TOP HEADER ────────────────────────────────────────
  function buildTopHeader(activePage) {
    const navHTML = NAV_LINKS.map(link => {
      const active = activePage === link.href ? 'active' : '';
      return `<a href="${link.href}" class="${active}">${link.label}</a>`;
    }).join('');

    return `
      <div class="header-inner">

        <!-- LOGO — far left -->
        <a href="home.html" class="header-logo" aria-label="ZEEDO clothing home">
          ZEEDO <span>clothing</span>
        </a>

        <!-- MAIN NAV — center (hidden on mobile) -->
        <nav class="header-nav" aria-label="Main navigation">
          ${navHTML}
        </nav>

        <!-- ICONS — far right -->
        <div class="header-icons">

          <!-- Search: decorative placeholder -->
          <a href="#" class="header-icon-btn" aria-label="Search" tabindex="0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </a>

          <!-- Cart icon — opens drawer, never navigates -->
          <button class="header-icon-btn header-cart"
                  id="cartToggleBtn"
                  aria-label="Open cart"
                  aria-expanded="false"
                  type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span class="cart-count" id="cart-count" aria-live="polite">0</span>
          </button>

          <!-- Hamburger — visible on mobile only -->
          <button class="header-icon-btn hamburger-btn"
                  id="hamburgerBtn"
                  aria-label="Open menu"
                  aria-expanded="false"
                  type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="3"  y1="6"  x2="21" y2="6"/>
              <line x1="3"  y1="12" x2="21" y2="12"/>
              <line x1="3"  y1="18" x2="21" y2="18"/>
            </svg>
          </button>

        </div>
      </div>
    `;
  }

  // ── 4b. SUB-NAVBAR ─────────────────────────────────────────
  function buildSubNav(activePage) {
    const linksHTML = SUB_NAV_LINKS.map(link => {
      const active = activePage === link.href ? ' sub-nav__link--active' : '';
      return `<a href="${link.href}" class="sub-nav__link${active}">${link.label}</a>`;
    }).join('');

    return `
      <div class="sub-nav" role="navigation" aria-label="Shop by category">
        <div class="sub-nav__inner">${linksHTML}</div>
      </div>
    `;
  }

  // ── 4c. MOBILE MENU DRAWER ─────────────────────────────────
  function buildMobileMenu() {
    const catLinks = CATEGORY_LINKS.map(link =>
      `<a href="${link.href}" class="mobile-menu__cat-link">${link.label}</a>`
    ).join('');

    const navLinks = NAV_LINKS.map(link =>
      `<a href="${link.href}" class="mobile-menu__nav-link">${link.label}</a>`
    ).join('');

    return `
      <div id="mobileMenuOverlay" class="mobile-menu-overlay" aria-hidden="true"></div>
      <div id="mobileMenuDrawer" class="mobile-menu-drawer" role="dialog" aria-label="Navigation menu" aria-hidden="true">
        <div class="mobile-menu__header">
          <span class="mobile-menu__logo">ZEEDO <span>clothing</span></span>
          <button class="mobile-menu__close" id="mobileMenuClose" aria-label="Close menu" type="button">✕</button>
        </div>
        <nav class="mobile-menu__body">
          <p class="mobile-menu__section-label">Pages</p>
          <div class="mobile-menu__nav-links">${navLinks}</div>
          <div class="mobile-menu__divider"></div>
          <p class="mobile-menu__section-label">Shop by Category</p>
          <div class="mobile-menu__cat-links">${catLinks}</div>
        </nav>
      </div>
    `;
  }

  // ── 4d. CART DRAWER ────────────────────────────────────────
  function buildCartDrawer() {
    return `
      <div id="cartOverlay" class="cart-overlay" aria-hidden="true"></div>
      <div id="cartDrawer" class="cart-drawer" role="dialog" aria-label="Your bag" aria-hidden="true">

        <!-- Drawer header -->
        <div class="cart-drawer__header">
          <span class="cart-drawer__title">Your Bag</span>
          <button class="cart-drawer__close" id="cartDrawerClose" aria-label="Close cart" type="button">✕</button>
        </div>

        <!-- Scrollable item list -->
        <div class="cart-drawer__body" id="drawerItems">
          <!-- Populated by syncCartUI() -->
        </div>

        <!-- Sticky footer -->
        <div class="cart-drawer__footer">
          <div class="cart-drawer__subtotal-row">
            <span class="cart-drawer__subtotal-label">Subtotal</span>
            <span class="cart-drawer__subtotal-value" id="drawerSubtotal">0 BDT</span>
          </div>
          <div class="cart-drawer__subtotal-row" style="font-size:0.65rem;color:var(--grey-mid);margin-top:4px;">
            <span>Delivery</span>
            <span id="drawerDelivery">0 BDT</span>
          </div>
          <div class="cart-drawer__subtotal-row" style="font-weight:800;margin-top:6px;padding-top:8px;border-top:1px solid var(--grey-light);">
            <span>Total</span>
            <span id="drawerTotal">0 BDT</span>
          </div>
          <a href="order.html" class="cart-drawer__checkout-btn" id="drawerCheckoutBtn">
            Place Order
          </a>
        </div>

      </div>
    `;
  }

  /* ============================================================
     5. CART DRAWER — OPEN / CLOSE
  ============================================================ */

  function openCartDrawer() {
    const drawer  = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const toggle  = document.getElementById('cartToggleBtn');
    if (!drawer || !overlay) return;

    syncCartUI();                          // always fresh before showing
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function closeCartDrawer() {
    const drawer  = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const toggle  = document.getElementById('cartToggleBtn');
    if (!drawer || !overlay) return;

    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  /* ============================================================
     6. MOBILE MENU — OPEN / CLOSE
  ============================================================ */

  function openMobileMenu() {
    const drawer  = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    const btn     = document.getElementById('hamburgerBtn');
    if (!drawer || !overlay) return;

    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    const drawer  = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    const btn     = document.getElementById('hamburgerBtn');
    if (!drawer || !overlay) return;

    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  /* ============================================================
     7. CART RENDERING ENGINE — syncCartUI()
  ============================================================ */

  function syncCartUI() {
    const cart          = readCart();
    const itemsEl       = document.getElementById('drawerItems');
    const subtotalEl    = document.getElementById('drawerSubtotal');
    const checkoutBtn   = document.getElementById('drawerCheckoutBtn');
    const badgeEl       = document.getElementById('cart-count');

    // ── Badge update ──────────────────────────────────────────
    const totalQty = cartTotalQty(cart);
    if (badgeEl) badgeEl.textContent = totalQty;

    // If drawer isn't in DOM yet, stop here (badge-only update)
    if (!itemsEl) return;

    // ── EMPTY STATE ──────────────────────────────────────────
    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart-drawer__empty">
          <p class="cart-drawer__empty-text">Your bag is empty.</p>
        </div>
      `;
      if (subtotalEl)  subtotalEl.textContent = '0 BDT';
      if (checkoutBtn) {
        checkoutBtn.classList.add('is-disabled');
        checkoutBtn.setAttribute('aria-disabled', 'true');
        checkoutBtn.style.pointerEvents = 'none';
        checkoutBtn.style.opacity       = '0.38';
      }
      return;
    }

    // ── RE-ENABLE CHECKOUT if items exist ────────────────────
    if (checkoutBtn) {
      checkoutBtn.classList.remove('is-disabled');
      checkoutBtn.removeAttribute('aria-disabled');
      checkoutBtn.style.pointerEvents = '';
      checkoutBtn.style.opacity       = '';
    }

    // ── BUILD ITEM ROWS ───────────────────────────────────────
    itemsEl.innerHTML = '';

    cart.forEach((item, index) => {
      const itemPrice  = (parseInt(item.price, 10) || 0) * (item.qty || 1);
      const hasImage   = item.image && item.image.trim() !== '';

      const row        = document.createElement('div');
      row.className    = 'cart-item';
      row.dataset.index = index;

      row.innerHTML = `
        <div class="cart-item__thumb">
          ${hasImage
            ? `<img src="${item.image}" alt="${item.title}" loading="lazy"/>`
            : `<div class="cart-item__thumb-placeholder"></div>`
          }
        </div>
        <div class="cart-item__body">
          <p class="cart-item__category">${item.category || ''}</p>
          <p class="cart-item__title">${item.title || 'Untitled'}</p>
          <p class="cart-item__meta">
            ${item.selectedColor ? `${item.selectedColor}` : ''}
            ${item.selectedColor && item.qty > 1 ? ' · ' : ''}
            ${item.qty > 1 ? `Qty: ${item.qty}` : ''}
          </p>
          <p class="cart-item__price">${formatPrice(itemPrice)}</p>
        </div>
        <button class="cart-item__remove"
                data-index="${index}"
                aria-label="Remove ${item.title}"
                type="button">
          Cancel
        </button>
      `;

      // Attach remove handler directly on the element
      row.querySelector('.cart-item__remove').addEventListener('click', function () {
        removeCartItem(parseInt(this.dataset.index, 10));
      });

      itemsEl.appendChild(row);
    });

    // ── SUBTOTAL + DELIVERY + TOTAL ──────────────────────────
    const DELIVERY   = 130;
    const deliveryEl = document.getElementById('drawerDelivery');
    const totalEl    = document.getElementById('drawerTotal');
    if (subtotalEl) subtotalEl.textContent = formatPrice(cartTotalPrice(cart));
    if (deliveryEl) deliveryEl.textContent = cart.length > 0 ? formatPrice(DELIVERY) : '0 BDT';
    if (totalEl)    totalEl.textContent    = cart.length > 0 ? formatPrice(cartTotalPrice(cart) + DELIVERY) : '0 BDT';
  }

  /* ============================================================
     8. CART ITEM REMOVAL — The Cancel Rule
  ============================================================ */

  function removeCartItem(index) {
    const cart = readCart();
    if (index < 0 || index >= cart.length) return;

    const item = cart[index];

    if ((item.qty || 1) > 1) {
      // Decrease quantity by 1
      cart[index].qty = (item.qty || 1) - 1;
    } else {
      // Remove entirely
      cart.splice(index, 1);
    }

    writeCart(cart);  // persists + dispatches 'cartUpdated'
    syncCartUI();     // re-render drawer instantly
  }

  /* Expose addToCart globally so category pages can call it */
  window.ZEEDO.addToCart = function (product) {
    const cart  = readCart();
    // Match on id + selectedColor
    const match = cart.findIndex(
      i => i.id === product.id && i.selectedColor === product.selectedColor
    );

    if (match > -1) {
      cart[match].qty = (cart[match].qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    writeCart(cart);
    syncCartUI();
  };

  /* ============================================================
     9. MAIN INJECTION — buildHeader()
  ============================================================ */

  function buildHeader() {
    const headerEl = document.querySelector('header');
    if (!headerEl) {
      console.warn('[header.js] No <header> element found on this page.');
      return;
    }

    const activePage = getCurrentPage();
    const showSubNav = SUB_NAV_PAGES.includes(activePage);

    // ── Inject top header markup ──────────────────────────────
    headerEl.innerHTML = buildTopHeader(activePage);

    // ── Inject sub-navbar (shop + category pages only) ────────
    if (showSubNav) {
      const existing = document.getElementById('zeedo-sub-nav');
      if (existing) existing.remove();
      const subNavEl    = document.createElement('div');
      subNavEl.id       = 'zeedo-sub-nav';
      subNavEl.innerHTML = buildSubNav(activePage);
      headerEl.insertAdjacentElement('afterend', subNavEl);
    }

    // ── Inject mobile menu + cart drawer into body ────────────
    // Use a single wrapper so we only inject once
    const existing = document.getElementById('zeedo-overlays');
    if (existing) existing.remove();

    const overlayWrap     = document.createElement('div');
    overlayWrap.id        = 'zeedo-overlays';
    overlayWrap.innerHTML = buildMobileMenu() + buildCartDrawer();
    document.body.appendChild(overlayWrap);

    // ── Wire up events ────────────────────────────────────────
    wireEvents();

    // ── Initial badge + drawer render from stored state ───────
    syncCartUI();
  }

  /* ============================================================
     10. EVENT WIRING
  ============================================================ */

  function wireEvents() {

    // ── Cart toggle (opens drawer, never navigates) ───────────
    const cartBtn = document.getElementById('cartToggleBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openCartDrawer();
      });
    }

    // ── Cart close: drawer close button ───────────────────────
    const cartClose = document.getElementById('cartDrawerClose');
    if (cartClose) cartClose.addEventListener('click', closeCartDrawer);

    // ── Cart close: dim overlay click ─────────────────────────
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    // ── Hamburger: open mobile menu ───────────────────────────
    const hamburger = document.getElementById('hamburgerBtn');
    if (hamburger) hamburger.addEventListener('click', openMobileMenu);

    // ── Mobile menu: close button ─────────────────────────────
    const menuClose = document.getElementById('mobileMenuClose');
    if (menuClose) menuClose.addEventListener('click', closeMobileMenu);

    // ── Mobile menu: dim overlay click ────────────────────────
    const menuOverlay = document.getElementById('mobileMenuOverlay');
    if (menuOverlay) menuOverlay.addEventListener('click', closeMobileMenu);

    // ── ESC key closes whichever panel is open ────────────────
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      const cartDrawer = document.getElementById('cartDrawer');
      const mobileMenu = document.getElementById('mobileMenuDrawer');
      if (cartDrawer && cartDrawer.classList.contains('is-open')) closeCartDrawer();
      if (mobileMenu && mobileMenu.classList.contains('is-open')) closeMobileMenu();
    });

    // ── Global cartUpdated event listener ─────────────────────
    // Any page (including order.html) that dispatches 'cartUpdated'
    // will trigger a badge + drawer re-render here automatically.
    window.addEventListener('cartUpdated', function () {
      syncCartUI();
    });
  }

  /* ============================================================
     11. BOOT
  ============================================================ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeader);
  } else {
    buildHeader();
  }

})();
