export default function scrollTop() {
  'use strict';

  function trackScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;
    if (scrolled > coords) {
      goTopBtn.classList.add('scroll-top--visible');
    }
    if (scrolled < coords) {
      goTopBtn.classList.remove('scroll-top--visible');
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(backToTop, 0);
    }
  }

  const goTopBtn = document.querySelector('.scroll-top');

  window.addEventListener('scroll', trackScroll);
  goTopBtn.addEventListener('click', backToTop);
}
