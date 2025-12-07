(function () {
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);
    const API_BASE = 'http://localhost:4000/api';

    // Auth helpers from auth.js (assuming they are not exposed globally, so re-implementing or accessing from localStorage)
    // Since auth.js is an IIFE, I can't access its functions directly. 
    // But I can read localStorage directly.
    const storeKeyToken = 'token';
    const storeKeyUser = 'mc_user';
    function getToken() { return localStorage.getItem(storeKeyToken); }
    function getUser() { try { return JSON.parse(localStorage.getItem(storeKeyUser) || 'null'); } catch { return null; } }
    function authHeaders() { const t = getToken(); return t ? { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }; }

    // Check Admin Access
    const user = getUser();
    if (!user || user.role !== 'ADMIN') {
        alert('Access Denied. Admins only.');
        window.location.href = 'home.html';
        return;
    }

    // DOM Elements
    const productTableBody = $('#productTableBody');
    const addProductBtn = $('#addProductBtn');
    const exportUsersBtn = $('#exportUsersBtn');
    const productModal = $('#productModal');
    const productForm = $('#productForm');
    const modalTitle = $('#modalTitle');
    const cancelModalBtn = $('#cancelModal');

    // State
    let products = [];
    let isEditing = false;

    // Fetch Products
    async function fetchProducts() {
        try {
            const res = await fetch(`${API_BASE}/products`);
            products = await res.json();
            renderProducts();
        } catch (err) {
            console.error('Failed to fetch products', err);
        }
    }

    // Render Products
    function renderProducts() {
        productTableBody.innerHTML = products.map(p => `
      <tr>
        <td><span style="color: var(--text-dim);">#${p.id}</span></td>
        <td><img src="${p.imageUrl || 'https://placehold.co/50'}" alt="${p.name}" class="product-img"></td>
        <td><div style="font-weight: 500;">${p.name}</div></td>
        <td>${p.price} EGP</td>
        <td>
          <span class="badge ${p.stockQuantity > 10 ? 'badge-success' : 'badge-danger'}">
            ${p.stockQuantity} in stock
          </span>
        </td>
        <td><span class="badge badge-neutral">${p.category}</span></td>
        <td style="text-align: right;">
          <button class="action-btn btn-edit" data-id="${p.id}" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn btn-delete" data-id="${p.id}" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');

        // Attach event listeners
        $$('.btn-edit').forEach(btn => btn.addEventListener('click', () => openEditModal(btn.dataset.id)));
        $$('.btn-delete').forEach(btn => btn.addEventListener('click', () => deleteProduct(btn.dataset.id)));
    }

    // Add/Edit Modal
    function openAddModal() {
        isEditing = false;
        modalTitle.textContent = 'Add Product';
        productForm.reset();
        $('#productId').value = '';
        productModal.classList.add('active');
    }

    function openEditModal(id) {
        const p = products.find(x => x.id == id);
        if (!p) return;
        isEditing = true;
        modalTitle.textContent = 'Edit Product';
        $('#productId').value = p.id;
        $('#pName').value = p.name;
        $('#pDesc').value = p.description;
        $('#pPrice').value = p.price;
        $('#pStock').value = p.stockQuantity;
        $('#pCategory').value = p.category;
        $('#pImg').value = p.imageUrl || '';
        productModal.classList.add('active');
    }

    function closeModal() {
        productModal.classList.remove('active');
    }

    // Handle Form Submit
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = $('#productId').value;
        const data = {
            name: $('#pName').value,
            description: $('#pDesc').value,
            price: $('#pPrice').value,
            stockQuantity: $('#pStock').value,
            category: $('#pCategory').value,
            imageUrl: $('#pImg').value
        };

        try {
            const url = isEditing ? `${API_BASE}/admin/products/${id}` : `${API_BASE}/admin/products`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to save product');

            closeModal();
            fetchProducts();
            alert(isEditing ? 'Product updated' : 'Product added');
        } catch (err) {
            alert(err.message);
        }
    });

    // Delete Product
    async function deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/products/${id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (!res.ok) throw new Error('Failed to delete');
            fetchProducts();
        } catch (err) {
            alert(err.message);
        }
    }

    // Export Users
    exportUsersBtn.addEventListener('click', async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/users/export`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (!res.ok) throw new Error('Failed to export');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            alert(err.message);
        }
    });

    // Listeners
    addProductBtn.addEventListener('click', openAddModal);
    cancelModalBtn.addEventListener('click', closeModal);

    // Init
    fetchProducts();

})();
