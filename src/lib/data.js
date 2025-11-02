(function(global){
  var ENTRIES = window.HPData && window.HPData.ENTRIES ? window.HPData.ENTRIES : [
    { id: 'ma1', hanzi: '妈' }, { id: 'ma2', hanzi: '麻' }, { id: 'ma3', hanzi: '马' }, { id: 'ma4', hanzi: '骂' },
    { id: 'mi1', hanzi: '咪' }, { id: 'mi2', hanzi: '迷' }, { id: 'mi3', hanzi: '米' }, { id: 'mi4', hanzi: '蜜' },
    { id: 'ba1', hanzi: '八' }, { id: 'ba2', hanzi: '拔' }, { id: 'ba3', hanzi: '把' }, { id: 'ba4', hanzi: '爸' },
    { id: 'bi2', hanzi: '鼻' }, { id: 'bi3', hanzi: '笔' }, { id: 'bi4', hanzi: '必' },
    { id: 'la1', hanzi: '拉' }, { id: 'la3', hanzi: '喇' }, { id: 'la4', hanzi: '辣' },
    { id: 'li2', hanzi: '梨' }, { id: 'li3', hanzi: '里' }, { id: 'li4', hanzi: '利' },
    { id: 'lu1', hanzi: '噜' }, { id: 'lu2', hanzi: '卢' }, { id: 'lu3', hanzi: '鲁' }, { id: 'lu4', hanzi: '路' }
  ];
  function byId(id){ for (var i=0;i<ENTRIES.length;i++){ if(ENTRIES[i].id===id) return ENTRIES[i]; } return null; }
  function pickN(arr, n){ var a=arr.slice(); var out=[]; while(out.length<n && a.length){ var i=Math.floor(Math.random()*a.length); out.push(a.splice(i,1)[0]); } return out; }
  function generateLessons(count){
    var ids = ENTRIES.map(function(x){return x.id});
    var res = {};
    for (var i=1;i<=count;i++){
      var picked = pickN(ids, Math.min(20, ids.length));
      res['L'+i] = { name: '第'+i+'关', ids: picked };
    }
    return res;
  }
  function pickPairs(n, lessonId, lessons){
    var ls = lessons && lessons[lessonId];
    var poolIds = ls ? ls.ids.slice() : ENTRIES.map(function(x){return x.id});
    var pool = poolIds.map(byId).filter(Boolean);
    var res = [];
    while (res.length < n){
      if (pool.length === 0) { pool = poolIds.map(byId).filter(Boolean); }
      var i = Math.floor(Math.random()*pool.length);
      var pick = pool.splice(i,1)[0];
      if (!res.some(function(x){return x.id===pick.id;})) res.push(pick);
    }
    return res;
  }
  global.HPData = { ENTRIES: ENTRIES, byId: byId, generateLessons: generateLessons, pickPairs: pickPairs };
})(window);
