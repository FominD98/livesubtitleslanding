// Phone-width download bar on the Live Captions home page: hidden while the hero
// "Download" button is on screen, shown once the visitor has scrolled past it.
(function () {
    var cta = document.getElementById('hero-cta');
    var bar = document.querySelector('.stickybar');
    if (!bar) return;
    if (!cta || !('IntersectionObserver' in window)) { bar.classList.add('is-shown'); return; }
    new IntersectionObserver(function (entries) {
        bar.classList.toggle('is-shown', !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
    }).observe(cta);
})();
