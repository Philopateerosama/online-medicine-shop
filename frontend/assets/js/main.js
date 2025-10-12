(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  // State
  const state = {
    products: [],
    filtered: [],
    categories: [],
    cart: JSON.parse(localStorage.getItem('mc_cart')||'[]'),
    query: '',
    category: 'All',
    sort: 'popularity'
  };

  const sampleProducts = [
    {id:'p1', name:'Paracetamol 500mg', price: 25, category:'OTC', popularity: 98, icon:'💊', desc:'Pain reliever & fever reducer.'},
    {id:'p2', name:'Vitamin C 1000mg', price: 120, category:'Vitamins', popularity: 88, icon:'🍊', desc:'Immune support tablets.'},
    {id:'p3', name:'Blood Pressure Monitor', price: 950, category:'Devices', popularity: 73, icon:'🩺', desc:'Digital arm BP monitor.'},
    {id:'p4', name:'Insulin Pen Needles', price: 85, category:'Diabetes Care', popularity: 66, icon:'🧪', desc:'Pack of 100 sterile needles.'},
    {id:'p5', name:'Ibuprofen 200mg', price: 45, category:'OTC', popularity: 80, icon:'💊', desc:'Anti-inflammatory tablets.'},
    {id:'p6', name:'Sunscreen SPF 50', price: 210, category:'Personal Care', popularity: 75, icon:'🌞', desc:'Broad-spectrum UVA/UVB.'},
    {id:'p7', name:'Omega-3 Capsules', price: 180, category:'Vitamins', popularity: 70, icon:'🐟', desc:'Heart & brain support.'},
    {id:'p8', name:'Digital Thermometer', price: 130, category:'Devices', popularity: 65, icon:'🌡️', desc:'Quick-read thermometer.'}
  ];

  const blogPosts = [
    {id:'b1', title:'Managing Hypertension: Daily Habits', excerpt:'Simple lifestyle changes can help control blood pressure...', tag:'Wellness'},
    {id:'b2', title:'Vitamin D: Are You Getting Enough?', excerpt:'Sunlight, diet, and supplements explained...', tag:'Nutrition'},
    {id:'b3', title:'Safe Medicine Storage at Home', excerpt:'Keep medicines safe and effective with these tips...', tag:'Safety'},
  ];

  function init(){
    // Data
    state.products = sampleProducts;
    state.categories = ['All', ...Array.from(new Set(sampleProducts.map(p=>p.category)))];

    // UI hooks
    bindHeader();
    renderYear();
    renderCategories();
    renderBlog();
    bindSearch();
    bindSort();
    bindPrescription();
    bindConsultation();
    bindTracking();
    bindCart();

    filterAndRender();
  }

  // Header/nav
  function bindHeader(){
    const toggle = $('.nav-toggle');
    const menu = $('#nav-menu');
    if(toggle){
      toggle.addEventListener('click', ()=>{
        const open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
  }

  function renderYear(){
    const y = $('#year');
    if(y) y.textContent = new Date().getFullYear();
  }

  // Categories
  function renderCategories(){
    const wrap = $('#categoryChips');
    if(!wrap) return;
    wrap.innerHTML = '';
    state.categories.forEach(cat=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (state.category===cat ? ' active' : '');
      b.textContent = cat;
      b.setAttribute('role','listitem');
      b.addEventListener('click', ()=>{ state.category = cat; filterAndRender(); });
      wrap.appendChild(b);
    });
  }

  // Search & sort
  function bindSearch(){
    const form = $('#searchForm');
    const input = $('#searchInput');
    if(!form || !input) return;
    form.addEventListener('submit', (e)=>{ e.preventDefault(); state.query = input.value.trim(); filterAndRender(); });
    input.addEventListener('input', ()=>{ state.query = input.value.trim(); filterAndRender(); });
  }
  function bindSort(){
    const sel = $('#sortSelect');
    if(!sel) return;
    sel.addEventListener('change', ()=>{ state.sort = sel.value; filterAndRender(); });
  }
  function applyFilters(){
    const q = state.query.toLowerCase();
    let list = state.products.filter(p=> (!q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) && (state.category==='All' || p.category===state.category));
    switch(state.sort){
      case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
      case 'name': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
      default: list.sort((a,b)=>b.popularity-a.popularity);
    }
    state.filtered = list;
  }
  function renderProducts(){
    const grid = $('#productGrid');
    const empty = $('#emptyState');
    if(!grid || !empty) return;
    grid.innerHTML = '';
    if(state.filtered.length === 0){ empty.hidden = false; return; } else { empty.hidden = true; }

    state.filtered.forEach(p=>{
      const card = document.createElement('article');
      card.className = 'card product-card';
      card.innerHTML = `
        <div class="product-media" aria-hidden="true">${p.icon}</div>
        <div class="product-title">${p.name}</div>
        <div class="product-meta">${p.category} · ${p.desc}</div>
        <div class="price">EGP ${p.price.toFixed(2)}</div>
        <div class="card-actions">
          <button class="btn btn-secondary" data-add="${p.id}">Add to Cart</button>
        </div>`;
      grid.appendChild(card);
    });

    // Bind add-to-cart
    $$('#productGrid [data-add]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-add');
        addToCart(id, 1);
        openCart();
      });
    });
  }

  function filterAndRender(){
    applyFilters();
    renderCategories();
    renderProducts();
  }

  // Prescription upload (demo)
  function bindPrescription(){
    const form = $('#rxForm');
    const file = $('#rxFile');
    const preview = $('#rxPreview');
    if(!form || !file || !preview) return;
    file.addEventListener('change', ()=>{
      if(file.files && file.files[0]){
        preview.textContent = `Selected: ${file.files[0].name}`;
      } else { preview.textContent = ''; }
    });
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(!file.files || !file.files[0]){ preview.textContent = 'Please choose a file.'; return; }
      preview.textContent = 'Uploading... (demo)';
      setTimeout(()=>{ preview.textContent = 'Uploaded. A pharmacist will review shortly (demo).'; }, 900);
    });
  }

  // Consultation (demo)
  function bindConsultation(){
    const btn = $('#startChatBtn');
    const status = $('#consultStatus');
    if(!btn || !status) return;
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      status.textContent = 'Status: Connecting... (demo)';
      setTimeout(()=>{ status.textContent = 'Status: Pharmacist connected (demo)'; }, 1000);
    });
  }

  // Tracking (demo)
  function bindTracking(){
    const form = $('#trackForm');
    const input = $('#trackInput');
    const out = $('#trackResult');
    if(!form || !input || !out) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const v = input.value.trim();
      if(!/^MC-\d{6}$/.test(v)) { out.textContent = 'Enter a valid order number like MC-123456.'; return; }
      const stages = ['Order confirmed','Packed at warehouse','Out for delivery','Delivered'];
      const idx = Number(v.slice(-1)) % stages.length; // pseudo status
      out.textContent = `Current status: ${stages[idx]} (demo)`;
    });
  }

  // Blog
  function renderBlog(){
    const grid = $('#blogGrid');
    if(!grid) return;
    grid.innerHTML = '';
    blogPosts.forEach(b=>{
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem"><strong>${b.title}</strong><span class="chip">${b.tag}</span></div><div style="color:var(--text-dim)">${b.excerpt}</div>`;
      grid.appendChild(el);
    });
  }

  // Cart
  function bindCart(){
    $('#cartBtn').addEventListener('click', openCart);
    $('#closeCartBtn').addEventListener('click', closeCart);
    $('#backdrop').addEventListener('click', closeCart);
    $('#checkoutBtn').addEventListener('click', ()=>{
      alert('Checkout is a demo. Implement payment gateway integration later.');
    });
    renderCart();
  }
  function openCart(){ $('#cartDrawer').classList.add('open'); $('#backdrop').hidden = false; }
  function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#backdrop').hidden = true; }
  function addToCart(id, qty){
    const p = state.products.find(x=>x.id===id);
    if(!p) return;
    const item = state.cart.find(x=>x.id===id);
    if(item) item.qty += qty; else state.cart.push({id, qty});
    persistCart();
    renderCart();
  }
  function updateQty(id, qty){
    const item = state.cart.find(x=>x.id===id);
    if(!item) return;
    item.qty = Math.max(1, qty|0);
    persistCart();
    renderCart();
  }
  function removeFromCart(id){
    state.cart = state.cart.filter(x=>x.id!==id);
    persistCart();
    renderCart();
  }
  function persistCart(){ localStorage.setItem('mc_cart', JSON.stringify(state.cart)); }
  function cartTotal(){
    return state.cart.reduce((sum, it)=>{
      const p = state.products.find(x=>x.id===it.id); return sum + (p?p.price:0)*it.qty;
    }, 0);
  }
  function renderCart(){
    const cont = $('#cartItems');
    const count = $('#cartCount');
    const total = $('#cartTotal');
    cont.innerHTML = '';
    let itemCount = 0;
    state.cart.forEach(it=>{
      const p = state.products.find(x=>x.id===it.id);
      if(!p) return;
      itemCount += it.qty;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-thumb">${p.icon}</div>
        <div>
          <div class="product-title">${p.name}</div>
          <div class="cart-meta">EGP ${p.price.toFixed(2)}</div>
          <div class="qty" style="margin-top:6px">
            <button aria-label="Decrease quantity" data-dec="${p.id}">−</button>
            <input aria-label="Quantity" type="number" min="1" value="${it.qty}" data-qty="${p.id}" />
            <button aria-label="Increase quantity" data-inc="${p.id}">+</button>
          </div>
        </div>
        <div>
          <button class="btn btn-ghost" data-remove="${p.id}">Remove</button>
        </div>`;
      cont.appendChild(row);
    });
    count.textContent = String(itemCount);
    total.textContent = `EGP ${cartTotal().toFixed(2)}`;

    // Bind qty and remove
    $$('[data-dec]').forEach(b=> b.addEventListener('click', ()=>{ const id=b.getAttribute('data-dec'); const item=state.cart.find(i=>i.id===id); if(item){ updateQty(id, item.qty-1); } }));
    $$('[data-inc]').forEach(b=> b.addEventListener('click', ()=>{ const id=b.getAttribute('data-inc'); const item=state.cart.find(i=>i.id===id); if(item){ updateQty(id, item.qty+1); } }));
    $$('[data-qty]').forEach(inp=> inp.addEventListener('change', ()=>{ const id=inp.getAttribute('data-qty'); updateQty(id, parseInt(inp.value,10)||1); }));
    $$('[data-remove]').forEach(btn=> btn.addEventListener('click', ()=> removeFromCart(btn.getAttribute('data-remove'))));
  }

  // Kick off
  document.addEventListener('DOMContentLoaded', init);
})();
