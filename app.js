/* BuzzArena V4 — Quiz multijoueur avec présentateur IA */
const PRESENTER_LINES = {
  welcome: "Bienvenue dans BuzzArena !",
  double: "Attention... cette question vaut DOUBLE !",
  triple: "Cette question vaut TRIPLE !",
  finalists: "Les deux finalistes sont {a} et {b}. Que le meilleur gagne !",
  drumroll: "Après une magnifique partie... le champion de BuzzArena est...",
  champion: "{name} ! Félicitations !",
  analysis: "{name} remporte cette partie avec {correct} bonnes réponses et un temps moyen de {avgTime} seconde. Une performance exceptionnelle !",
  closing: "Merci d'avoir joué à BuzzArena. À très bientôt pour une nouvelle compétition !",
  allAnswered: "Tout le monde a répondu ! Passons à la correction."
};

(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const views = ['homeView','lobbyView','gameView','resultsView','finalView'];

  const state = {
    db:null, auth:null, roomCode:null, playerId:null, playerName:null,
    isHost:false, room:null, currentTimer:null, sound:true, localMode:false,
    roomRef:null, presenceRef:null,
    presenterMode:'tv-male', // tv-male | tv-female | sober | off
    speechQueue:[], speaking:false
  };

  const els = Object.fromEntries([
    'homeView','lobbyView','gameView','resultsView','finalView',
    'createName','joinName','timerRange','timerValue','roomCodeInput',
    'createRoomBtn','joinRoomBtn','roomCodeLabel','roomMeta','playersList',
    'copyLinkBtn','startGameBtn','waitingText','roundLabel','questionCounter',
    'myScore','multiplierBanner','timerRing','timerText','questionText',
    'answersText','buzzers','answerStatus','correctAnswerLabel',
    'questionRanking','nextProgress','soundToggle','modal','modalIcon',
    'modalTitle','modalText','modalBtn','toast','audioBuzz','audioTick',
    'audioAmbient','audioTimeEnd','audioVictory','audioDrumroll','audioFinish',
    'presenterToggle','presenterModal','presenterSaveBtn','championTitle',
    'championName','finalStats','finalBadges','finalRanking','newGameBtn',
    'quitBtn','presenterClosing','spotlightOverlay','confettiCanvas','trophyIcon'
  ].map(id=>[id,$('#'+id)]));

  /* ─── UTILS ─── */
  function showView(id){ views.forEach(v=>els[v].classList.toggle('active',v===id)); }
  function toast(msg){ els.toast.textContent=msg; els.toast.classList.remove('hidden'); setTimeout(()=>els.toast.classList.add('hidden'),2200); }
  function randomCode(){ return Math.random().toString(36).slice(2,8).toUpperCase(); }
  function randomId(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }
  function escapeHtml(s=''){ return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function topicName(v){ const map={general:'Culture générale',contemporary:'Culture contemporaine',history:'Histoire',cinema:'7ᵉ Art',sport:'Sport',animals:'Animaux',capitals:'Capitales',flags:'Drapeaux'}; return map[v]||v; }
  function isFirebaseReady(){ return typeof FIREBASE_CONFIG!=='undefined' && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.databaseURL && FIREBASE_CONFIG.projectId; }
  function play(audio, restart=true){ if(!state.sound) return; try{ if(restart) audio.currentTime=0; audio.play().catch(()=>{}); }catch{} }
  function stop(audio){ try{audio.pause();audio.currentTime=0}catch{} }
  function saveLocal(){ if(!state.localMode) localStorage.setItem('buzzarena_session', JSON.stringify({playerId:state.playerId,playerName:state.playerName,roomCode:state.roomCode,isHost:state.isHost})); }
  function loadLocal(){ try{ return JSON.parse(localStorage.getItem('buzzarena_session')||'null'); }catch{return null} }
  function clearLocal(){ localStorage.removeItem('buzzarena_session'); }

  async function signInAnonymous() {
    if (firebase.auth().currentUser) {
        return firebase.auth().currentUser;
    }

    const result = await firebase.auth().signInAnonymously();
    return result.user;
}


  
  /* ─── PRÉSENTATEUR VOCAL ─── */
  function getVoices(){ return window.speechSynthesis?.getVoices()||[]; }
  function pickVoice(gender){
    const voices = getVoices();
    const fr = voices.filter(v => v.lang.startsWith('fr'));
    if(!fr.length) return voices[0]||null;
    if(gender==='male') return fr.find(v=>v.name.toLowerCase().includes('homme')||v.name.toLowerCase().includes('thomas')||v.name.toLowerCase().includes('daniel')||v.name.toLowerCase().includes('paul')) || fr.find(v=>!v.name.toLowerCase().includes('female')&&!v.name.toLowerCase().includes('femme')) || fr[0];
    return fr.find(v=>v.name.toLowerCase().includes('female')||v.name.toLowerCase().includes('femme')||v.name.toLowerCase().includes('marie')||v.name.toLowerCase().includes('julie')) || fr[0];
  }
  function speak(text, priority=false){
    if(state.presenterMode==='off') return;
    if(state.presenterMode==='sober'){ /* texte seul — on pourrait afficher une bannière */ return; }
    if(!window.speechSynthesis) return;
    const gender = state.presenterMode==='tv-female'?'female':'male';
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR'; utter.rate = 1; utter.pitch = 1;
    const v = pickVoice(gender); if(v) utter.voice = v;
    if(priority){ window.speechSynthesis.cancel(); window.speechSynthesis.speak(utter); }
    else{ state.speechQueue.push(utter); processSpeechQueue(); }
  }
  function processSpeechQueue(){
    if(state.speaking || !state.speechQueue.length) return;
    state.speaking = true;
    const utter = state.speechQueue.shift();
    utter.onend = ()=>{ state.speaking=false; processSpeechQueue(); };
    utter.onerror = ()=>{ state.speaking=false; processSpeechQueue(); };
    window.speechSynthesis.speak(utter);
  }
  function presenterSay(key, vars={}){
    if(state.presenterMode==='off') return;
    let text = PRESENTER_LINES[key]||key;
    Object.entries(vars).forEach(([k,v])=>text=text.replace(`{${k}}`,v));
    speak(text);
  }

  /* ─── CONFETTIS & FEUX D'ARTIFICE ─── */
  function launchConfetti(){
    const c = els.confettiCanvas; if(!c) return;
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const particles = [];
    const colors = ['#ffd700','#ff2d8d','#22d3ee','#73d13d','#ff9f1c','#7c5cff','#ffffff'];
    for(let i=0;i<200;i++){
      particles.push({x:Math.random()*c.width,y:Math.random()*c.height-200,vx:(Math.random()-.5)*6,vy:Math.random()*4+2,rot:Math.random()*360,rotSpd:(Math.random()-.5)*10,color:colors[Math.floor(Math.random()*colors.length)],size:Math.random()*8+4,life:Math.random()*100+100});
    }
    let anim;
    function frame(){
      ctx.clearRect(0,0,c.width,c.height);
      let alive=0;
      particles.forEach(p=>{
        if(p.life<=0) return;
        alive++;
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotSpd; p.vy+=.08; p.life--;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.color; ctx.globalAlpha=Math.min(1,p.life/30);
        ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size); ctx.restore();
      });
      if(alive) anim=requestAnimationFrame(frame);
    }
    frame();
    setTimeout(()=>cancelAnimationFrame(anim),8000);
  }
  function launchFireworks(){
    const container = document.body;
    for(let i=0;i<8;i++){
      setTimeout(()=>{
        const fw = document.createElement('div');
        fw.className='firework';
        fw.style.left = (20+Math.random()*60)+'%';
        fw.style.top = (10+Math.random()*40)+'%';
        fw.style.background = ['#ff2d8d','#22d3ee','#ffd700','#73d13d','#ff9f1c'][Math.floor(Math.random()*5)];
        fw.style.boxShadow = `0 0 20px 10px ${fw.style.background}`;
        container.appendChild(fw);
        setTimeout(()=>fw.remove(),1500);
      }, i*400);
    }
  }

  /* ─── THÈMES MULTIPLES ─── */
  function getSelectedTopics(){
    return $$('#topicCheckboxes input[type="checkbox"]:checked').map(cb=>cb.value);
  }
  function distributeQuestions(topics, count, multipliers=false, usedIds=new Set()){
    // Répartition équilibrée des questions entre les thèmes sélectionnés
    const perTopic = Math.floor(count/topics.length);
    let remainder = count - perTopic*topics.length;
    let allQuestions = [];
    topics.forEach(topic=>{
      let n = perTopic + (remainder>0?1:0);
      if(remainder>0) remainder--;
      const qs = buildQuestionSet([topic], n, false, usedIds);
      qs.forEach(q=>{q.topic=topic; allQuestions.push(q);});
    });
    // Mélanger
    allQuestions.sort(()=>Math.random()-.5);
    // Appliquer multiplicateurs
    if(multipliers && allQuestions.length>=4){
      const pos = [...allQuestions.keys()].sort(()=>Math.random()-.5);
      pos.slice(0,3).forEach(i=>allQuestions[i].multiplier=2);
      allQuestions[pos[3]].multiplier=3;
    }
    return allQuestions;
  }

  /* ─── BACKEND ─── */
  async function initBackend(){

    if(isFirebaseReady()){

        firebase.initializeApp(FIREBASE_CONFIG);

        await signInAnonymous();

        state.db = firebase.database();

    }else{

        state.localMode = true;

    }

}
    try{
      if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      state.auth=firebase.auth();
      state.db=firebase.database();
      await state.auth.signInAnonymously();
      state.playerId=state.auth.currentUser.uid;
      state.db.ref('.info/connected').on('value',snap=>{
        if(snap.val()===true && state.presenceRef){
          state.presenceRef.onDisconnect().update({connected:false,lastSeen:firebase.database.ServerValue.TIMESTAMP});
          state.presenceRef.update({connected:true,lastSeen:firebase.database.ServerValue.TIMESTAMP});
        }
      });
    }catch(error){
      console.error(error);
      state.localMode=true;
      toast('Firebase indisponible : mode démonstration activé');
    }
  }

  /* ─── UI EVENTS ─── */
  els.timerRange.addEventListener('input',()=>els.timerValue.textContent=`${els.timerRange.value} s`);
  els.soundToggle.addEventListener('click',()=>{ state.sound=!state.sound; els.soundToggle.textContent=state.sound?'🔊':'🔇'; if(!state.sound) [els.audioTick,els.audioAmbient].forEach(stop); else if(state.room?.phase!=='lobby') play(els.audioAmbient,false); });
  els.presenterToggle.addEventListener('click',()=>els.presenterModal.classList.remove('hidden'));
  els.presenterSaveBtn.addEventListener('click',()=>{
    const mode = document.querySelector('input[name="presenterMode"]:checked')?.value || 'tv-male';
    state.presenterMode = mode; localStorage.setItem('buzzarena_presenter', mode);
    els.presenterModal.classList.add('hidden'); toast(mode==='off'?'Commentaires désactivés':'Présentateur configuré');
  });
  els.copyLinkBtn.addEventListener('click',async()=>{ const link=`${location.origin}${location.pathname}?room=${state.roomCode}`; await navigator.clipboard.writeText(link); toast('Lien du salon copié'); });
  els.modalBtn.addEventListener('click',()=>els.modal.classList.add('hidden'));
  els.newGameBtn.addEventListener('click',()=>{ clearLocal(); location.reload(); });
  els.quitBtn.addEventListener('click',()=>{ clearLocal(); location.href=location.pathname; });

  /* ─── CRÉER SALON ─── */
  els.createRoomBtn.addEventListener('click', async()=>{
    const name=els.createName.value.trim(); if(!name) return toast('Saisissez votre pseudo');
    const topics = getSelectedTopics(); if(!topics.length) return toast('Sélectionnez au moins un thème');
    state.playerName=name; if(state.localMode) state.playerId=randomId(); state.isHost=true; state.roomCode=randomCode();
    const room={
      code:state.roomCode,hostId:state.playerId,topics:topics,duration:+els.timerRange.value,
      phase:'lobby',round:0,questionIndex:-1,
      players:{[state.playerId]:{name,score:0,connected:true,stats:{correctCount:0,totalTime:0,totalAnswered:0,maxStreak:0,lightningCount:0}}},
      createdAt:Date.now(),usedQuestionIds:{}
    };
    if(state.localMode){ state.room=room; renderLobby(); showView('lobbyView'); }
    else { await state.db.ref(`rooms/${state.roomCode}`).set(room); subscribeRoom(); }
    history.replaceState(null,'',`?room=${state.roomCode}`); saveLocal();
  });

  /* ─── REJOINDRE SALON ─── */
  els.joinRoomBtn.addEventListener('click', async()=>{
    const name=els.joinName.value.trim(), code=els.roomCodeInput.value.trim().toUpperCase();
    if(!name||!code) return toast('Saisissez votre pseudo et le code');
    if(state.localMode) return toast('Configurez Firebase pour rejoindre un salon en ligne');
    const snap=await state.db.ref(`rooms/${code}`).once('value'); if(!snap.exists()) return toast('Salon introuvable');
    const room=snap.val(); if(room.phase!=='lobby') return toast('La partie a déjà commencé');
    state.playerName=name; state.roomCode=code; state.isHost=false;
    await state.db.ref(`rooms/${code}/players/${state.playerId}`).set({name,score:0,connected:true,stats:{correctCount:0,totalTime:0,totalAnswered:0,maxStreak:0,lightningCount:0},lastSeen:firebase.database.ServerValue.TIMESTAMP});
    subscribeRoom(); saveLocal();
  });

  function subscribeRoom(){
    if(state.roomRef) state.roomRef.off();
    state.roomRef=state.db.ref(`rooms/${state.roomCode}`);
    state.presenceRef=state.db.ref(`rooms/${state.roomCode}/players/${state.playerId}`);
    state.presenceRef.onDisconnect().update({connected:false,lastSeen:firebase.database.ServerValue.TIMESTAMP});
    state.presenceRef.update({connected:true,lastSeen:firebase.database.ServerValue.TIMESTAMP});
    state.roomRef.on('value',snap=>{
      if(!snap.exists()){ toast('Le salon a été fermé'); showView('homeView'); clearLocal(); return; }
      const prev=state.room; state.room=snap.val();
      state.isHost=state.room.hostId===state.playerId;
      routeRoom(prev,state.room);
    },error=>{ console.error(error); toast('Accès Firebase refusé : vérifiez les règles'); });
  }

  /* ─── ROUTING ─── */
  function routeRoom(prev,room){
    if(room.phase==='lobby'){ renderLobby(); showView('lobbyView'); return; }
    if(room.phase==='question'){
      if(!prev || prev.phase!=='question' || prev.questionIndex!==room.questionIndex || prev.round!==room.round){ renderQuestion(); }
      updateScore(); checkAllAnswered();
      return;
    }
    if(room.phase==='results'){
      if(!prev || prev.phase!=='results' || prev.questionIndex!==room.questionIndex) renderResults();
      return;
    }
    if(room.phase==='finalists' && (!prev || prev.phase!=='finalists')) announceFinalists();
    if(room.phase==='champion' && (!prev || prev.phase!=='champion')) announceChampion();
  }

  function renderLobby(){
    els.roomCodeLabel.textContent=state.roomCode;
    const topics = (state.room.topics||[state.room.topic]).map(topicName).join(', ');
    els.roomMeta.textContent=`${topics} · ${state.room.duration} secondes par question`;
    els.playersList.innerHTML='';
    Object.entries(state.room.players||{}).forEach(([id,p])=>{
      els.playersList.insertAdjacentHTML('beforeend',`<div class="player-row"><span><span class="player-badge"></span> ${escapeHtml(p.name)} ${id===state.room.hostId?'👑':''}</span><strong>${p.score||0}</strong></div>`);
    });
    els.startGameBtn.classList.toggle('hidden',!state.isHost);
    els.waitingText.classList.toggle('hidden',state.isHost);
  }

  /* ─── LANCER PARTIE ─── */
  els.startGameBtn.addEventListener('click',async()=>{
    const players=Object.keys(state.room.players||{});
    if(players.length<2 && !state.localMode) return toast('Il faut au moins deux joueurs');
    if(state.localMode && players.length<2){ state.room.players.bot={name:'Joueur démo',score:0,connected:true,stats:{correctCount:0,totalTime:0,totalAnswered:0,maxStreak:0,lightningCount:0}}; }

    // Reset scores pour manche 1 et stats
    const updates = {round:1,questionIndex:0,phase:'question',finalists:null,answers:null,resultRanking:null,questionStartedAt:Date.now(),questionEndAt:Date.now()+state.room.duration*1000,usedQuestionIds:{}};
    Object.keys(state.room.players).forEach(pid=>{
      updates[`players/${pid}/score`]=0;
      updates[`players/${pid}/streak`]=0;
    });

    const topics = state.room.topics || [state.room.topic];
    const questions = distributeQuestions(topics, 10, true);
    // Marquer les questions comme utilisées
    const usedIds = {};
    questions.forEach(q=>{ if(q.uid) usedIds[q.uid]=true; });
    updates.questions = questions;
    updates.usedQuestionIds = usedIds;

    await patchRoom(updates);
    presenterSay('welcome');
  });

  async function patchRoom(data){
    if(state.localMode){ Object.assign(state.room,data); routeRoom(null,state.room); }
    else await state.db.ref(`rooms/${state.roomCode}`).update(data);
  }

  function currentQuestion(){ return state.room.questions?.[state.room.questionIndex]; }
  function eligiblePlayers(){
    const ids=Object.keys(state.room.players||{});
    return state.room.round===2 || state.room.round===3 ? ids.filter(id=>(state.room.finalists||[]).includes(id)) : ids;
  }

  /* ─── QUESTION ─── */
  function renderQuestion(){
    showView('gameView'); const q=currentQuestion(); if(!q) return;
    stop(els.audioTimeEnd); play(els.audioAmbient,false); stop(els.audioTick); play(els.audioTick,false);
    els.roundLabel.textContent=state.room.round===1?'MANCHE 1':state.room.round===2?'FINALE':'QUESTION DÉCISIVE';
    const total=state.room.round===1?10:state.room.round===2?6:1;
    els.questionCounter.textContent=`Question ${state.room.questionIndex+1} / ${total}`;
    els.questionText.textContent=q.text;
    els.answersText.innerHTML=q.choices.map((c,i)=>`<div class="answer-line"><strong>${'ABCD'[i]}</strong>${escapeHtml(c)}</div>`).join('');
    els.multiplierBanner.textContent=q.multiplier===3?'QUESTION TRIPLE ×3':q.multiplier===2?'QUESTION DOUBLE ×2':'BARÈME NORMAL ×1';
    els.multiplierBanner.className='multiplier-banner'+(q.multiplier===2?' double':q.multiplier===3?' triple':'');
    $$('.buzzer-btn').forEach(b=>{b.disabled=false;b.classList.remove('selected')});
    els.answerStatus.textContent='Choisissez une réponse.';
    updateScore(); startTimer();

    if(q.multiplier===2) presenterSay('double');
    if(q.multiplier===3) presenterSay('triple');
  }

  function startTimer(){
    clearInterval(state.currentTimer);
    const duration=state.room.duration;
    const tick=()=>{
      const remaining=Math.max(0,(state.room.questionEndAt-Date.now())/1000);
      els.timerText.textContent=Math.ceil(remaining);
      const pct=Math.max(0,remaining/duration*100);
      els.timerRing.style.background=`conic-gradient(var(--accent2) ${pct}%,#26334d 0)`;
      if(remaining<=0){ clearInterval(state.currentTimer); stop(els.audioTick); play(els.audioTimeEnd); $$('.buzzer-btn').forEach(b=>b.disabled=true); if(state.isHost) finalizeQuestion(); }
    };
    tick(); state.currentTimer=setInterval(tick,200);
  }

  /* ─── RÉPONSE ─── */
  els.buzzers.addEventListener('click',async e=>{
    const btn=e.target.closest('.buzzer-btn'); if(!btn||btn.disabled) return;
    if(!eligiblePlayers().includes(state.playerId)) return toast('Vous êtes spectateur de cette manche');
    const choice=+btn.dataset.choice;
    $$('.buzzer-btn').forEach(b=>b.disabled=true); btn.classList.add('selected');
    els.answerStatus.textContent='Réponse enregistrée'; play(els.audioBuzz);
    const answer={choice,submittedAt:Date.now()};
    if(state.localMode){
      state.room.answers=state.room.answers||{};
      state.room.answers[state.playerId]=answer;
      setTimeout(()=>{
        state.room.answers.bot={choice:Math.floor(Math.random()*4),submittedAt:Date.now()+300};
        if(state.isHost) finalizeQuestion();
      },600);
    } else {
      await state.db.ref(`rooms/${state.roomCode}/answers/${state.playerId}`).set({...answer,submittedAt:firebase.database.ServerValue.TIMESTAMP});
    }
  });

  /* ─── PASSAGE AUTO SI TOUS ONT RÉPONDU ─── */
  function checkAllAnswered(){
    if(!state.isHost || state.room.phase!=='question') return;
    const eligible = eligiblePlayers();
    const answers = state.room.answers||{};
    const allAnswered = eligible.every(id=>answers[id]);
    if(allAnswered && eligible.length>0){
      // Réduire le timer pour passer vite
      const now = Date.now();
      if(state.room.questionEndAt > now + 2000){
        patchRoom({questionEndAt: now + 1500});
      }
    }
  }

  /* ─── FINALISER QUESTION ─── */
  async function finalizeQuestion(){
    if(state.room.phase!=='question') return;
    clearInterval(state.currentTimer); stop(els.audioTick);
    if(!state.localMode){ const snap=await state.db.ref(`rooms/${state.roomCode}`).once('value'); state.room=snap.val(); }
    const q=currentQuestion(), answers=state.room.answers||{}, players=state.room.players||{}, started=state.room.questionStartedAt, duration=state.room.duration*1000;

    const ranking=eligiblePlayers().map(id=>{
      const a=answers[id];
      const correct=!!a&&a.choice===q.correct;
      const elapsed=a?Math.max(0,a.submittedAt-started):duration;
      const points=correct?Math.round((1000+500*Math.max(0,1-elapsed/duration))*q.multiplier):0;
      return {id,name:players[id].name,correct,elapsed,points};
    }).sort((a,b)=>b.correct-a.correct || a.elapsed-b.elapsed);

    // Stats
    const updates={phase:'results',resultRanking:ranking};
    ranking.forEach(r=>{
      const pid=r.id;
      const p=players[pid];
      const newScore=(p.score||0)+r.points;
      updates[`players/${pid}/score`]=newScore;
      // Stats individuelles
      const stats = p.stats||{correctCount:0,totalTime:0,totalAnswered:0,maxStreak:0,lightningCount:0};
      stats.totalAnswered = (stats.totalAnswered||0)+1;
      if(r.correct){
        stats.correctCount = (stats.correctCount||0)+1;
        stats.totalTime = (stats.totalTime||0)+r.elapsed;
        const streak = (p.streak||0)+1;
        updates[`players/${pid}/streak`]=streak;
        if(streak > (stats.maxStreak||0)) stats.maxStreak=streak;
        if(r.elapsed<1000) stats.lightningCount=(stats.lightningCount||0)+1;
      } else {
        updates[`players/${pid}/streak`]=0;
      }
      updates[`players/${pid}/stats`]=stats;
    });

    if(state.localMode){
      ranking.forEach(r=>{
        state.room.players[r.id].score=updates[`players/${r.id}/score`];
        state.room.players[r.id].streak=updates[`players/${r.id}/streak`];
        state.room.players[r.id].stats=updates[`players/${r.id}/stats`];
      });
      Object.assign(state.room,{phase:'results',resultRanking:ranking});
      routeRoom(null,state.room);
    } else {
      await state.db.ref(`rooms/${state.roomCode}`).update(updates);
    }
  }

  /* ─── RÉSULTATS ─── */
  function renderResults(){
    clearInterval(state.currentTimer); stop(els.audioTick); showView('resultsView');
    const q=currentQuestion();
    els.correctAnswerLabel.textContent=`Bonne réponse : ${'ABCD'[q.correct]} — ${q.choices[q.correct]}`;
    els.questionRanking.innerHTML=(state.room.resultRanking||[]).map((r,i)=>`<div class="rank-row ${r.correct?'correct':'wrong'}"><strong>${i+1}</strong><span>${escapeHtml(r.name)} ${r.correct?'✓':'✕'}</span><strong>+${r.points}</strong></div>`).join('');
    els.nextProgress.style.width='0'; requestAnimationFrame(()=>{els.nextProgress.style.transition='width 4s linear';els.nextProgress.style.width='100%'});
    if(state.isHost) setTimeout(advanceGame,4200);
  }

  /* ─── AVANCER JEU ─── */
  async function advanceGame(){
    const r=state.room.round, i=state.room.questionIndex;
    if((r===1&&i<9)||(r===2&&i<5)){
      return patchRoom({questionIndex:i+1,phase:'question',answers:null,resultRanking:null,questionStartedAt:Date.now(),questionEndAt:Date.now()+state.room.duration*1000});
    }
    if(r===1){
      const sorted=Object.entries(state.room.players).sort((a,b)=>(b[1].score||0)-(a[1].score||0));
      const finalists=sorted.slice(0,2).map(x=>x[0]);
      // Reset scores pour la finale
      const updates={phase:'finalists',finalists};
      finalists.forEach(pid=>{ updates[`players/${pid}/score`]=0; updates[`players/${pid}/streak`]=0; });
      await patchRoom(updates);
      if(state.isHost) setTimeout(()=>startFinal(),3500);
      return;
    }
    const finalists=state.room.finalists;
    const p=state.room.players;
    const s1=p[finalists[0]].score||0, s2=p[finalists[1]].score||0;
    if(s1===s2){
      const topics = state.room.topics || [state.room.topic];
      const usedIds = new Set(Object.keys(state.room.usedQuestionIds||{}));
      const questions = distributeQuestions(topics, 1, false, usedIds);
      const newUsed = {...state.room.usedQuestionIds};
      questions.forEach(q=>{ if(q.uid) newUsed[q.uid]=true; });
      return patchRoom({questions,round:3,questionIndex:0,phase:'question',answers:null,resultRanking:null,usedQuestionIds:newUsed,questionStartedAt:Date.now(),questionEndAt:Date.now()+state.room.duration*1000});
    }
    const champion=s1>s2?finalists[0]:finalists[1];
    await patchRoom({phase:'champion',champion});
  }

  function announceFinalists(){
    const [a,b]=state.room.finalists.map(id=>state.room.players[id].name);
    showModal('⚡','Les deux finalistes',`${a} affronte ${b} dans une finale de 6 questions.`);
    presenterSay('finalists',{a,b});
  }
  async function startFinal(){
    const topics = state.room.topics || [state.room.topic];
    const usedIds = new Set(Object.keys(state.room.usedQuestionIds||{}));
    const questions = distributeQuestions(topics, 6, false, usedIds);
    const newUsed = {...state.room.usedQuestionIds};
    questions.forEach(q=>{ if(q.uid) newUsed[q.uid]=true; });
    await patchRoom({questions,round:2,questionIndex:0,phase:'question',answers:null,resultRanking:null,usedQuestionIds:newUsed,questionStartedAt:Date.now(),questionEndAt:Date.now()+state.room.duration*1000});
  }

  /* ─── CHAMPION ─── */
  function announceChampion(){
    const championId = state.room.champion;
    const champion = state.room.players[championId];
    const name = champion.name;

    stop(els.audioAmbient);

    // Dark screen transition
    const dark = document.createElement('div');
    dark.className='dark-screen';
    dark.innerHTML='<div class="dark-screen-text">Toutes les lumières s'éteignent...</div>';
    document.body.appendChild(dark);

    setTimeout(()=>{
      dark.querySelector('.dark-screen-text').textContent = 'Silence...';
    },2000);

    setTimeout(()=>{
      dark.classList.add('fade-out');
      setTimeout(()=>dark.remove(),1500);
      showFinalScreen(championId);
    },4000);
  }

  function showFinalScreen(championId){
    showView('finalView');
    const champion = state.room.players[championId];
    const name = champion.name;
    const stats = champion.stats||{correctCount:0,totalTime:0,totalAnswered:0,maxStreak:0,lightningCount:0};
    const avgTime = stats.totalAnswered>0 ? (stats.totalTime/stats.totalAnswered/1000).toFixed(1).replace('.',',') : '0,0';

    els.championName.textContent = name;
    els.spotlightOverlay.classList.add('active');

    // Badges
    const badges = [];
    if((stats.maxStreak||0)>=5) badges.push({cls:'fire',text:'🔥 Série de 5+'});
    if((stats.lightningCount||0)>0) badges.push({cls:'lightning',text:`⚡ Éclair ×${stats.lightningCount}`});
    if(stats.totalAnswered>0 && stats.correctCount===stats.totalAnswered) badges.push({cls:'crown',text:'🎯 Sans faute'});
    badges.push({cls:'crown',text:'👑 Champion'});
    els.finalBadges.innerHTML = badges.map(b=>`<span class="badge ${b.cls}">${b.text}</span>`).join('');

    // Stats
    els.finalStats.innerHTML = `
      <div class="stat-box"><strong>${stats.correctCount}</strong><span>Bonnes réponses</span></div>
      <div class="stat-box"><strong>${avgTime}s</strong><span>Temps moyen</span></div>
      <div class="stat-box"><strong>${stats.maxStreak||0}</strong><span>Meilleure série</span></div>
      <div class="stat-box"><strong>${champion.score||0}</strong><span>Score final</span></div>
    `;

    // Classement final
    const allPlayers = Object.entries(state.room.players).sort((a,b)=>(b[1].score||0)-(a[1].score||0));
    els.finalRanking.innerHTML = '<h3>🏅 Classement final</h3>' + allPlayers.map(([id,p],i)=>`
      <div class="final-rank-row"><span class="rank-num">${i+1}</span><span class="rank-name">${escapeHtml(p.name)} ${id===championId?'👑':''}</span><span class="rank-score">${p.score||0}</span></div>
    `).join('');

    // Analyse & closing
    els.presenterClosing.innerHTML = `
      <p>« ${name} remporte cette partie avec ${stats.correctCount} bonnes réponses et un temps moyen de ${avgTime} seconde. Une performance exceptionnelle ! »</p>
      <p>« Merci d'avoir joué à BuzzArena. À très bientôt pour une nouvelle compétition ! »</p>
    `;

    // Animations
    setTimeout(()=>{ play(els.audioDrumroll); presenterSay('drumroll',{},true); },500);
    setTimeout(()=>{
      play(els.audioVictory);
      presenterSay('champion',{name},true);
      launchConfetti(); launchFireworks();
      els.trophyIcon.style.display='block';
    },3500);
    setTimeout(()=>{
      presenterSay('analysis',{name,correct:stats.correctCount,avgTime});
    },7000);
    setTimeout(()=>{
      presenterSay('closing');
    },12000);
  }

  function showModal(icon,title,text){ els.modalIcon.textContent=icon; els.modalTitle.textContent=title; els.modalText.textContent=text; els.modal.classList.remove('hidden'); }
  function updateScore(){ els.myScore.textContent=state.room?.players?.[state.playerId]?.score||0; }

  /* ─── RECONNEXION ─── */
  async function tryReconnect(){
    const saved = loadLocal();
    if(!saved || !saved.roomCode || !saved.playerName) return false;
    if(state.localMode) return false;

    const snap = await state.db.ref(`rooms/${saved.roomCode}`).once('value');
    if(!snap.exists()){ clearLocal(); return false; }

    const room = snap.val();
    state.playerId = saved.playerId;
    state.playerName = saved.playerName;
    state.roomCode = saved.roomCode;
    state.isHost = room.hostId === saved.playerId;

    // Mettre à jour connected
    await state.db.ref(`rooms/${saved.roomCode}/players/${saved.playerId}`).update({
      name: saved.playerName, connected: true, lastSeen: firebase.database.ServerValue.TIMESTAMP
    });
    subscribeRoom();
    toast('Reconnexion réussie !');
    return true;
  }

  /* ─── INIT ─── */
  await initBackend();.then(async()=>{
    // Charger préférences présentateur
    const savedPresenter = localStorage.getItem('buzzarena_presenter');
    if(savedPresenter){ state.presenterMode=savedPresenter; document.querySelector(`input[name="presenterMode"][value="${savedPresenter}"]`)?.click(); }

    // Essayer reconnexion
    const reconnected = await tryReconnect();
    if(!reconnected){
      const incoming = new URLSearchParams(location.search).get('room');
      if(incoming){ els.roomCodeInput.value=incoming.toUpperCase(); els.joinName.focus(); }
    }
  });
})();
