(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const $$ = (s, el=document)=> Array.from(el.querySelectorAll(s));

  const storeKeyUser = 'mc_user';
  const storeKeySession = 'mc_session';

  function getUser(){
    try { return JSON.parse(localStorage.getItem(storeKeyUser)||'null'); } catch { return null; }
  }
  function setUser(user){ localStorage.setItem(storeKeyUser, JSON.stringify(user)); }
  function clearUser(){ localStorage.removeItem(storeKeyUser); }

  function isLoggedIn(){ return !!localStorage.getItem(storeKeySession); }
  function login(email){ localStorage.setItem(storeKeySession, email||'1'); }
  function logout(){ localStorage.removeItem(storeKeySession); }

  function renderHeader(){
    const wrap = $('#authControls');
    if(!wrap) return;
    wrap.innerHTML = '';
    if(isLoggedIn()){
      const user = getUser();
      const name = document.createElement('span');
      name.className = 'auth-name';
      name.textContent = user?.name ? `Hi, ${user.name}` : 'Logged in';

      const out = document.createElement('button');
      out.className = 'btn btn-ghost';
      out.textContent = 'Logout';
      out.addEventListener('click', ()=>{ logout(); renderHeader(); alert('You have been logged out.'); });

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

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      err.style.display = 'none';
      const u = getUser();
      if(!u){ err.textContent = 'No account found. Please sign up first.'; err.style.display='block'; return; }
      if(email.value.trim().toLowerCase() !== (u.email||'').toLowerCase() || password.value !== (u.password||'')){
        err.textContent = 'Invalid email or password.'; err.style.display='block'; return;
      }
      login(u.email);
      window.location.href = 'home.html';
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

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      err.style.display = 'none';
      const n = name.value.trim();
      const em = email.value.trim();
      const pw = password.value;
      const cf = confirm.value;

      if(!n || !em || !pw || !cf){ err.textContent = 'Please fill all fields.'; err.style.display='block'; return; }
      if(pw.length < 6){ err.textContent = 'Password must be at least 6 characters.'; err.style.display='block'; return; }
      if(pw !== cf){ err.textContent = 'Passwords do not match.'; err.style.display='block'; return; }

      const user = { name:n, email:em, password:pw };
      setUser(user);
      login(em);
      window.location.href = 'home.html';
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    renderHeader();
    bindLogin();
    bindSignup();
  });
})();
