(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const API_BASE = 'http://localhost:4000/api';
  const storeKeyUser = 'mc_user';

  const getToken = ()=> localStorage.getItem('token');
  const authHeaders = ()=> { const t = getToken(); return t ? { Authorization: `Bearer ${t}` } : {}; };
  const setUser = (u)=> localStorage.setItem(storeKeyUser, JSON.stringify(u||{}));
  const getUser = ()=> { try { return JSON.parse(localStorage.getItem(storeKeyUser)||'null'); } catch { return null; } };

  function guard(){
    if(!getToken()){
      window.location.replace('login.html');
      return false;
    }
    return true;
  }

  function two(n){ return n < 10 ? `0${n}` : `${n}`; }
  function formatDate(val){
    if(!val) return '';
    const d = new Date(val);
    if(isNaN(d.getTime())) return '';
    return `${two(d.getDate())}/${two(d.getMonth()+1)}/${d.getFullYear()}`;
  }
  function parseDate(str){
    if(!str) return null;
    const m = String(str).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if(!m) return null;
    const d = new Date(parseInt(m[3],10), parseInt(m[2],10)-1, parseInt(m[1],10));
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  function computeBMI(weightKg, heightCm){
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    if(!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0){
      return { bmi: null, label: 'Enter weight and height to see your BMI.' };
    }
    const meters = h / 100;
    const bmi = w / (meters * meters);
    let label = 'Healthy weight';
    if(bmi < 18.5) label = 'Underweight';
    else if(bmi < 25) label = 'Healthy weight';
    else if(bmi < 30) label = 'Overweight';
    else label = 'Obesity';
    return { bmi: Math.round(bmi * 10) / 10, label };
  }

  function init(){
    if(!guard()) return;

    const nameEl = $('#name');
    const emailEl = $('#email');
    const phoneEl = $('#phone');
    const dobEl = $('#dob');
    const addressEl = $('#address');
    const genderEl = $('#gender');
    const bloodTypeEl = $('#bloodType');
    const weightEl = $('#weight');
    const heightEl = $('#height');
    const allergiesEl = $('#allergies');
    const dispName = $('#displayName');
    const dispEmail = $('#displayEmail');
    const avatar = $('#avatar');
    const form = $('#profileForm');
    const msg = $('#profileMsg');
    const editBtn = $('#editBtn');
    const saveBtn = $('#saveBtn');
    const cancelBtn = $('#cancelBtn');
    const pwdModal = $('#pwdModal');
    const pwdInput = $('#pwdInput');
    const pwdErr = $('#pwdErr');
    const pwdCancel = $('#pwdCancel');
    const pwdConfirm = $('#pwdConfirm');
    const bmiValue = $('#bmiValue');
    const bmiLabel = $('#bmiLabel');
    const summaryBloodType = $('#summaryBloodType');
    const summaryGender = $('#summaryGender');
    const summaryHeight = $('#summaryHeight');
    const summaryWeight = $('#summaryWeight');
    const summaryAge = $('#summaryAge');

    function allControls(){
      return [nameEl, emailEl, phoneEl, dobEl, addressEl, genderEl, bloodTypeEl, weightEl, heightEl, allergiesEl];
    }
    function lock(){
      allControls().forEach(el=> el && el.setAttribute('disabled',''));
      editBtn.style.display = 'inline-flex';
      saveBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
    }
    function unlock(){
      allControls().forEach(el=> el && el.removeAttribute('disabled'));
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-flex';
      cancelBtn.style.display = 'inline-flex';
    }

    lock();

    function calcAge(dateVal){
      if(!dateVal) return '--';
      const dob = new Date(dateVal);
      if(isNaN(dob.getTime())) return '--';
      const diff = Date.now() - dob.getTime();
      const ageDate = new Date(diff);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    function hydrate(data){
      nameEl.value = data.username || '';
      emailEl.value = data.email || '';
      phoneEl.value = data.phone || '';
      dobEl.value = data.dateOfBirth ? formatDate(data.dateOfBirth) : '';
      addressEl.value = data.address || '';
      genderEl.value = data.gender || '';
      bloodTypeEl.value = data.bloodType || '';
      weightEl.value = data.weight ?? '';
      heightEl.value = data.height ?? '';
      allergiesEl.value = data.allergies || '';
      dispName.textContent = data.username || 'User';
      dispEmail.textContent = data.email || 'user@example.com';
      const initials = (data.username || 'User').split(/\s+/).map(part=>part[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
      avatar.textContent = initials || 'U';
      const bmi = computeBMI(data.weight, data.height);
      bmiValue.textContent = bmi.bmi ?? '--';
      bmiLabel.textContent = bmi.label;
      summaryBloodType.textContent = data.bloodType || '--';
      summaryGender.textContent = data.gender || '--';
      summaryHeight.textContent = data.height ? `${data.height} cm` : '--';
      summaryWeight.textContent = data.weight ? `${data.weight} kg` : '--';
      summaryAge.textContent = calcAge(data.dateOfBirth);
    }

    const cached = getUser();
    if(cached) hydrate(cached);

    fetch(`${API_BASE}/users/me`, { headers: { ...authHeaders() } })
      .then(r=> r.json().then(d=>({ ok: r.ok, d })))
      .then(({ok,d})=>{
        if(!ok) return;
        setUser(d);
        hydrate(d);
      })
      .catch(()=>{});

    function openModal(){
      pwdErr.style.display = 'none';
      pwdInput.value = '';
      if(pwdModal) pwdModal.style.display = 'flex';
    }
    function closeModal(){
      if(pwdModal) pwdModal.style.display = 'none';
    }

    editBtn.addEventListener('click', ()=>{
      msg.textContent = '';
      openModal();
    });

    if(pwdCancel){
      pwdCancel.addEventListener('click', closeModal);
    }

    if(pwdConfirm){
      pwdConfirm.addEventListener('click', async ()=>{
        pwdErr.style.display = 'none';
        const password = pwdInput.value;
        if(!password){
          pwdErr.textContent = 'Password is required.';
          pwdErr.style.display = 'block';
          return;
        }
        try{
          const res = await fetch(`${API_BASE}/users/verify-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify({ password })
          });
          const data = await res.json();
          if(!res.ok || !data.success){
            pwdErr.textContent = data.message || 'Incorrect password.';
            pwdErr.style.display = 'block';
            return;
          }
          closeModal();
          unlock();
          nameEl.focus();
        }catch(err){
          pwdErr.textContent = 'Unable to verify password. Please try again.';
          pwdErr.style.display = 'block';
        }
      });
    }

    cancelBtn.addEventListener('click', ()=>{
      const latest = getUser() || {};
      hydrate(latest);
      msg.textContent = '';
      lock();
    });

    function handleBMIInputs(){
      const bmi = computeBMI(weightEl.value, heightEl.value);
      bmiValue.textContent = bmi.bmi ?? '--';
      bmiLabel.textContent = bmi.label;
    }
    weightEl.addEventListener('input', handleBMIInputs);
    heightEl.addEventListener('input', handleBMIInputs);

    function maskDobInput(e){
      let val = e.target.value.replace(/\D/g, '').slice(0,8);
      if(val.length > 4){
        e.target.value = `${val.slice(0,2)}/${val.slice(2,4)}/${val.slice(4,8)}`;
      } else if(val.length > 2){
        e.target.value = `${val.slice(0,2)}/${val.slice(2,4)}`;
      } else {
        e.target.value = val;
      }
    }
    dobEl.addEventListener('input', maskDobInput);

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      msg.textContent = '';
      const username = nameEl.value.trim();
      if(!username){
        msg.textContent = 'Full name is required.';
        return;
      }
      const payload = {
        username,
        phone: phoneEl.value.trim() || null,
        address: addressEl.value.trim() || null,
        gender: genderEl.value || null,
        bloodType: bloodTypeEl.value || null,
        weight: weightEl.value ? parseFloat(weightEl.value) : null,
        height: heightEl.value ? parseFloat(heightEl.value) : null,
        allergies: allergiesEl.value.trim() || null,
        dateOfBirth: parseDate(dobEl.value)
      };

      fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      })
        .then(r=> r.json().then(d=>({ ok: r.ok, d })))
        .then(({ok,d})=>{
          if(!ok) throw new Error(d.message || 'Failed to save changes.');
          setUser(d);
          hydrate(d);
          msg.textContent = 'Profile updated successfully.';
          lock();
        })
        .catch(err=>{
          msg.textContent = err.message || 'Something went wrong. Please try again.';
        });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
