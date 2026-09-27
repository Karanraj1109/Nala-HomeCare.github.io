/**
 * Nala Homecare - Premium Interaction Script
 * Optimizes performance using IntersectionObserver and semantic DOM interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const body = document.body;
    const nav = document.querySelector('.site-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobilePanel = document.querySelector('.mobile-nav-panel');
    const splashScreen = document.getElementById('splash-screen');
    const btnMasuk = document.getElementById('btn-masuk');
    const navLinksDesktop = document.querySelectorAll('.nav-links a');
    const navLinksMobile = document.querySelectorAll('.mobile-nav-links a');
    const allLinks = [...navLinksDesktop, ...navLinksMobile];

    // --- 1. Navbar Scroll Effect ---
    const handleScroll = () => {
        if (nav) {
            nav.classList.toggle('is-scrolled', window.scrollY > 50);
        }
    };

    // Throttle scroll event for performance
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // Trigger once on load
    handleScroll();

    // --- 2. Mobile Menu Toggle ---
    const closeMenu = () => {
        if (!menuToggle || !mobilePanel) return;
        menuToggle.classList.remove('is-open');
        mobilePanel.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = body.classList.contains('is-locked') ? 'hidden' : '';
    };

    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('is-open');
            mobilePanel.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));

            // Lock body scroll when menu is open
            body.style.overflow = isOpen ? 'hidden' : (body.classList.contains('is-locked') ? 'hidden' : '');
        });

        // Close menu when clicking a link
        navLinksMobile.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu with Escape
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && mobilePanel.classList.contains('is-open')) {
                closeMenu();
                menuToggle.focus();
            }
        });
    }

    // --- 3. Splash Screen Logic ---
    const dismissSplash = () => {
        if (!splashScreen || splashScreen.classList.contains('is-leaving')) return;

        splashScreen.classList.add('is-leaving');
        body.classList.remove('is-locked');
        if (!mobilePanel || !mobilePanel.classList.contains('is-open')) {
            body.style.overflow = '';
        }

        // Remove from DOM after transition completes for clean DOM
        window.setTimeout(() => {
            splashScreen.remove();
        }, 800);
    };

    if (btnMasuk) {
        btnMasuk.addEventListener('click', dismissSplash);
    }

    // Fallback: Auto close after 4.5 seconds for UX safety
    window.setTimeout(dismissSplash, 4500);

    // --- 4. Premium Scroll Reveal (IntersectionObserver) ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers or reduced-motion preference
        revealElements.forEach(el => {
            el.classList.add('is-visible');
        });
    }

    // --- 5. Active Nav Link Highlighter ---
    const sections = document.querySelectorAll('section[id]');
    const navSections = [...sections].filter(section =>
        allLinks.some(link => link.getAttribute('href') === `#${section.id}`)
    );

    const setActiveLink = id => {
        allLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    if ('IntersectionObserver' in window) {
        const activeNavOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const activeNavCallback = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        };

        const navObserver = new IntersectionObserver(activeNavCallback, activeNavOptions);
        navSections.forEach(section => navObserver.observe(section));
    } else {
        // Simple fallback when IntersectionObserver is unavailable
        setActiveLink('beranda');
    }
});
