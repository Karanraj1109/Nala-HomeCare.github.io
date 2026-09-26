(() => {
    'use strict';

    const body = document.body;
    const splash = document.getElementById('splash-screen');
    const splashButton = document.getElementById('btn-masuk');
    const nav = document.querySelector('.site-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const progress = document.getElementById('scroll-progress');
    const desktopLinks = [...document.querySelectorAll('.nav-links a')];
    const mobileLinks = [...document.querySelectorAll('.mobile-nav-links a')];
    const allNavLinks = [...desktopLinks, ...mobileLinks];
    const sections = desktopLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    let scrollTicking = false;
    let lastScrollY = window.scrollY;
    let splashClosed = false;

    const updateScrollUI = () => {
        const scrollY = window.scrollY;
        const doc = document.documentElement;
        const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
        if (progress) progress.style.width = `${Math.min((scrollY / maxScroll) * 100, 100)}%`;
        nav?.classList.toggle('is-scrolled', scrollY > 24);

        if (window.innerWidth > 1080) {
            const delta = scrollY - lastScrollY;
            if (scrollY > 160 && delta > 5) nav?.classList.add('nav-hidden');
            if (delta < -5 || scrollY < 80) nav?.classList.remove('nav-hidden');
        } else {
            nav?.classList.remove('nav-hidden');
        }

        lastScrollY = scrollY;
        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollUI);
    }, { passive: true });
    updateScrollUI();

    const closeMenu = () => {
        nav?.classList.remove('menu-open');
        menuToggle?.classList.remove('is-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    };

    menuToggle?.addEventListener('click', () => {
        const isOpen = nav?.classList.toggle('menu-open') ?? false;
        menuToggle.classList.toggle('is-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
        if (!nav?.classList.contains('menu-open')) return;
        if (!(event.target instanceof Node) || nav.contains(event.target)) return;
        closeMenu();
    });

    const closeSplash = () => {
        if (!splash || splashClosed) return;
        splashClosed = true;
        splash.classList.add('is-leaving');
        body.classList.remove('is-locked');
        window.setTimeout(() => splash.remove(), 900);
    };

    splashButton?.addEventListener('click', closeSplash);
    splashButton?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            closeSplash();
        }
    });

    window.setTimeout(closeSplash, 5200);
    if (!splash) body.classList.remove('is-locked');

    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealElements.forEach((element) => revealObserver.observe(element));

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                desktopLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-38% 0px -50% 0px', threshold: 0 });
        sections.forEach((section) => sectionObserver.observe(section));
    } else {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    }

    // Lightweight pointer depth: enabled only on capable desktop pointers.
    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canTilt) {
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            const reset = () => {
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
            };
            card.addEventListener('pointermove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const ry = (x - 0.5) * 4;
                const rx = (0.5 - y) * 4;
                card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
                card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
            });
            card.addEventListener('pointerleave', reset);
            card.addEventListener('pointercancel', reset);
        });
    }

    // Prevent double activation when users use the browser back button on mobile menus.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1080) closeMenu();
    }, { passive: true });

    // Mark the first visible section on load.
    if (sections[0]) desktopLinks[0]?.classList.add('active');
})();
