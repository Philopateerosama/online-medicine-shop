(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const API_BASE = 'http://localhost:4000/api';
  const storeKeyToken = 'token';
  const storeKeyUser = 'mc_user';

  function getToken(){ return localStorage.getItem(storeKeyToken); }
  function setToken(t){ localStorage.setItem(storeKeyToken, t); }
  function clearToken(){ localStorage.removeItem(storeKeyToken); }
  function isLoggedIn(){ return !!getToken(); }
  function setUser(user){ localStorage.setItem(storeKeyUser, JSON.stringify(user||{})); }
  function getUser(){ try { return JSON.parse(localStorage.getItem(storeKeyUser)||'null'); } catch { return null; } }
  function clearUser(){ localStorage.removeItem(storeKeyUser); }

  function authHeaders(){ const t=getToken(); return t? { Authorization: `Bearer ${t}` } : {}; }

  function renderHeader(){
    const wrap = $('#authControls');
    if(!wrap) return;
    wrap.innerHTML = '';
    if(isLoggedIn()){
      const user = getUser();
      const name = document.createElement('span');
      name.className = 'auth-name';
      name.textContent = user?.username ? `Hi, ${user.username}` : 'Logged in';

      const out = document.createElement('button');
      out.className = 'btn btn-ghost';
      out.textContent = 'Logout';
      out.addEventListener('click', ()=>{ 
        clearToken(); 
        clearUser(); 
        alert('You have been logged out.');
        window.location.href = 'home.html'; // Redirect to home page after logout
      });

      wrap.appendChild(name);
      wrap.appendChild(out);
    } else {
      const loginL = document.createElement('a');
      loginL.className = 'btn btn-ghost';
      loginL.href = 'login.html';
      loginL.textContent = 'Login';

      const su = document.createElement('a');
      su.className = 'btn btn-secondary';
      su.href = 'signup.html';
      su.textContent = 'Sign Up';

      wrap.appendChild(loginL);
      wrap.appendChild(su);
    }
  }

  function bindLogin(){
    const form = $('#loginForm');
    if(!form) return;
    const email = $('#email');
    const password = $('#password');
    const err = $('#loginError');

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      err.style.display = 'none';
      try{
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value.trim(), password: password.value })
        });
        const data = await res.json();
        if(!res.ok){ throw new Error(data.message || 'Login failed'); }
        setToken(data.token);
        // get profile
        try{
          const meRes = await fetch(`${API_BASE}/users/me`, { headers: { ...authHeaders() } });
          const me = await meRes.json();
          if(meRes.ok){ setUser(me); }
        }catch{}
        window.location.href = 'home.html';
      }catch(ex){ err.textContent = ex.message; err.style.display = 'block'; }
    });
  }

  function bindSignup(){
    const form = $('#signupForm');
    if(!form) return;
    const name = $('#name');
    const email = $('#email');
    const password = $('#password');
    const confirm = $('#confirm');
    const err = $('#signupError');

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      err.style.display = 'none';
      const n = name.value.trim();
      const em = email.value.trim();
      const pw = password.value;
      const cf = confirm.value;

      if(!n || !em || !pw || !cf){ err.textContent = 'Please fill all fields.'; err.style.display='block'; return; }
      if(pw.length < 6){ err.textContent = 'Password must be at least 6 characters.'; err.style.display='block'; return; }
      if(pw !== cf){ err.textContent = 'Passwords do not match.'; err.style.display='block'; return; }

      try{
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: n, email: em, password: pw })
        });
        const data = await res.json();
        if(!res.ok){ throw new Error(data.message || 'Registration failed'); }
        alert('Registration successful. Please login.');
        window.location.href = 'login.html';
      }catch(ex){ err.textContent = ex.message; err.style.display='block'; }
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    renderHeader();
    bindLogin();
    bindSignup();
  });
})();
