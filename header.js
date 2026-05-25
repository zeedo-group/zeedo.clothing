<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ZEEDO clothing — Complete Order</title>
  <link rel="stylesheet" href="styles.css"/>
  <style>
    /* ── CHECKOUT PAGE LAYOUT ── */
    .checkout-hero {
      padding: 48px 0 32px;
      border-bottom: 1px solid var(--grey-light);
    }

    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 64px;
      padding: 56px 0;
      align-items: start;
    }

    @media (max-width: 992px) {
      .checkout-grid {
        grid-template-columns: 1fr;
        gap: 48px;
      }
    }

    /* ── SHIPPING FORM STYLING ── */
    .checkout-form-section {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .form-group-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    /* ── SIDE PANEL ORDER SUMMARY ── */
    .checkout-summary-panel {
      border: 1px solid var(--grey-light);
      padding: 32px 24px;
      background: #ffffff;
    }

    .checkout-summary-panel__title {
      font-size: 0.75rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--grey-light);
    }

    .checkout-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
    }

    /* Order Summary Single Item Layout */
    .checkout-item {
      display: flex;
      gap: 16px;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px dashed var(--grey-light);
    }

    .checkout-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .checkout-item__img-wrap {
      width: 56px;
      height: 70px;
      background: var(--grey-light);
      overflow: hidden;
      flex-shrink: 0;
    }

    .checkout-item__img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .checkout-item__details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .checkout-item__title {
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--black);
      line-height: 1.3;
    }

    .checkout-item__meta {
      font-size: 0.58rem;
      color: var(--grey-mid);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .checkout-item__price {
      font-size: 0.65rem;
      font-weight: 700;
      margin-top: 2px;
    }

    .checkout-item__cancel-link {
      background: none;
      border: none;
      font-size: 0.58rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--grey-mid);
      cursor: pointer;
      padding: 4px 0;
      transition: color 0.2s ease;
    }

    .checkout-item__cancel-link:hover {
      color: #ff3333;
    }

    /* Summary Math Blocks */
    .summary-math-block {
      border-top: 1px solid var(--grey-light);
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .math-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      color: var(--grey-mid);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .math-row--total {
      border-top: 1px solid var(--grey-light);
      margin-top: 8px;
      padding-top: 14px;
      font-size: 0.78rem;
      color: var(--black);
      font-weight: 900;
    }

    .checkout-empty-state {
      text-align: center;
      padding: 48px 0;
    }
  </style>
</head>
<body class="page-body page-body--has-subnav">

  <header></header>
  <script src="header.js" defer></script>

  <!-- Hero Header Area -->
  <section class="checkout-hero">
    <div class="container">
      <p class="t-subheading">Secure Checkout</p>
      <h1 class="t-heading" style="margin-top: 6px;">Shipping & Review</h1>
    </div>
  </section>

  <main class="container">
    <div class="checkout-grid" id="checkoutGridArea">
      
      <!-- LEFT COLUMN: SHIPPING FORM -->
      <form class="checkout-form-section" id="orderSubmitForm" onsubmit="executeOrderPlacement(event)">
        <div>
          <h2 class="t-subheading" style="margin-bottom: 20px; font-size: 0.75rem; color: var(--black)">01. Delivery Details</h2>
          
          <div class="form-group" style="margin-bottom: 20px;">
            <label for="customerName">Full Name</label>
            <input type="text" id="customerName" class="form-control" placeholder="e.g. Asif Rahman" required />
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label for="customerPhone">Phone Number</label>
            <input type="tel" id="customerPhone" class="form-control" placeholder="e.g. 017XXXXXXXX" required />
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label for="customerAddress">Delivery Address</label>
            <input type="text" id="customerAddress" class="form-control" placeholder="House number, road number, area detail..." required />
          </div>

          <div class="form-group-row">
            <div class="form-group">
              <label for="customerCity">City</label>
              <input type="text" id="customerCity" class="form-control" placeholder="e.g. Dhaka" required />
            </div>
            <div class="form-group">
              <label for="customerZip">Postal Code</label>
              <input type="text" id="customerZip" class="form-control" placeholder="1212" />
            </div>
          </div>
        </div>

        <div>
          <h2 class="t-subheading" style="margin-bottom: 14px; font-size: 0.75rem; color: var(--black)">02. Payment Method</h2>
          <p class="t-body" style="color: var(--grey-mid)">Cash on Delivery (COD) — Pay cleanly with cash inside Bangladesh upon receipt.</p>
        </div>

        <button type="submit" class="btn btn-primary" style="margin-top: 16px; align-self: start; padding: 16px 40px;">Confirm Complete Order</button>
      </form>

      <!-- RIGHT COLUMN: SIDEBAR DISPLAY PANEL WITH CANCEL TRIGGER LINKS -->
      <div class="checkout-summary-panel">
        <h3 class="checkout-summary-panel__title">Order Summary</h3>
        
        <div class="checkout-list" id="checkoutPageItemsWrapper">
          <!-- Items dynamically rendered here -->
        </div>

        <div class="summary-math-block">
          <div class="math-row">
            <span>Subtotal</span>
            <span id="checkoutSubtotal">0 BDT</span>
          </div>
          <div class="math-row">
            <span>Delivery Charge</span>
            <span id="checkoutDelivery">100 BDT</span>
          </div>
          <div class="math-row math-row--total">
            <span>Grand Total</span>
            <span id="checkoutGrandTotal">0 BDT</span>
          </div>
        </div>
      </div>

    </div>
  </main>

  <script>
    const currencyFormatter = window.ZEEDO?.formatPrice ?? (v => parseInt(v).toLocaleString('en-BD') + ' BDT');
    const FIXED_DELIVERY_FEE = 100;

    function renderCheckoutSummary() {
      const wrapper = document.getElementById('checkoutPageItemsWrapper');
      const gridArea = document.getElementById('checkoutGridArea');
      if (!wrapper) return;

      const cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];

      // If cart is cleared out completely, switch view to clean empty state wrapper
      if (cart.length === 0) {
        gridArea.innerHTML = `
          <div class="checkout-empty-state" style="grid-column: 1 / -1;">
            <p class="t-subheading" style="color: var(--grey-mid); margin-bottom: 24px;">Your order checkout file is empty</p>
            <a href="shop.html" class="btn btn-primary" style="display:inline-block; text-decoration:none;">Return to Shop</a>
          </div>
        `;
        return;
      }

      wrapper.innerHTML = '';
      let runningSubtotal = 0;

      cart.forEach(item => {
        runningSubtotal += (parseInt(item.price) * item.quantity);
        
        const itemRow = document.createElement('div');
        itemRow.className = 'checkout-item';

        let imageMarkup = `<div style="width:100%;height:100%;background:#f5f5f5;"></div>`;
        if (item.image && item.image.trim() !== '') {
          imageMarkup = `<img src="${item.image.split(',')[0].trim()}" alt="${item.title}">`;
        }

        itemRow.innerHTML = `
          <div class="checkout-item__img-wrap">${imageMarkup}</div>
          <div class="checkout-item__details">
            <h4 class="checkout-item__title">${item.title}</h4>
            <p class="checkout-item__meta">Variant: ${item.color}</p>
            <p class="checkout-item__price">${item.quantity} × ${currencyFormatter(item.price)}</p>
            <div>
              <button type="button" class="checkout-item__cancel-link" onclick="cancelCheckoutItem('${item.id}', '${item.color}')">Cancel</button>
            </div>
          </div>
        `;
        wrapper.appendChild(itemRow);
      });

      // Update calculations display text content
      document.getElementById('checkoutSubtotal').textContent = currencyFormatter(runningSubtotal);
      document.getElementById('checkoutDelivery').textContent = currencyFormatter(FIXED_DELIVERY_FEE);
      document.getElementById('checkoutGrandTotal').textContent = currencyFormatter(runningSubtotal + FIXED_DELIVERY_FEE);
    }

    // ── LIVE SIDE-PANEL CANCELLATION EXECUTION ROUTINE ──
    window.cancelCheckoutItem = function(id, color) {
      let cart = JSON.parse(localStorage.getItem('ZEEDO_CART')) || [];
      
      // Filter out specified item out of standard arrays
      cart = cart.filter(item => !(item.id === id && item.color === color));
      localStorage.setItem('ZEEDO_CART', JSON.stringify(cart));
      
      // Broadcast live execution notification commands upwards to sync everything
      renderCheckoutSummary();
      window.dispatchEvent(new Event('cartUpdated'));
    };

    function executeOrderPlacement(event) {
      event.preventDefault();
      alert("Order placed successfully! Thank you for shopping with ZEEDO.");
      localStorage.removeItem('ZEEDO_CART'); // Clear basket data arrays
      window.location.href = 'shop.html';     // Direct safe landing home
    }

    // Execute standard configuration sequence load checks
    document.addEventListener("DOMContentLoaded", renderCheckoutSummary);
  </script>

</body>
</html>
