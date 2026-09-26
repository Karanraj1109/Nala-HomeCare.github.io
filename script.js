(() => {
    'use strict';

    const body = document.body;
    const splash = document.getElementById('splash-screen');
    const logoWrapper = document.getElementById('btn-masuk-wrapper');
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const progress = document.createElement('div');
    progress.id = 'page-progress';
    document.body.appendChild(progress);

    let ticking = false;
    let lastScroll = window.scrollY;

    const updateScrollUI = () => {
        const scrollTop = window.scrollY;
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        progress.style.width = `${Math.min((scrollTop / maxScroll) * 100, 100)}%`;
        nav?.classList.toggle('scrolled', scrollTop > 18);

        if (window.innerWidth > 860 && scrollTop > 120) {
            const delta = scrollTop - lastScroll;
            if (delta > 4) nav?.classList.add('nav-hidden');
            if (delta < -4) nav?.classList.remove('nav-hidden');
        } else {
            nav?.classList.remove('nav-hidden');
        }

        lastScroll = scrollTop;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollUI);
            ticking = true;
        }
    }, { passive: true });
    updateScrollUI();

    const closeMenu = () => {
        nav?.classList.remove('menu-open');
        menuToggle?.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    };

    menuToggle?.addEventListener('click', () => {
        const open = nav?.classList.toggle('menu-open') ?? false;
        menuToggle.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (event) => {
        if (!nav || !menuToggle || !nav.classList.contains('menu-open')) return;
        if (!nav.contains(event.target)) closeMenu();
    });

    const enterSite = () => {
        if (!splash || splash.classList.contains('entered')) return;
        logoWrapper?.classList.add('clicked');
        window.setTimeout(() => {
            splash.classList.add('entered');
            body.classList.remove('no-scroll');
        }, 180);
        window.setTimeout(() => splash.remove(), 1200);
    };

    logoWrapper?.addEventListener('click', enterSite);
    logoWrapper?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            enterSite();
        }
    });
    logoWrapper?.setAttribute('role', 'button');
    logoWrapper?.setAttribute('tabindex', '0');

    if (!splash) body.classList.remove('no-scroll');

    // Safety fallback: do not lock the page forever if the user does not interact.
    window.setTimeout(() => {
        if (splash && !splash.classList.contains('entered')) enterSite();
    }, 8000);

    const revealTargets = document.querySelectorAll(
        '#tentang .about-text, #tentang .about-image, #tentang .about-detail > div, #visi-misi .dual-col > div, #gelembung .bubble, #layanan .card, #layanan .service-image, #keunggulan .check-list li, #testimoni .card, #kontak .contact-info p, #kontak .footer-buttons'
    );

    revealTargets.forEach((element, index) => {
        element.classList.add('reveal-ready', `reveal-delay-${(index % 3) + 1}`);
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealTargets.forEach((element) => observer.observe(element));

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-38% 0px -54% 0px', threshold: 0 });
        sections.forEach((section) => sectionObserver.observe(section));
    } else {
        revealTargets.forEach((element) => element.classList.add('is-visible'));
    }

    document.querySelectorAll('.card, .dual-col > div, .hero-panel').forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', `${x}%`);
            card.style.setProperty('--my', `${y}%`);
        });
    });
})();
