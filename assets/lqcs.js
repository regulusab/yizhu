/* 六親長生：僅切換附件原表與白話解讀，不重算表值。 */
(function () {
  var button = document.getElementById('lqcs-toggle');
  var panel = document.getElementById('lqcs-panel');
  if (!button || !panel) return;
  button.addEventListener('click', function () {
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
  });
  /* 列印時展開「怎麼讀這兩張表」，印完還原。 */
  var intro = panel.querySelector('details.lqcs-intro'), was = null;
  if (intro) {
    window.addEventListener('beforeprint', function () { was = intro.open; intro.open = true; });
    window.addEventListener('afterprint', function () { if (was !== null) intro.open = was; was = null; });
  }

  /* 陸致極表：橫排／豎排切換；選擇存本機，各柱共用。 */
  var KEY = 'yizhu-lqcs-lu-orient';
  var orient = document.getElementById('lqcs-lu-orient');
  var table = document.getElementById('lqcs-lu-table');
  if (!orient || !table) return;
  var src = [], trs = table.querySelectorAll('tr'), i;
  for (i = 0; i < trs.length; i++) {
    src.push(Array.prototype.map.call(trs[i].children, function (c) { return c.cloneNode(true); }));
  }
  function render(shu) {
    var cap = table.querySelector('caption');
    table.innerHTML = '';
    if (cap) table.appendChild(cap);
    table.classList.toggle('lqcs-shu', shu);
    var tr, tbody, j;
    if (!shu) {
      var thead = document.createElement('thead');
      tr = document.createElement('tr');
      for (j = 0; j < src[0].length; j++) {
        var cell = src[0][j].cloneNode(true);
        cell.setAttribute('scope', 'col');
        tr.appendChild(cell);
      }
      thead.appendChild(tr);
      tbody = document.createElement('tbody');
      tr = document.createElement('tr');
      for (j = 0; j < src[1].length; j++) tr.appendChild(src[1][j].cloneNode(true));
      tbody.appendChild(tr);
      table.appendChild(thead);
      table.appendChild(tbody);
    } else {
      tbody = document.createElement('tbody');
      for (j = 0; j < src[0].length; j++) {
        tr = document.createElement('tr');
        var th = src[0][j].cloneNode(true);
        th.setAttribute('scope', 'row');
        tr.appendChild(th);
        tr.appendChild(src[1][j].cloneNode(true));
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
    }
    orient.setAttribute('aria-pressed', String(shu));
    orient.setAttribute('aria-label', shu ? '切換為橫排' : '切換為豎排');
    orient.textContent = shu ? '橫排' : '豎排';
  }
  function saved() {
    try { return localStorage.getItem(KEY) === 'shu'; } catch (e) { return false; }
  }
  function persist(shu) {
    try { localStorage.setItem(KEY, shu ? 'shu' : 'heng'); } catch (e) {}
  }
  var shu = saved();
  if (shu) render(true);
  orient.addEventListener('click', function () {
    shu = !shu;
    render(shu);
    persist(shu);
  });
})();
