/**
 * ZEEDO clothing — Global Header & Slide-Out Cart Engine
 * Handled entirely via vanilla JS for zero configuration plug-and-play operation.
 */
(function () {
  'use strict';

  // 1. INJECT MANDATORY CORE HEADER & DRAWER CSS
  const styles = `
    /* Header layout overrides */
    header {
      position: sticky;
      top: 0;
      z-index: 900;
      background: #ffffff;
      border-bottom: 1px solid var(--grey-light, #e5e5e5);
    }
    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }
    .header-logo {
      font-size: 0.85rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      color: #0a0a0a;
    }
    .header-nav {
      display: flex;
      gap: 24px;
    }
    .header-nav a {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-decoration: none;
      color: var(--grey-mid, #7c7c7c);
      transition: color 0.25s ease;
    }
    .header-nav a:hover, .header-nav a.active {
      color: #0a0a0a;
    }
    .header-cart-toggle {
      background: none;
      border: none;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 0;
    }
    
    /* Sliding Cart Drawer Layout */
    .cart-drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 10, 0.4);
      z-index: 2000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cart-drawer-overlay.is-active {
      opacity: 1;
      pointer-events: all;
    }
    .cart-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width: 400px;
      background: #ffffff;
      z-index: 2001;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cart-drawer-overlay.is-active .cart-drawer {
      transform: translateX(0);
    }
    .cart-drawer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px;
      border-bottom: 1px solid var(--grey-light, #e5e5e5);
    }
    .cart-drawer__title {
      font-size: 0.75rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .cart-drawer__close {
      background: none;
      border: none;
      font-size: 0.9rem;
      cursor: pointer;
      padding: 4px;
    }
    
    /* Cart Items Container */
    .cart-drawer__items {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .cart-drawer__empty {
      margin: auto;
      text-align: center;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--grey-mid, #7c7c7c);
    }
    
    /* Single Cart Item Display Card */
    .cart-item {
      display: flex;
      gap: 16px;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--grey-light, #e5e5e5);
    }
    .cart-item__img-wrap {
      width: 64px;
      height: 80px;
      background: var(--grey-light, #e5e5e5);
      flex-shrink: 0;
      overflow: hidden;
    }
    .cart-item__img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cart-item__details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .cart-item__title {
      font-size: 0.7rem;
      font-weight: 700;
      color: #0a0a0a;
      line-height: 1.3;
    }
    .cart-item__meta {
      font-size: 0.58rem;
      color: var(--grey-mid, #7c7c7c);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .cart-item__price-qty {
      font-size: 0.65rem;
      font-weight: 700;
      margin-top: 2px;
    }
    .cart-item__remove-btn {
      background: none;
      border: none;
      font-size: 0.75rem;
      color: var(--grey-mid, #7c7c7c);
      cursor: pointer;
      padding: 8px;
      transition: color 0.2s ease;
    }
    .cart-item__remove-btn:hover {
      color: #ff3333;
    }
    
    /* Footer Summary Panel */
    .cart-drawer__footer {
      padding: 24px;
      border-top: 1px solid var(--grey-light, #e5e5e5);
      background: #fafafa;
    }
    .cart-drawer__summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .cart-drawer__summary-label {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .cart-drawer__summary-value {
      font-size: 0.8rem;
      font-weight: 900;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // 2. INITIALIZE GLOBAL NAMESPACE OBJECT
  window.ZEEDO = window.ZEEDO || {};
  
  // Clean monetary printing formatter matching shop parameters
  window.ZEEDO.formatPrice = window.ZEEDO.formatPrice || function (val) {
    return parseInt(val).toLocaleString('en-BD') + ' BDT';
  };

  // 3. GENERATE DOM COMPONENT LAYOUTS
  document.addEventListener("DOMContentLoaded", function () {
    
    // Inject semantic content layout inside parent <header> wrapper tags found on host documents
    const headerElement = document.querySelector('header');
    if (headerElement) {
      headerElement.innerHTML = `
        <div class="container">
          <div class="header-inner">
            <a href="shop.html" class="header-logo">ZEEDO <span style="font-weight:300">clothing</span></a>
            <nav class="header-nav">
              <a href="shop.html">Shop All</a>
              <a href="tshirts.html">T-Shirts</a>
            </nav>
            <button class="header-cart-toggle" id="globalCartTrigger" aria-label="Open Shopping Cart">
              Bag (<span id="globalCartCount">0</span>)
            </button>
          </div>
        </div>
      `;
    }

    // Append Slide-out Cart Drawer to base body layer to circumvent local element clipping properties
    const drawerContainer = document.createElement('div');
    drawerContainer.id = 'globalCartDrawerOverlay';
    drawerContainer.className = 'cart-drawer-overlay';
    drawerContainer.innerHTML = `
      <div class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Cart Drawer">
        <div class="cart-drawer__header">
          <h3 class="cart-drawer__title">Your Selection</h3>
          <button class="cart-drawer__close" id="globalCartClose" aria-label="Close Drawer">✕</button>
        </div>
        <div class="cart-drawer__items" id="globalCartItemsWrapper">
          <!-- Live items systematically loaded here -->
        </div>
        <div class="cart-drawer__footer" id="globalCartFooter">
          <div class="cart-drawer__summary-row">
            <span class="cart-drawer__summary-label">Subtotal</span>
            <span class="cart-drawer__summary-value" id="globalCartSubtotal">0 BDT</span>
          </div>
          <a href="order.html" class="btn btn-primary btn-full" style="text-align:center; text-decoration:none; display:block;">Proceed to Checkout</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawerContainer);

    // Set high-contrast link coloring base status context indicators
    const currentFile = window.location.pathname.split("/").pop();
    document.querySelectorAll('.header-nav a').forEach(link => {
      if(link.getAttribute('href') === currentFile) link.classList.add('active');
    });

    // 4. BIND MECHANICAL INTERACTION TRIGGER EVENT LISTENERS
    const overlay = document.getElementById('globalCartDrawerOverlay');
    
    function openDrawer() {
      window.ZEEDO.renderCartItems(); // Keep fresh on layout pop
      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    document.getElementById('globalCartTrigger').addEventListener('click', openDrawer);
    document.getElementById('globalCartClose').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeDrawer();
    });

    // 5. WIRE ENGINE WORKFLOW ROUTINES
    
    // Updates shopping icon indicator badge numbers globally
    window.ZEEDO.updateCartCount = function () {
      const cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];
      const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
      const countBadge = document.getElementById('globalCartCount');
      if (countBadge) countBadge.textContent = totalCount;
    };

    // Renders list items dynamically inside the drawer interface panel
    window.ZEEDO.renderCartItems = function () {
      const wrapper = document.getElementById('globalCartItemsWrapper');
      const footerPanel = document.getElementById('globalCartFooter');
      if (!wrapper) return;

      const cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];

      if (cart.length === 0) {
        wrapper.innerHTML = `<div class="cart-drawer__empty">Your bag is empty</div>`;
        if (footerPanel) footerPanel.style.display = 'none';
        return;
      }

      if (footerPanel) footerPanel.style.display = 'block';
      wrapper.innerHTML = ''; // Wipe existing structures

      let calculatedSubtotal = 0;

      cart.forEach(item => {
        calculatedSubtotal += (parseInt(item.price) * item.quantity);

        const itemCard = document.createElement('div');
        itemCard.className = 'cart-item';

        // Evaluate visual product representation settings
        let imageMarkup = `<div style="width:100%;height:100%;background:#f0f0f0;"></div>`;
        if (item.image && item.image.trim() !== '') {
          imageMarkup = `<img src="${item.image.split(',')[0].trim()}" alt="${item.title}">`;
        }

        itemCard.innerHTML = `
          <div class="cart-item__img-wrap">
            ${imageMarkup}
          </div>
          <div class="cart-item__details">
            <h4 class="cart-item__title">${item.title}</h4>
            <p class="cart-item__meta">Variant: ${item.color}</p>
            <p class="cart-item__price-qty">${item.quantity} × ${window.ZEEDO.formatPrice(item.price)}</p>
          </div>
          <button class="cart-item__remove-btn" 
                  onclick="globalRemoveCartItem('${item.id}', '${item.color}')" 
                  aria-label="Remove item">✕</button>
        </div>
        `;
        wrapper.appendChild(itemCard);
      });

      document.getElementById('globalCartSubtotal').textContent = window.ZEEDO.formatPrice(calculatedSubtotal);
    };

    // Initial system load run state validation checks
    window.ZEEDO.updateCartCount();
  });

  // 6. GLOBAL VISUAL ITEM REMOVAL DISPATCH TRIGGER
  window.globalRemoveCartItem = function (id, color) {
    let cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];
    
    // Sift configuration out of system array variables
    cart = cart.filter(item => !(item.id === id && item.color === color));
    
    localStorage.setItem('ZEEDO_CART', JSON.stringify(cart));
    
    // Broadcast live layout refresh commands seamlessly
    window.ZEEDO.updateCartCount();
    window.ZEEDO.renderCartItems();
    window.dispatchEvent(new Event('cartUpdated'));
  };

})();
