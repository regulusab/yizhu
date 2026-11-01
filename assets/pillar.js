(function(){
  var q = new URLSearchParams(location.search), h = q.get('h'), m = q.get('m'), info = q.get('p');
  var hash = decodeURIComponent(location.hash || '');
  if (!h && /^#hour-/.test(hash)) h = hash.slice(6);
  var target = null;
  var mEl = null;
  if (m) { mEl = document.getElementById('month-' + m); if (mEl) { if (mEl.classList.contains('anc')) mEl = mEl.closest('section') || mEl; mEl.classList.add('you-hit'); } }
  if (h) { var d = document.getElementById('hour-' + h); if (d) { d.open = true; d.classList.add('you-hit'); target = d; } }
  if (info) {
    var y = document.getElementById('you');
    var t = '您的四柱：' + info.replace(/[^甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥 ]/g, '');
    if (h) t += '｜已展開「' + h + '時」段';
    if (m) t += '｜生於' + m + '月（以節為界）' + (document.getElementById('month-' + m) ? '，已標示該月段落' : '，請參看「各月份出生論斷」');
    y.textContent = t; y.hidden = false;
  }
  if (!target) target = mEl;
  if (target) setTimeout(function(){ target.scrollIntoView({block:'start'}); }, 60);
})();
