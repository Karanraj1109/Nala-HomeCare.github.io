(() => {
  'use strict';

  const body = document.body;
  const splash = document.getElementById('splash-screen');
  const enterButton = document.getElementById('btn-masuk');
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const desktopLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const mobileLinks = [...document.querySelectorAll('.mobile-menu a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeSplash = () => {
    if (!splash || splash.classList.contains('is-hidden')) return;
    splash.classList.add('is-hidden');
    body.classList.remove('splash-locked');
    window.setTimeout(() => splash.remove(), 850);
  };

  if (splash) {
    body.classList.add('splash-locked');
    enterButton?.addEventListener('click', closeSplash);
    window.setTimeout(closeSplash, 4200);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') closeSplash();
    }, { once: true });
  }

  const setScrolled = () => navbar?.classList.toggle('scrolled', window.scrollY > 30);
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });

  const setMenu = (open) => {
    hamburger?.classList.toggle('open', open);
    mobileMenu?.classList.toggle('open', open);
    hamburger?.setAttribute('aria-expanded', String(open));
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('menu-open', open);
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    setMenu(!isOpen);
  });
  mobileLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setMenu(false);
  });

  const revealElements = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  const updateActiveLink = () => {
    const marker = window.scrollY + 180;
    let activeId = sections[0]?.id || 'beranda';
    sections.forEach(section => {
      if (section.offsetTop <= marker) activeId = section.id;
    });
    desktopLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
  };
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();
