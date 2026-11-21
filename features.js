/* TrainTanmay feature switches: turn optional bits of the site on or off in one place.
   Change a value, save, and push. Every page loads this file before anything else.

   revisedesk  Links to revisedesk.com ("Plan your revision") on the start screen, in the
               subject rail and logo menu, and in jump search. Set to true to bring them back. */
window.TT_FEATURES = {
  revisedesk: false
};

/* anything marked data-feature="name" in a page is hidden while that feature is off */
(function () {
  var off = Object.keys(window.TT_FEATURES).filter(function (k) { return !window.TT_FEATURES[k]; });
  if (!off.length) return;
  var s = document.createElement('style');
  s.textContent = off.map(function (k) { return '[data-feature="' + k + '"]'; }).join(',') + '{display:none!important}';
  document.head.appendChild(s);
})();
window.ttFeature = function (k) { return !!(window.TT_FEATURES && window.TT_FEATURES[k]); };
