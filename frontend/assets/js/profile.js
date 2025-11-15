(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const API_BASE = 'http://localhost:4000/api';
  const storeKeyUser = 'mc_user';
  const getToken = ()=> localStorage.getItem('token');
  const setUser = (u)=> localStorage.setItem(storeKeyUser, JSON.stringify(u||{}));
  const getUser = ()=> { try { return JSON.parse(localStorage.getItem(storeKeyUser)||'null'); } catch { return null; } };
  const authHeaders = ()=> { const t=getToken(); return t? { Authorization: `Bearer ${t}` } : {}; };

  function guard(){
    if(!getToken()){
      window.location.replace('login.html');
      return false;
    }
    return true;
  }

  function init(){
    if(!guard()) return;
    const user = getUser() || {};
    const nameEl = $('#name');
    const emailEl = $('#email');
    const pwEl = $('#password');
    const dispName = $('#displayName');
    const dispEmail = $('#displayEmail');
    const avatar = $('#avatar');
    const hi = $('#profileHi');
    const form = $('#profileForm');
    const msg = $('#profileMsg');
    const logoutBtn = $('#logoutBtn');

    // Populate
    nameEl.value = user.username || '';
    emailEl.value = user.email || '';
    dispName.textContent = user.username || 'User';
    dispEmail.textContent = user.email || 'user@example.com';
    const initials = (user.username||'User').split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase();
    avatar.textContent = initials || 'U';
    hi.textContent = user.username ? `Hi, ${user.username.split(' ')[0]}` : 'Hi';

    // Prefs
    const prefDark = $('#prefDark');
    const prefEmail = $('#prefEmail');
    const darkVal = localStorage.getItem('mc_pref_dark') === '1';
    const emailVal = localStorage.getItem('mc_pref_email') !== '0';
    prefDark.checked = darkVal;
    prefEmail.checked = emailVal;
    applyDark(darkVal);
    prefDark.addEventListener('change', ()=>{ localStorage.setItem('mc_pref_dark', prefDark.checked?'1':'0'); applyDark(prefDark.checked); });
    prefEmail.addEventListener('change', ()=>{ localStorage.setItem('mc_pref_email', prefEmail.checked?'1':'0'); });

    // Load latest profile from API
    fetch(`${API_BASE}/users/me`, { headers: { ...authHeaders() } })
      .then(r=>r.json().then(d=>({ok:r.ok, d})))
      .then(({ok, d})=>{
        if(!ok) return;
        setUser(d);
        nameEl.value = d.username||'';
        emailEl.value = d.email||'';
        dispName.textContent = d.username||'User';
        dispEmail.textContent = d.email||'user@example.com';
        avatar.textContent = (d.username||'U').slice(0,2).toUpperCase();
      })
      .catch(()=>{});

    // Form submit
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      msg.textContent = '';
      const n = nameEl.value.trim();
      const em = emailEl.value.trim();
      const pw = pwEl.value; // not used in backend update here
      if(!n || !em){ msg.textContent = 'Please fill required fields.'; return; }

      fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json', ...authHeaders() },
        body: JSON.stringify({ username: n })
      })
      .then(r=> r.json().then(d=>({ok:r.ok,d})))
      .then(({ok,d})=>{
        if(!ok) throw new Error(d.message||'Failed to save');
        setUser(d);
        dispName.textContent = d.username||n;
        dispEmail.textContent = d.email||em;
        avatar.textContent = (n.split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase()) || 'U';
        if(typeof renderHeader === 'function'){ try{ renderHeader(); }catch{} }
        msg.textContent = 'Saved successfully.';
        pwEl.value='';
      })
      .catch(err=>{ msg.textContent = err.message; });
    });

    // Logout
    logoutBtn.addEventListener('click', ()=>{
      try { localStorage.removeItem('token'); localStorage.removeItem(storeKeyUser);} catch{}
      window.location.href = 'home.html';
    });
  }

  function applyDark(on){
    document.documentElement.dataset.theme = on ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', init);
})();
