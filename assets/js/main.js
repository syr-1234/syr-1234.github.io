// Cursor-following preview on the home page work list.
// Each row link can carry data-peek="assets/img/xxx.jpg".
// Rows without an image simply show no preview.
(function () {
  const peek = document.querySelector('.peek');
  if (!peek || !window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.row a[data-peek]').forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      peek.style.backgroundImage = 'url("' + link.dataset.peek + '")';
      peek.classList.add('on');
    });
    link.addEventListener('mouseleave', function () { peek.classList.remove('on'); });
  });

  window.addEventListener('mousemove', function (e) {
    const x = Math.min(e.clientX + 24, window.innerWidth - 324);
    const y = Math.min(e.clientY + 24, window.innerHeight - 250);
    peek.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  });
})();

// Two-view switch (Emotional Dialectics): buttons swap the image; it also
// alternates on its own until the viewer clicks, unless reduced motion is set.
(function () {
  document.querySelectorAll('.viewswitch').forEach(function (box) {
    var imgs = box.querySelectorAll('.vs-stage img');
    var btns = box.querySelectorAll('.vs-buttons button');
    var current = 0, timer = null;
    function show(i) {
      current = i;
      imgs.forEach(function (im, k) { im.hidden = k !== i; });
      btns.forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', k === i); });
    }
    btns.forEach(function (b, k) {
      b.addEventListener('click', function () { if (timer) { clearInterval(timer); timer = null; } show(k); });
    });
    show(0);
    var ms = parseInt(box.dataset.auto, 10);
    if (ms && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(function () { show((current + 1) % imgs.length); }, ms);
    }
  });
})();

// Video cover: the YouTube player loads only when the viewer clicks play.
(function () {
  document.querySelectorAll('.yt[data-yt]').forEach(function (box) {
    var btn = box.querySelector('.yt-play');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + box.dataset.yt + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('aria-label').replace('Play the film ', '');
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allowFullscreen = true;
      box.replaceChild(f, btn);
    });
  });
})();
