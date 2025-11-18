(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  const API_BASE = 'http://localhost:4000/api';
  const getToken = () => localStorage.getItem('token');
  const authHeaders = () => { const t=getToken(); return t? { Authorization: `Bearer ${t}` } : {}; };

  // State
  const state = {
    products: [],
    filtered: [],
    categories: ['All'],
    cart: [], // server-driven cart items
    query: '',
    category: 'All',
    sort: 'name'
  };

  async function fetchProducts(){
    const grid = $('#productGrid');
    if(grid){ grid.innerHTML = '<div>Loading products...</div>'; }
    try{
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if(!res.ok) throw new Error(data.message||'Failed to load products');
      state.products = data.map(p=> ({
        id: String(p.id),
        name: p.name,
        price: Number(p.price||0),
        desc: p.description||'',
        imageUrl: p.imageUrl||'',
        category: p.category || 'General'
      }));
      const uniqueCats = Array.from(new Set(state.products.map(p => p.category))).sort();
      state.categories = ['All', ...uniqueCats];
      if(!state.categories.includes(state.category)){
        state.category = 'All';
      }
      filterAndRender();
    }catch(err){
      if(grid){ grid.innerHTML = `<div style="color:var(--error)">${err.message}</div>`; }
    }
  }

  const blogPosts = [
    {
      id: 'b1',
      title: 'Managing Hypertension: Daily Habits',
      excerpt: 'Simple lifestyle changes can help control blood pressure...',
      tag: 'Wellness',
      imageUrl: 'https://via.placeholder.com/800x400?text=Managing+Hypertension',
      fullContent: `
        <p>Hypertension, or high blood pressure, is a common condition that can lead to serious health problems if left unmanaged. The good news is that simple lifestyle changes can make a big difference in controlling your blood pressure.</p>
        <p>Regular physical activity is one of the most effective ways to lower your blood pressure. Aim for at least 150 minutes of moderate exercise per week, such as brisk walking, swimming, or cycling. Even small amounts of activity can help reduce your blood pressure.</p>
        <p>Eating a healthy diet rich in fruits, vegetables, whole grains, and low-fat dairy products can significantly lower blood pressure. The DASH (Dietary Approaches to Stop Hypertension) eating plan is specifically designed to help manage blood pressure.</p>
        <p>Reducing sodium intake, limiting alcohol, managing stress, and maintaining a healthy weight are other important factors in controlling hypertension. Remember to monitor your blood pressure regularly and follow your healthcare provider's recommendations.</p>
      `
    },
    {
      id: 'b2',
      title: 'Vitamin D: Are You Getting Enough?',
      excerpt: 'Sunlight, diet, and supplements explained...',
      tag: 'Nutrition',
      imageUrl: 'https://via.placeholder.com/800x400?text=Vitamin+D+Sources',
      fullContent: `
        <p>Vitamin D is essential for strong bones, immune function, and overall health. Despite its importance, many people don't get enough of this vital nutrient. Here's what you need to know about maintaining healthy vitamin D levels.</p>
        <p>Sunlight is the most natural source of vitamin D. When your skin is exposed to sunlight, it produces vitamin D. However, factors like geographic location, skin pigmentation, sunscreen use, and time of year can all affect vitamin D production.</p>
        <p>Dietary sources of vitamin D include fatty fish (like salmon and mackerel), egg yolks, and fortified foods such as milk, orange juice, and cereals. For many people, especially those with limited sun exposure, supplements may be necessary.</p>
        <p>Vitamin D deficiency can lead to bone pain, muscle weakness, and increased risk of fractures. In children, severe deficiency can cause rickets. Talk to your healthcare provider about whether you should have your vitamin D levels checked and if supplementation is right for you.</p>
      `
    },
    {
      id: 'b3',
      title: 'Safe Medicine Storage at Home',
      excerpt: 'Keep medicines safe and effective with these tips...',
      tag: 'Safety',
      imageUrl: 'https://via.placeholder.com/800x400?text=Medicine+Storage',
      fullContent: `
        <p>Proper medication storage is crucial for maintaining effectiveness and preventing accidental poisoning, especially in households with children. Follow these guidelines to ensure your medications are stored safely and effectively.</p>
        <p>Most medications should be stored in a cool, dry place away from direct sunlight and moisture. The bathroom medicine cabinet is often not the best place due to humidity from showers. Instead, consider a high shelf in a bedroom closet or a kitchen cabinet away from the stove and sink.</p>
        <p>Always keep medications in their original containers with child-resistant caps securely fastened. Never transfer medications to unlabeled containers, as this can lead to dangerous mix-ups. Be particularly careful with medications that look similar to candy, especially gummy vitamins and chewable tablets.</p>
        <p>Regularly check your medicine cabinet for expired medications and dispose of them properly. Many pharmacies offer take-back programs for safe disposal. Never flush medications down the toilet unless the label specifically instructs you to do so.</p>
      `
    },
    {
      id: 'b4',
      title: 'The Importance of Sleep for Overall Health',
      excerpt: 'How quality sleep affects your physical and mental well-being...',
      tag: 'Wellness',
      imageUrl: 'https://via.placeholder.com/800x400?text=Quality+Sleep',
      fullContent: `
        <p>Sleep is not just a period of rest, but a critical component of overall health and well-being. Adults typically need 7-9 hours of quality sleep each night, yet many people regularly get less than the recommended amount.</p>
        <p>During sleep, your body works to support healthy brain function and maintain physical health. In children and teens, sleep also supports growth and development. Chronic sleep deficiency can increase the risk of various health problems, including heart disease, kidney disease, high blood pressure, diabetes, and stroke.</p>
        <p>To improve sleep quality, establish a regular sleep schedule, create a restful environment, and develop a relaxing bedtime routine. Avoid caffeine, nicotine, and large meals before bedtime, and limit screen time in the evening as the blue light can interfere with your natural sleep-wake cycle.</p>
        <p>If you consistently have trouble sleeping or feel tired during the day despite getting enough sleep, consult with a healthcare professional. You may have a sleep disorder that requires treatment.</p>
      `
    },
    {
      id: 'b5',
      title: 'Understanding Food Allergies and Intolerances',
      excerpt: 'Learn the differences and how to manage them...',
      tag: 'Nutrition',
      imageUrl: 'https://via.placeholder.com/800x400?text=Food+Allergies',
      fullContent: `
        <p>Food allergies and intolerances are often confused, but they are different conditions that affect the body in distinct ways. Understanding these differences is crucial for proper management and treatment.</p>
        <p>A food allergy involves the immune system and can cause severe, potentially life-threatening reactions. Common food allergens include peanuts, tree nuts, milk, eggs, wheat, soy, fish, and shellfish. Even tiny amounts of the allergen can trigger symptoms like hives, swelling, difficulty breathing, and anaphylaxis.</p>
        <p>In contrast, food intolerances (like lactose intolerance) typically involve the digestive system and are generally less serious. Symptoms may include bloating, gas, diarrhea, or stomach pain. While uncomfortable, these reactions are not life-threatening.</p>
        <p>If you suspect you have a food allergy or intolerance, consult with a healthcare professional for proper testing and diagnosis. They can help you develop a management plan, which may include dietary changes, medications, or carrying emergency treatment like an epinephrine auto-injector for severe allergies.</p>
      `
    },
    {
      id: 'b6',
      title: 'First Aid Essentials for Every Home',
      excerpt: 'Be prepared for common household emergencies...',
      tag: 'Safety',
      imageUrl: 'https://via.placeholder.com/800x400?text=First+Aid+Kit',
      fullContent: `
        <p>Having a well-stocked first aid kit and knowing how to use it can make a significant difference in an emergency. Whether you're dealing with minor cuts and scrapes or more serious situations before professional help arrives, being prepared is key.</p>
        <p>Every home first aid kit should include: adhesive bandages in various sizes, sterile gauze pads and adhesive tape, antiseptic wipes and antibiotic ointment, tweezers and scissors, a digital thermometer, disposable gloves, pain relievers, antihistamines, and any personal medications. Also include emergency phone numbers and a first aid manual.</p>
        <p>Basic first aid skills everyone should know include how to clean and dress a wound, perform CPR, help someone who is choking, recognize the signs of a heart attack or stroke, and treat minor burns. Consider taking a certified first aid and CPR course to be fully prepared.</p>
        <p>Regularly check your first aid kit to replace used or expired items. Store it in a cool, dry place that's easily accessible to adults but out of reach of young children, and make sure all family members know where it's kept.</p>
      `
    }
  ];

  async function init(){
    // Load data
    fetchProducts();

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
    
    // Check if user is logged in and fetch cart
    const token = getToken();
    if (token) {
      try {
        await fetchCart();
        renderCart(); // This will update the badge immediately
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    
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
    let list = state.products.filter(p=> {
      const matchesQuery = (!q || p.name.toLowerCase().includes(q) || (p.desc||'').toLowerCase().includes(q));
      const matchesCategory = state.category === 'All' || p.category === state.category;
      return matchesQuery && matchesCategory;
    });
    switch(state.sort){
      case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
      case 'name': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
      default: list.sort((a,b)=>a.name.localeCompare(b.name));
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
        <div class="product-media" aria-hidden="true">${p.imageUrl? `<img src="${p.imageUrl}" alt="${p.name}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;"/>` : '💊'}</div>
        <div class="product-title">${p.name}</div>
        <div class="product-meta">${p.desc||''}</div>
        <div class="price">EGP ${p.price.toFixed(2)}</div>
        <div class="card-actions">
          <div role="button" class="btn btn-secondary" data-add="${p.id}" style="cursor: pointer; display: inline-block; text-align: center; user-select: none;">Add to Cart</div>
        </div>`;
      grid.appendChild(card);
    });

    // Bind add-to-cart
    $$('#productGrid [data-add]').forEach(btn=>{
      btn.addEventListener('click', async (event)=>{ 
        console.log('Add to Cart button clicked - preventing default behavior');
        event.preventDefault();
        event.stopPropagation();
        
        const id = btn.getAttribute('data-add');
        console.log('Calling addToCart with product ID:', id);
        try {
          await addToCart(id, 1);
          console.log('addToCart completed successfully');
        } catch (error) {
          console.error('Error in addToCart:', error);
        }
        return false;
      }, true); // Use capture phase to catch the event early
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
    
    // If we're on the blog page, add a title and adjust the grid layout
    if(window.location.pathname.includes('blog.html')) {
      grid.innerHTML = `
        <h2 style="grid-column:1/-1;margin-bottom:1.5rem;font-size:1.8rem;color:var(--text-primary)">Health & Wellness Blog</h2>
      `;
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
      grid.style.gap = '1.5rem';
    } else {
      // On homepage, just clear the grid
      grid.innerHTML = '';
    }
    
    blogPosts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'card blog-card';
      card.style.height = '100%';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      
      // Create a link that wraps the entire card
      const link = document.createElement('a');
      link.href = `post.html?id=${post.id}`;
      link.style.textDecoration = 'none';
      link.style.color = 'inherit';
      
      // Add the image
      const img = document.createElement('div');
      img.style.height = '180px';
      img.style.backgroundImage = `url('${post.imageUrl}')`;
      img.style.backgroundSize = 'cover';
      img.style.backgroundPosition = 'center';
      img.style.borderRadius = '8px 8px 0 0';
      img.style.margin = '-1rem -1rem 1rem -1rem';
      img.alt = post.title;
      
      // Content container
      const content = document.createElement('div');
      content.style.padding = '0 1rem 1rem';
      content.style.flexGrow = '1';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      
      // Tag chip
      const tag = document.createElement('span');
      tag.className = 'chip';
      tag.textContent = post.tag;
      tag.style.alignSelf = 'flex-start';
      tag.style.marginBottom = '0.75rem';
      
      // Title
      const title = document.createElement('h3');
      title.textContent = post.title;
      title.style.margin = '0 0 0.5rem 0';
      title.style.fontSize = '1.1rem';
      
      // Excerpt
      const excerpt = document.createElement('p');
      excerpt.textContent = post.excerpt;
      excerpt.style.color = 'var(--text-dim)';
      excerpt.style.margin = '0 0 1rem 0';
      excerpt.style.fontSize = '0.9rem';
      
      // Read more link
      const readMore = document.createElement('span');
      readMore.className = 'btn btn-ghost';
      readMore.textContent = 'Read More';
      readMore.style.alignSelf = 'flex-start';
      readMore.style.marginTop = 'auto';
      readMore.style.padding = '0';
      readMore.style.fontSize = '0.9rem';
      
      // Prevent default on the Read More link since the entire card is clickable
      readMore.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `post.html?id=${post.id}`;
      });
      
      // Assemble the card
      content.appendChild(tag);
      content.appendChild(title);
      content.appendChild(excerpt);
      content.appendChild(readMore);
      
      link.appendChild(img);
      link.appendChild(content);
      card.appendChild(link);
      
      grid.appendChild(card);
    });
    
    // Add some CSS for the blog grid if we're on the blog page
    if(window.location.pathname.includes('blog.html')) {
      const style = document.createElement('style');
      style.textContent = `
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 1rem 0;
        }
        .blog-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Cart
  function bindCart(){
    $('#cartBtn').addEventListener('click', () => {
      const token = getToken();
      if (!token) {
        window.location.href = 'login.html';
        return;
      }
      openCart();
    });
    $('#closeCartBtn').addEventListener('click', closeCart);
    $('#backdrop').addEventListener('click', closeCart);
    $('#checkoutBtn').addEventListener('click', async ()=>{
      const t = getToken();
      if(!t){ alert('Please login to checkout.'); return; }
      try{
        const res = await fetch(`${API_BASE}/orders`, { method:'POST', headers: { 'Content-Type':'application/json', ...authHeaders() } });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message||'Checkout failed');
        alert('Order placed successfully.');
        await fetchCart();
        renderCart();
      }catch(e){ alert(e.message); }
    });
    renderCart();
  }
  async function openCart(){ await fetchCart(); renderCart(); $('#cartDrawer').classList.add('open'); $('#backdrop').hidden = false; }
  function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#backdrop').hidden = true; }
  async function fetchCart(){
    const t = getToken(); if(!t){ state.cart = []; return; }
    try{
      const res = await fetch(`${API_BASE}/cart`, { headers: { ...authHeaders() } });
      const data = await res.json();
      if(res.ok){ state.cart = data?.items||[]; } else { state.cart = []; }
    }catch{ state.cart = []; }
  }
  async function addToCart(productId, quantity){
    const t = getToken(); 
    if(!t){ 
      window.location.href = 'login.html'; 
      return; 
    }
    try {
      const res = await fetch(`${API_BASE}/cart`, { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          ...authHeaders() 
        }, 
        body: JSON.stringify({ 
          productId: Number(productId), 
          quantity: Number(quantity) || 1 
        }) 
      });
      
      if(!res.ok) { 
        const data = await res.json(); 
        throw new Error(data.message || 'Failed to add to cart'); 
      }
      
      // Optimistically update the UI
      const badge = $('#cartCount');
      if (badge) {
        const currentCount = parseInt(badge.textContent || '0', 10);
        badge.textContent = (currentCount + (Number(quantity) || 1)).toString();
        badge.hidden = false;
      }
      
      // Then sync with server
      await fetchCart();
      renderCart();
      
    } catch(e) { 
      console.error('Error adding to cart:', e);
      alert(e.message); 
    }
  }
  async function updateQty(itemId, qty) {
    const t = getToken(); 
    if (!t) return;
    
    try {
      const newQty = Math.max(1, Number(qty) || 1);
      const res = await fetch(`${API_BASE}/cart/${itemId}`, { 
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json', 
          ...authHeaders() 
        }, 
        body: JSON.stringify({ quantity: newQty }) 
      });
      
      if (!res.ok) { 
        const data = await res.json(); 
        throw new Error(data.message || 'Failed to update quantity'); 
      }
      
      // Update the cart and re-render
      await fetchCart();
      renderCart();
      
    } catch(e) { 
      console.error('Error updating quantity:', e);
      alert(e.message); 
    }
  }
  async function removeFromCart(itemId) {
    const t = getToken(); 
    if (!t) return;
    
    try {
      // Store the current cart item to update the badge optimistically
      const itemToRemove = state.cart.find(item => String(item.id) === String(itemId));
      
      const res = await fetch(`${API_BASE}/cart/${itemId}`, { 
        method: 'DELETE', 
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders() 
        } 
      });
      
      if (!res.ok) { 
        const data = await res.json(); 
        throw new Error(data.message || 'Failed to remove item'); 
      }
      
      // Optimistically update the UI
      const badge = $('#cartCount');
      if (badge && itemToRemove) {
        const currentCount = parseInt(badge.textContent || '0', 10);
        const newCount = Math.max(0, currentCount - (itemToRemove.quantity || 1));
        badge.textContent = newCount.toString();
        badge.hidden = newCount === 0;
      }
      
      // Then sync with server
      await fetchCart();
      renderCart();
      
    } catch(e) { 
      console.error('Error removing from cart:', e);
      alert(e.message); 
    }
  }
  function cartTotal(){
    return (state.cart||[]).reduce((sum, it)=> sum + (Number(it.product?.price||0) * Number(it.quantity||0)), 0);
  }
  function renderCart(){
    const cont = $('#cartItems');
    const count = $('#cartCount');
    const total = $('#cartTotal');
    cont.innerHTML = '';
    let itemCount = 0;
    (state.cart||[]).forEach(it=>{
      const p = it.product;
      if(!p) return;
      itemCount += it.quantity;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-thumb">${p.imageUrl? `<img src="${p.imageUrl}" alt="${p.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;"/>` : '💊'}</div>
        <div>
          <div class="product-title">${p.name}</div>
          <div class="cart-meta">EGP ${Number(p.price).toFixed(2)}</div>
          <div class="qty" style="margin-top:6px">
            <button aria-label="Decrease quantity" data-dec="${it.id}">−</button>
            <input aria-label="Quantity" type="number" min="1" value="${it.quantity}" data-qty="${it.id}" />
            <button aria-label="Increase quantity" data-inc="${it.id}">+</button>
          </div>
        </div>
        <div>
          <div role="button" class="btn btn-ghost" data-remove="${it.id}" style="cursor: pointer; display: inline-block; user-select: none;">Remove</div>
        </div>`;
      cont.appendChild(row);
    });
    count.textContent = String(itemCount);
    total.textContent = `EGP ${cartTotal().toFixed(2)}`;

    // Bind qty and remove
    $$('[data-dec]').forEach(b=> b.addEventListener('click', ()=>{ const id=b.getAttribute('data-dec'); const item=state.cart.find(i=>String(i.id)===String(id)); if(item){ updateQty(id, item.quantity-1); } }));
    $$('[data-inc]').forEach(b=> b.addEventListener('click', ()=>{ const id=b.getAttribute('data-inc'); const item=state.cart.find(i=>String(i.id)===String(id)); if(item){ updateQty(id, item.quantity+1); } }));
    $$('[data-qty]').forEach(inp=> inp.addEventListener('change', ()=>{ const id=inp.getAttribute('data-qty'); updateQty(id, parseInt(inp.value,10)||1); }));
    $$('[data-remove]').forEach(btn=> {
      btn.addEventListener('click', (e)=> {
        console.log('Remove from Cart button clicked - preventing default behavior');
        e.preventDefault();
        e.stopPropagation();
        const itemId = btn.getAttribute('data-remove');
        console.log('Calling removeFromCart with item ID:', itemId);
        try {
          removeFromCart(itemId);
          console.log('removeFromCart completed successfully');
        } catch (error) {
          console.error('Error in removeFromCart:', error);
        }
        return false;
      }, true); // Use capture phase to catch the event early
    });
  }

  // Kick off
  document.addEventListener('DOMContentLoaded', init);
})();
