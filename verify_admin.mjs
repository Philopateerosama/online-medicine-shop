// Removed node-fetch import as Node 22 has global fetch
// import fetch from 'node-fetch'; 
import fs from 'fs';

const API_BASE = 'http://localhost:4000/api';

async function main() {
    try {
        console.log('--- Starting Verification ---');

        // 1. Login as Admin
        console.log('1. Logging in as Admin...');
        const adminRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@medconnect.com', password: 'admin123' })
        });

        if (!adminRes.ok) throw new Error(`Admin login failed: ${adminRes.statusText}`);
        const adminData = await adminRes.json();
        console.log('Admin Token:', adminData.token ? 'Received' : 'Missing');
        console.log('Admin Role:', adminData.role);

        if (adminData.role !== 'ADMIN') throw new Error('Role is not ADMIN');

        const adminHeaders = { 'Authorization': `Bearer ${adminData.token}`, 'Content-Type': 'application/json' };

        // 2. Add Product
        console.log('2. Adding Product...');
        const productRes = await fetch(`${API_BASE}/admin/products`, {
            method: 'POST',
            headers: adminHeaders,
            body: JSON.stringify({
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                stockQuantity: 10,
                category: 'Test',
                imageUrl: 'http://example.com/img.jpg'
            })
        });
        if (!productRes.ok) throw new Error(`Add Product failed: ${productRes.statusText}`);
        const product = await productRes.json();
        console.log('Product Added:', product.id);

        // 3. Export Users
        console.log('3. Exporting Users...');
        const exportRes = await fetch(`${API_BASE}/admin/users/export`, {
            headers: { 'Authorization': `Bearer ${adminData.token}` } // Excel export might not need Content-Type json, but needs auth
        });
        if (!exportRes.ok) throw new Error(`Export Users failed: ${exportRes.statusText}`);
        console.log('Export Users: OK');

        // 4. Login as Customer (Register first to be sure)
        console.log('4. Testing Customer Restrictions...');
        const customerEmail = `test${Date.now()}@example.com`;
        await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: customerEmail, username: 'TestUser', password: 'password123' })
        });

        const custRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: customerEmail, password: 'password123' })
        });
        const custData = await custRes.json();
        const custHeaders = { 'Authorization': `Bearer ${custData.token}`, 'Content-Type': 'application/json' };

        // 5. Try to access Admin Route as Customer
        const failRes = await fetch(`${API_BASE}/admin/products`, {
            method: 'POST',
            headers: custHeaders,
            body: JSON.stringify({ name: 'Fail Product' })
        });

        if (failRes.status === 403) {
            console.log('Customer Access Denied (Expected): OK');
        } else {
            console.error('Customer was able to access admin route!', failRes.status);
        }

        // Clean up test product
        console.log('Cleaning up...');
        await fetch(`${API_BASE}/admin/products/${product.id}`, {
            method: 'DELETE',
            headers: adminHeaders
        });

        console.log('--- Verification Complete: SUCCESS ---');

    } catch (err) {
        console.error('--- Verification Failed ---');
        console.error(err);
    }
}

main();
