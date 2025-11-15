(function(){
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));

  const DOCTORS = [
    {id:'d1', name:'Dr. Amina Hassan', spec:'General Medicine', status:'Online'},
    {id:'d2', name:'Dr. Karim Nabil', spec:'Dermatology', status:'Online'},
    {id:'d3', name:'Dr. Salma Eid', spec:'Pediatrics', status:'Away'},
    {id:'d4', name:'Dr. Ahmed Youssef', spec:'Cardiology', status:'Online'},
    {id:'d5', name:'Dr. Rana Mohamed', spec:'Diabetes & Endocrine', status:'Offline'}
  ];

  const state = {
    active: null,
    messages: {}, // {doctorId: [{from:'me'|'doc', text, ts}]}
  };

  function init(){
    renderDoctors();
    bindSearch();
    bindChat();
  }

  function renderDoctors(filter=''){
    const wrap = $('#doctorList');
    if(!wrap) return;
    wrap.innerHTML = '';
    DOCTORS.filter(d=> (d.name+d.spec).toLowerCase().includes(filter.toLowerCase()))
      .forEach(d=>{
        const row = document.createElement('button');
        row.className = 'doctor-row';
        row.type = 'button';
        row.setAttribute('data-id', d.id);
        row.innerHTML = `
          <div>
            <div class="doctor-name">${d.name}</div>
            <div class="doctor-meta">${d.spec} · ${d.status}</div>
          </div>`;
        row.addEventListener('click', ()=> openDoctor(d.id));
        wrap.appendChild(row);
      });
  }

  function bindSearch(){
    const i = $('#chatSearch');
    if(!i) return;
    i.addEventListener('input', ()=> renderDoctors(i.value.trim()));
  }

  function bindChat(){
    const form = $('#chatForm');
    const input = $('#chatText');
    if(!form || !input) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const txt = input.value.trim();
      if(!txt || !state.active) return;
      pushMsg(state.active, 'me', txt);
      input.value = '';
      setTimeout(()=> autoReply(state.active, txt), 400);
    });
    $('#endChatBtn')?.addEventListener('click', endChat);
  }

  function openDoctor(id){
    state.active = id;
    const d = DOCTORS.find(x=>x.id===id);
    $('#activeDoctorName').textContent = d.name;
    $('#activeDoctorMeta').textContent = `${d.spec} · ${d.status}`;
    renderMessages();
  }

  function endChat(){
    if(!state.active) return;
    pushMsg(state.active, 'doc', 'Thanks for chatting with me. Wishing you good health!');
  }

  function pushMsg(doctorId, from, text){
    if(!state.messages[doctorId]) state.messages[doctorId] = [];
    state.messages[doctorId].push({from, text, ts: Date.now()});
    renderMessages();
  }

  function renderMessages(){
    const box = $('#chatMessages');
    if(!box) return;
    box.innerHTML = '';
    const msgs = state.messages[state.active]||[];
    msgs.forEach(m=>{
      const line = document.createElement('div');
      line.className = 'msg ' + (m.from==='me'?'me':'doc');
      line.textContent = m.text;
      box.appendChild(line);
    });
    box.scrollTop = box.scrollHeight;
  }

  function autoReply(id, userText){
    const d = DOCTORS.find(x=>x.id===id);
    const suggestions = [
      `Please avoid self‑medication. Based on your message, I suggest booking a visit if symptoms persist.`,
      `For ${d.spec.toLowerCase()}, drink water, rest well, and monitor symptoms. If severe, seek urgent care.`,
      `You can share a photo or lab result here for a quick review (demo).`
    ];
    pushMsg(id, 'doc', suggestions[Math.floor(Math.random()*suggestions.length)]);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
