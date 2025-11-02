// src/game.js (optimized render & event delegation; smooth level/size change)
var HP = window.HPData;
var LESSONS = HP.generateLessons(20);
var ENTRIES = HP.ENTRIES;
function pickPairsWrapper(n, lessonId){ return HP.pickPairs(n, lessonId, LESSONS); }

var qs = function(s){ return document.querySelector(s); };
var boardEl = qs('#board');
var lessonSel = qs('#lesson');
var sizeSel = qs('#size');
var newBtn = qs('#newGame');
var shuffleBtn = qs('#shuffle');
var hintBtn = qs('#hint');
var kidsCb = qs('#kids');
var voiceCb = qs('#voice');
var timerEl = qs('#timer');
var movesEl = qs('#moves');
var scoreEl = qs('#score');
var bestEl = qs('#best');
var pairsEl = qs('#pairs');

var rows = 4, cols = 4, lesson = lessonSel ? lessonSel.value : 'L1';
var tiles = []; // {type:'hanzi'|'pinyin', id:string, text:string, matched:boolean}
var selected = null; // index
var timerId = null; var startTs = 0;
var moves = 0; var score = 0; var voiceOn = false;

function parseSize(v){ var a=v.split('x'); return { r: parseInt(a[0],10), c: parseInt(a[1],10) }; }
function fmtTime(ms){ var s=Math.floor(ms/1000); var mm=('0'+Math.floor(s/60)).slice(-2); var ss=('0'+(s%60)).slice(-2); return mm+':'+ss; }
function keyBest(){ return 'pairs-best-'+lesson+'-'+rows+'x'+cols; }
function readBest(){ var v=localStorage.getItem(keyBest()); bestEl.textContent = v? fmtTime(parseInt(v,10)) : '--'; }
function writeBest(ms){ var k=keyBest(); var old=parseInt(localStorage.getItem(k)||'2147483647',10); if(ms<old) localStorage.setItem(k,String(ms)); readBest(); }

function startTimer(){ if(timerId) return; startTs=Date.now(); timerId=setInterval(function(){ timerEl.textContent=fmtTime(Date.now()-startTs); }, 250); }
function stopTimer(){ if(!timerId) return 0; clearInterval(timerId); timerId=null; var elapsed=Date.now()-startTs; timerEl.textContent=fmtTime(elapsed); return elapsed; }
function setHUD(){ movesEl.textContent=String(moves); scoreEl.textContent=String(score); }
function updatePairs(){ var matched = tiles.filter(function(x){return x.matched;}).length/2; var total = (rows*cols)/2; if(pairsEl) pairsEl.textContent = matched+'/'+total; }

function numericToTone(id){ var m=id.match(/^([a-z]+)([1-4])$/i); if(!m) return id; var base=m[1]; var tone=parseInt(m[2],10); var map={a:['a','ā','á','ǎ','à'],e:['e','ē','é','ě','è'],i:['i','ī','í','ǐ','ì'],o:['o','ō','ó','ǒ','ò'],u:['u','ū','ú','ǔ','ù'],v:['ü','ǖ','ǘ','ǚ','ǜ'],'ü':['ü','ǖ','ǘ','ǚ','ǜ']}; var pri=['a','o','e','i','u','v','ü']; var pos=-1; for(var ii=0;ii<pri.length;ii++){ var ch=pri[ii]; var k=base.indexOf(ch); if(k!==-1){ pos=k; break; } } if(pos===-1) return id; var ch2=base[pos]; var tbl=map[ch2]; if(!tbl) return id; base=base.slice(0,pos)+tbl[tone]+base.slice(pos+1); return base; }
function speak(text, lang){ if(lang===void 0) lang='zh-CN'; if(!voiceOn || !('speechSynthesis' in window)) return; var u=new SpeechSynthesisUtterance(text); u.lang=lang; u.rate=0.95; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }

function buildDeck(){ var total=rows*cols; if (total % 2 !== 0) throw new Error('Total tiles must be even'); var pairs = pickPairsWrapper(total/2, lesson); var deck=[]; for(var i=0;i<pairs.length;i++){ var p=pairs[i]; deck.push({ type:'hanzi', id:p.id, text:p.hanzi, matched:false }); deck.push({ type:'pinyin', id:p.id, text:p.id, matched:false }); } for(var j=deck.length-1;j>0;j--){ var r=Math.floor(Math.random()*(j+1)); var tmp=deck[j]; deck[j]=deck[r]; deck[r]=tmp; } return deck; }

function renderHTML(){
  var html='';
  for(var i=0;i<tiles.length;i++){
    var t=tiles[i];
    var cls='card';
    if(t.type==='pinyin') cls+=' pinyin';
    if(t.matched) cls+=' matched';
    if(selected===i) cls+=' selected';
    var inner;
    if(t.type==='pinyin'){
      inner = window.PinyinTone.pinyinToneMarkup(t.text);
    } else {
      inner = t.text;
    }
    html += '<button type="button" class="'+cls+'" data-index="'+i+'">'+inner+'</button>';
  }
  return html;
}

function render(){
  boardEl.style.setProperty('--cols', cols);
  boardEl.innerHTML = renderHTML();
}

