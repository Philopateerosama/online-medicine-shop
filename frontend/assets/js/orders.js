(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
  const API_BASE = 'http://localhost:4000/api';
  const getToken = () => localStorage.getItem('token');
  const authHeaders = () => { const t=getToken(); return t? { Authorization: `Bearer ${t}` } : {}; };

  function init(){
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

  async function getOrders(){
    const token = getToken();
    if(!token) return [];
    try{
      const res = await fetch(`${API_BASE}/orders`, { headers: { ...authHeaders() } });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message||'Failed to load orders');
      return data.map(o=> ({
        id: o.id,
        createdAt: o.createdAt,
        totalPrice: o.totalPrice,
        status: o.status || 'PENDING',
        items: o.items || []
      }));
    }catch(e){ console.error(e); return []; }
  }

  async function renderOrders(){
    const list = $('#ordersList');
    const empty = $('#ordersEmpty');
    if(!list || !empty) return;
    list.innerHTML = '';
    const t = getToken();
    if(!t){ empty.hidden = false; empty.textContent = 'Please login to see your orders.'; return; }
    const orders = await getOrders();
    if(!orders.length){ empty.hidden = false; return; } else { empty.hidden = true; }

    orders.forEach(order => {
      const card = document.createElement('article');
      card.className = 'card';
      card.dataset.orderId = order.id;
      
      // Determine which buttons to show based on order status
      const showCancel = order.status === 'PENDING';
      const showTrack = ['PENDING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status);
      const showReorder = ['DELIVERED', 'CANCELLED'].includes(order.status);
      
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
          <strong>Order #${order.id}</strong>
          <span class="chip" id="status-${order.id}">${order.status}</span>
        </div>
        <div class="product-meta">Placed on ${formatDate(order.createdAt)} · Total EGP ${Number(order.totalPrice||0).toFixed(2)}</div>
        <ul style="margin:.5rem 0 0;padding-left:1rem;color:var(--text-dim)">
          ${order.items.map(it=>`<li>${escapeHtml(it.productName)} × ${it.quantity}</li>`).join('')}
        </ul>
        <div style="display:flex;gap:.5rem;margin-top:.7rem" id="actions-${order.id}">
          ${showCancel ? `<button class="btn btn-ghost" data-cancel="${order.id}">Cancel Order</button>` : ''}
          ${showTrack ? `<button class="btn btn-ghost" data-track="${order.id}">Track</button>` : ''}
          ${showReorder ? `<button class="btn btn-secondary" data-reorder="${order.id}">Reorder</button>` : ''}
        </div>
      `;
      list.appendChild(card);
    });

    // Bind track button click
    $$('[data-track]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-track');
        const input = $('#trackInput');
        if (input) { 
          input.value = `MC-${String(id).padStart(6, '0')}`; 
          input.focus(); 
          const form = $('#trackForm'); 
          if (form) { 
            form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true})); 
          } 
        }
        // Scroll to tracking section
        const trackingSection = document.querySelector('.tracking-section');
        if (trackingSection) {
          trackingSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Bind cancel button click
    $$('[data-cancel]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        
        const orderId = btn.getAttribute('data-cancel');
        const token = getToken();
        if (!token) { 
          alert('Please login to cancel orders.'); 
          return; 
        }
        
        try {
          btn.disabled = true;
          btn.textContent = 'Cancelling...';
          
          const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() }
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(result.message || 'Failed to cancel order');
          }
          
          // Update UI to reflect cancellation
          const statusElement = document.getElementById(`status-${orderId}`);
          const actionsElement = document.getElementById(`actions-${orderId}`);
          
          if (statusElement) statusElement.textContent = 'CANCELLED';
          
          if (actionsElement) {
            actionsElement.innerHTML = `
              <button class="btn btn-ghost" data-track="${orderId}">Track</button>
              <button class="btn btn-secondary" data-reorder="${orderId}">Reorder</button>
            `;
            
            // Re-bind event listeners for the new buttons
            const trackBtn = actionsElement.querySelector('[data-track]');
            const reorderBtn = actionsElement.querySelector('[data-reorder]');
            
            if (trackBtn) {
              trackBtn.addEventListener('click', () => {
                const input = $('#trackInput');
                if (input) {
                  input.value = `MC-${String(orderId).padStart(6, '0')}`;
                  input.focus();
                  const form = $('#trackForm');
                  if (form) form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
                }
              });
            }
            
            if (reorderBtn) {
              reorderBtn.addEventListener('click', () => handleReorder(orderId));
            }
          }
          
          alert('Order has been cancelled successfully.');
        } catch (error) {
          console.error('Error cancelling order:', error);
          alert(error.message || 'Failed to cancel order. Please try again.');
          btn.disabled = false;
          btn.textContent = 'Cancel Order';
        }
      });
    });

    // Bind reorder button click
    $$('[data-reorder]').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-reorder');
        handleReorder(orderId);
      });
    });
    
    // Helper function to handle one-click reorder
    async function handleReorder(orderId) {
      const token = getToken();
      if (!token) {
        alert('Please login to reorder items.');
        return;
      }
      
      try {
        // Show loading state
        const reorderBtn = document.querySelector(`[data-reorder="${orderId}"]`);
        const originalText = reorderBtn?.textContent;
        if (reorderBtn) {
          reorderBtn.disabled = true;
          reorderBtn.textContent = 'Processing...';
        }
        
        // Call the one-click reorder endpoint
        const response = await fetch(`${API_BASE}/orders/${orderId}/reorder`, { 
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...authHeaders() 
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to reorder items');
        }
        
        // Show success message with new order ID
        alert(`Reorder successful! Your new order #${data.id} has been placed.`);
        
        // Refresh the orders list to show the new order
        await renderOrders();
        
      } catch (error) {
        console.error('Error reordering:', error);
        const errorMessage = error.message.includes('stock')
          ? error.message
          : 'Failed to reorder items. Please try again.';
        alert(errorMessage);
      } finally {
        // Reset button state
        const reorderBtn = document.querySelector(`[data-reorder="${orderId}"]`);
        if (reorderBtn) {
          reorderBtn.disabled = false;
          reorderBtn.textContent = 'Reorder';
        }
      }
    }
  }

  function formatDate(d){
    try{ return new Date(d).toLocaleDateString(); }catch(e){ return d; }
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

  document.addEventListener('DOMContentLoaded', init);
})();
