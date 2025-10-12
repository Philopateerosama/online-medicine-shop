(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const storeKeyUser = 'mc_user';
  const storeKeySession = 'mc_session';

  function getUser(){ try { return JSON.parse(localStorage.getItem(storeKeyUser)||'null'); } catch { return null; } }
  function setUser(u){ localStorage.setItem(storeKeyUser, JSON.stringify(u)); }
  function isLoggedIn(){ return !!localStorage.getItem(storeKeySession); }
  function setSession(email){ localStorage.setItem(storeKeySession, email||'1'); }

  function guard(){
    if(!isLoggedIn()){
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
    nameEl.value = user.name || '';
    emailEl.value = user.email || '';
    dispName.textContent = user.name || 'User';
    dispEmail.textContent = user.email || 'user@example.com';
    const initials = (user.name||'User').split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase();
    avatar.textContent = initials || 'U';
    hi.textContent = user.name ? `Hi, ${user.name.split(' ')[0]}` : 'Hi';

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

    // Form submit
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      msg.textContent = '';
      const n = nameEl.value.trim();
      const em = emailEl.value.trim();
      const pw = pwEl.value;
      if(!n || !em){ msg.textContent = 'Please fill required fields.'; return; }
      const newUser = { name:n, email:em, password: pw ? pw : (user.password||'') };
      setUser(newUser);
      setSession(em);
      dispName.textContent = n;
      dispEmail.textContent = em;
      avatar.textContent = (n.split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase()) || 'U';
      if(typeof renderHeader === 'function'){ try{ renderHeader(); }catch{} }
      msg.textContent = 'Saved successfully.';
      pwEl.value = '';
    });

    // Logout
    logoutBtn.addEventListener('click', ()=>{
      try { localStorage.removeItem(storeKeySession); } catch{}
      window.location.href = 'home.html';
    });
  }

  function applyDark(on){
    document.documentElement.dataset.theme = on ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', init);
})();