function onCardClick(e){
  var btn = e.target.closest('.card');
  if(!btn || !boardEl.contains(btn)) return;
  var i = parseInt(btn.getAttribute('data-index'),10);
  var t = tiles[i]; if (t.matched) return;
  if (voiceOn){ if (t.type==='hanzi') speak(t.text,'zh-CN'); else speak(numericToTone(t.text),'zh-CN'); }
  if (selected==null){ selected=i; // toggle class only to avoid full render
    btn.classList.add('selected');
    return; }
  if (selected===i){ selected=null; btn.classList.remove('selected'); return; }
  var aIdx = selected; var bIdx = i; var a=tiles[aIdx]; var b=tiles[bIdx];
  selected=null; moves++; setHUD();
  var cards = boardEl.querySelectorAll('.card');
  // set checking (black)
  if(cards[aIdx]){ cards[aIdx].classList.remove('selected'); cards[aIdx].classList.add('checking'); }
  if(cards[bIdx]){ cards[bIdx].classList.add('checking'); }
  var isMatch = (a.id===b.id && a.type!==b.type);
  if (isMatch){
    if(cards[aIdx]){ cards[aIdx].classList.remove('checking'); cards[aIdx].classList.add('correct'); }
    if(cards[bIdx]){ cards[bIdx].classList.remove('checking'); cards[bIdx].classList.add('correct'); }
    setTimeout(function(){ a.matched=true; b.matched=true; score+=100; setHUD(); updatePairs(); render(); if (voiceOn){ var han=a.type==='hanzi'?a.text:b.text; var py=a.type==='pinyin'?a.text:b.text; speak(han+'，'+numericToTone(py),'zh-CN'); } if (tiles.every(function(x){return x.matched;})) { var elapsed=stopTimer(); writeBest(elapsed); showWin(elapsed); } }, 220);
  } else {
    if(cards[aIdx]){ cards[aIdx].classList.remove('checking'); cards[aIdx].classList.add('wrong'); }
    if(cards[bIdx]){ cards[bIdx].classList.remove('checking'); cards[bIdx].classList.add('wrong'); }
    setTimeout(function(){ if(cards[aIdx]) cards[aIdx].classList.remove('wrong'); if(cards[bIdx]) cards[bIdx].classList.remove('wrong'); }, 420);
  }
}

function starRating(ms){ var base = rows*cols; var t3 = base * 900; var t2 = base * 1200; if (ms <= t3) return 3; if (ms <= t2) return 2; return 1; }
function reshuffle(){ var idxs=[]; var pool=[]; for(var i=0;i<tiles.length;i++){ var t=tiles[i]; if(!t.matched){ idxs.push(i); pool.push(t); } } for(var j=pool.length-1;j>0;j--){ var r=Math.floor(Math.random()*(j+1)); var tmp=pool[j]; pool[j]=pool[r]; pool[r]=tmp; } for(var k=0;k<idxs.length;k++){ tiles[idxs[k]]=pool[k]; } render(); }
function hint(){ var seen={}; for(var i=0;i<tiles.length;i++){ var t=tiles[i]; if(t.matched) continue; var other = seen[t.id]; if (other!=null && tiles[other].type!==t.type){ highlight([other, i]); return; } if (other==null) seen[t.id]=i; } }
function highlight(indices){ var cards = Array.prototype.slice.call(boardEl.querySelectorAll('.card')); for(var i=0;i<indices.length;i++){ var idx=indices[i]; if(cards[idx]) cards[idx].classList.add('hint'); } setTimeout(function(){ for(var i=0;i<indices.length;i++){ var idx=indices[i]; if(cards[idx]) cards[idx].classList.remove('hint'); } }, 600); }

function showWin(ms){ var modal = document.getElementById('winModal'); if(!modal){ alert('本关完成！\n用时 '+fmtTime(ms)+'，步数 '+moves+'，得分 '+score); return; } var stars = starRating(ms); modal.querySelector('#winStats').textContent = '用时 '+fmtTime(ms)+'，步数 '+moves+'，得分 '+score; modal.querySelector('#winStars').textContent = Array(stars+1).join('★') + Array(3-stars+1).join('☆'); modal.classList.remove('hidden'); var btnRetry = document.getElementById('btnRetry'); var btnNext = document.getElementById('btnNext'); var btnClose = document.getElementById('btnClose'); var hide = function(){ modal.classList.add('hidden'); }; btnRetry.onclick = function(){ hide(); newGame(); }; btnClose.onclick = hide; btnNext.onclick = function(){ hide(); var keys = Object.keys(LESSONS); var idx = keys.indexOf(lesson); var next = keys[Math.min(idx+1, keys.length-1)]; if (next !== lesson) { lesson = next; var sel = document.getElementById('lesson'); if (sel) sel.value = lesson; } newGame(); } }

function newGame(){
  tiles = buildDeck(); moves=0; score=0; selected=null; setHUD(); updatePairs(); readBest(); timerEl.textContent='00:00'; stopTimer(); startTimer();
  // build HTML once then inject to avoid per-node listener cost
  boardEl.style.setProperty('--cols', cols);
  boardEl.innerHTML = renderHTML();
}

sizeSel.addEventListener('change', function(){ var s=parseSize(sizeSel.value); rows=s.r; cols=s.c; // schedule to next frame for smoother UI
  requestAnimationFrame(newGame);
});
lessonSel.addEventListener('change', function(){ lesson=lessonSel.value; requestAnimationFrame(newGame); });
newBtn.addEventListener('click', function(){ requestAnimationFrame(newGame); });
shuffleBtn.addEventListener('click', reshuffle);
hintBtn.addEventListener('click', hint);
boardEl.addEventListener('click', onCardClick);
if (kidsCb){ document.body.classList.toggle('kids', kidsCb.checked); kidsCb.addEventListener('change', function(){ document.body.classList.toggle('kids', kidsCb.checked); }); }
if (voiceCb){ voiceOn = voiceCb.checked; voiceCb.addEventListener('change', function(){ voiceOn = voiceCb.checked; }); }

(function init(){ var s=parseSize(sizeSel.value); rows=s.r; cols=s.c; lesson=lessonSel.value; newGame(); })();


