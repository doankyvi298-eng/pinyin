// src/lib/tone.js (global helpers for tone overlay)
(function(global){
  function mainVowelIndex(base){ var pri=['a','o','e','i','u','v','ü']; for(var i=0;i<pri.length;i++){ var ch=pri[i]; var k=base.indexOf(ch); if(k!==-1) return k; } return -1; }
  function pinyinToneMarkup(id){ var m=id.match(/^([a-züv]+)([1-4])$/i); if(!m){ return id; } var base=m[1]; var tone=parseInt(m[2],10); var idx=mainVowelIndex(base); if(idx===-1) return base; var letters=base.split(''); var markMap={1:'\u02C9',2:'\u02CA',3:'\u02C7',4:'\u02CB'}; letters[idx] = '<span class="tone-letter has-tone"><span class="tone-mark t'+tone+'">'+markMap[tone]+'</span>'+letters[idx]+'</span>'; for(var i=0;i<letters.length;i++){ if(i!==idx) letters[i] = '<span class="tone-letter">'+letters[i]+'</span>'; } return '<span class="tone-wrap">'+letters.join('')+'</span>'; }
  global.PinyinTone = { pinyinToneMarkup: pinyinToneMarkup };
})(window);