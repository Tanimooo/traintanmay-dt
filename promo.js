/* What's new video: pops up once per visit when the start screen opens. Close it with ×, Esc or a tap outside it.
   Phones and other tall screens get the vertical cut. "Don't show again" turns it off on this device.
   It starts muted (browsers block sound until you tap); on data saver or reduced motion it waits for you to press play. */
(function () {
  if (window.top !== window || location.hash.length > 1) return;
  var OFF = 'tt-promo-off', SEEN = 'tt-promo-seen';
  function store(kind) { try { var s = window[kind]; s.getItem('x'); return s; } catch (e) { return null; } }
  var ls = store('localStorage'), ss = store('sessionStorage');
  try { if ((ls && ls.getItem(OFF)) || (ss && ss.getItem(SEEN))) return; } catch (e) { return; }

  var tall = window.matchMedia && matchMedia('(max-aspect-ratio: 1/1)').matches;
  var calm = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || (navigator.connection && navigator.connection.saveData);
  var src = 'promo/ad-' + (tall ? 'tall' : 'wide');

  var css = document.createElement('style');
  css.textContent =
    '.ttp-back{position:fixed;inset:0;z-index:100003;display:grid;place-items:center;padding:16px;background:rgba(7,5,26,.9);animation:ttpF .25s ease both}' +
    '@keyframes ttpF{from{opacity:0}}@keyframes ttpU{from{opacity:0;transform:translateY(16px) scale(.97)}}' +
    '.ttp{position:relative;display:flex;flex-direction:column;gap:10px;animation:ttpU .35s cubic-bezier(.2,.9,.25,1.15) both}' +
    '.ttp video{display:block;border-radius:18px;background:#0e0b22;border:3px solid #07051a;box-shadow:0 30px 80px -20px rgba(0,0,0,.8);max-width:calc(100vw - 32px)}' +
    '.ttp.wide video{width:min(960px,calc(100vw - 32px));aspect-ratio:16/9;max-height:calc(100vh - 110px)}' +
    '.ttp.tall video{height:min(calc(100vh - 110px),900px);aspect-ratio:9/16}' +
    '.ttp .bar{display:flex;justify-content:space-between;align-items:center;gap:10px;font:500 14px "IBM Plex Sans",system-ui,sans-serif;color:#d9d4f0}' +
    '.ttp .bar button{font:inherit;cursor:pointer;border:0;background:none;color:inherit;padding:8px 4px;text-decoration:underline;text-underline-offset:3px}' +
    '.ttp .x{position:absolute;top:-14px;right:-14px;width:44px;height:44px;border-radius:50%;border:3px solid #07051a;background:#f6f1e7;color:#07051a;font:700 26px/1 system-ui,sans-serif;cursor:pointer;box-shadow:3px 3px 0 #07051a;display:grid;place-items:center;padding:0 0 3px}' +
    '.ttp .snd{position:absolute;left:12px;top:12px;border:2px solid #07051a;border-radius:999px;background:#ffc917;color:#07051a;font:700 14px "IBM Plex Sans",system-ui,sans-serif;padding:7px 14px;cursor:pointer;box-shadow:2px 2px 0 #07051a}' +
    '.ttp .x:focus-visible,.ttp .snd:focus-visible,.ttp .bar button:focus-visible{outline:3px solid #ffc917;outline-offset:3px}' +
    '@media (max-width:520px){.ttp .x{top:6px;right:6px}}' +
    'html.ttp-on .tts-nudge{visibility:hidden}'; // the sign-in card waits until the video is closed

  function show() {
    try { ss && ss.setItem(SEEN, '1'); } catch (e) {}
    document.head.appendChild(css);
    var back = document.createElement('div'); back.className = 'ttp-back';
    back.innerHTML = '<div class="ttp ' + (tall ? 'tall' : 'wide') + '" role="dialog" aria-modal="true" aria-label="What\'s new in TrainTanmay">' +
      '<video playsinline controls preload="' + (calm ? 'none' : 'auto') + '" poster="' + src + '.jpg"' + (calm ? '' : ' autoplay muted') + '>' +
      '<source src="' + src + '.mp4" type="video/mp4"></video>' +
      (calm ? '' : '<button class="snd" type="button">🔊 Tap for sound</button>') +
      '<button class="x" type="button" aria-label="Close video">&times;</button>' +
      '<div class="bar"><span>New: Chemistry, Google sign-in and study leagues</span><button type="button" class="off">Don\'t show again</button></div></div>';
    document.body.appendChild(back); document.documentElement.classList.add('ttp-on');
    var box = back.firstChild, v = box.querySelector('video'), last = document.activeElement;
    function close() {
      v.pause(); back.remove(); document.documentElement.classList.remove('ttp-on'); document.removeEventListener('keydown', key, true);
      if (last && last.focus) last.focus();
    }
    function key(e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      if (e.key === 'Tab') { // keep focus inside the pop-up
        var f = [].filter.call(box.querySelectorAll('button,video'), function (x) { return x.offsetParent !== null; });
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }
    document.addEventListener('keydown', key, true);
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    box.querySelector('.x').onclick = close;
    box.querySelector('.off').onclick = function () { try { ls && ls.setItem(OFF, '1'); } catch (e) {} close(); };
    var snd = box.querySelector('.snd');
    if (snd) {
      var unmute = function () { v.muted = false; v.volume = 1; if (v.paused) v.play().catch(function () {}); snd.remove(); };
      snd.onclick = unmute;
      v.addEventListener('volumechange', function () { if (!v.muted && snd.isConnected) snd.remove(); });
    }
    box.querySelector('.x').focus();
  }
  if (document.readyState === 'complete') setTimeout(show, 600);
  else window.addEventListener('load', function () { setTimeout(show, 600); });
})();
