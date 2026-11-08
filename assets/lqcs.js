/* 六親長生：僅切換附件原表，不重算表值。 */
(function () {
  var button = document.getElementById('lqcs-toggle');
  var panel = document.getElementById('lqcs-panel');
  if (!button || !panel) return;
  button.addEventListener('click', function () {
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
  });
})();
