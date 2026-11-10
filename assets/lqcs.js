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
  if (!intro) return;
  window.addEventListener('beforeprint', function () { was = intro.open; intro.open = true; });
  window.addEventListener('afterprint', function () { if (was !== null) intro.open = was; was = null; });
})();
