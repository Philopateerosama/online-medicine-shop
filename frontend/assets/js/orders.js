(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  function init(){
    seedDemoOrders();
    renderOrders();
    // Tracking form is handled by main.js if present; guard in case it's not.
    if(typeof document !== 'undefined'){
      const form = $('#trackForm');
      const input = $('#trackInput');
      const out = $('#trackResult');
      if(form && input && out && !form._bound){
        form._bound = true;
        form.addEventListener('submit', (e)=>{
          e.preventDefault();
          const v = input.value.trim();
          if(!/^MC-\d{6}$/.test(v)) { out.textContent = 'Enter a valid order number like MC-123456.'; return; }
          const stages = ['Order confirmed','Packed at warehouse','Out for delivery','Delivered'];
          const idx = Number(v.slice(-1)) % stages.length;
          out.textContent = `Current status: ${stages[idx]}`;
        });
      }
    }
  }

  function seedDemoOrders(){
    const key = 'mc_orders';
    try{
      const existing = JSON.parse(localStorage.getItem(key)||'[]');
      if(existing && existing.length) return;
      const demo = [
        { id:'MC-123451', date:'2025-09-22', total: 435.00, items:[{name:'Paracetamol 500mg', qty:2},{name:'Vitamin C 1000mg', qty:1}], status:'Delivered' },
        { id:'MC-123456', date:'2025-10-01', total: 980.00, items:[{name:'Blood Pressure Monitor', qty:1}], status:'Out for delivery' }
      ];
      localStorage.setItem(key, JSON.stringify(demo));
    }catch(e){ /* ignore */ }
  }

  function getOrders(){
    try{ return JSON.parse(localStorage.getItem('mc_orders')||'[]'); }catch(e){ return []; }
  }

  function renderOrders(){
    const list = $('#ordersList');
    const empty = $('#ordersEmpty');
    if(!list || !empty) return;
    list.innerHTML = '';
    const orders = getOrders();
    if(!orders.length){ empty.hidden = false; return; } else { empty.hidden = true; }

    orders.forEach(o=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
          <strong>Order ${o.id}</strong>
          <span class="chip">${o.status}</span>
        </div>
        <div class="product-meta">Placed on ${formatDate(o.date)} · Total EGP ${o.total.toFixed(2)}</div>
        <ul style="margin:.5rem 0 0;padding-left:1rem;color:var(--text-dim)">
          ${o.items.map(it=>`<li>${escapeHtml(it.name)} × ${it.qty}</li>`).join('')}
        </ul>
        <div style="display:flex;gap:.5rem;margin-top:.7rem">
          <button class="btn btn-ghost" data-track="${o.id}">Track</button>
          <button class="btn btn-secondary" data-reorder="${o.id}">Reorder</button>
        </div>
      `;
      list.appendChild(card);
    });

    // Bind actions
    $$('[data-track]').forEach(btn=> btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-track');
      const input = $('#trackInput');
      if(input){ input.value = id; input.focus(); const form = $('#trackForm'); if(form){ form.dispatchEvent(new Event('submit', {cancelable:true, bubbles:true})); } }
      window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'});
    }));

    $$('[data-reorder]').forEach(btn=> btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-reorder');
      const order = getOrders().find(o=>o.id===id);
      if(!order) return;
      // Simple demo: add items to cart
      let cart = [];
      try{ cart = JSON.parse(localStorage.getItem('mc_cart')||'[]'); }catch(e){ cart = []; }
      order.items.forEach(it=>{
        // We don't have product IDs here; this is a demo. Just push a placeholder.
        const pid = `re-${it.name}`;
        const existing = cart.find(c=>c.id===pid);
        if(existing) existing.qty += it.qty; else cart.push({id: pid, qty: it.qty});
      });
      localStorage.setItem('mc_cart', JSON.stringify(cart));
      alert('Items added to cart (demo). Open the cart to review.');
      const cartBtn = document.getElementById('cartBtn');
      if(cartBtn){ cartBtn.click(); }
    }));
  }

  function formatDate(d){
    try{ return new Date(d).toLocaleDateString(); }catch(e){ return d; }
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

  document.addEventListener('DOMContentLoaded', init);
})();
