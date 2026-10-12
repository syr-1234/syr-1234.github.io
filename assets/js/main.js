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
