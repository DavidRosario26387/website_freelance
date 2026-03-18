/* ============================================================
   BAN Enterprises
   script.js
   ============================================================ */

'use strict';

/* ===== STICKY HEADER ===== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });


/* ===== MOBILE NAVIGATION ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Close nav when clicking a link inside it
navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});


/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href   = this.getAttribute('href');
        const target = href === '#' ? document.body : document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset     = header.offsetHeight + 8;
            const targetTop  = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
    });
});


/* ===== STATS COUNTER ANIMATION ===== */
function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const fps      = 60;
    const steps    = duration / (1000 / fps);
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, 1000 / fps);
}

// Trigger when hero stats enter the viewport
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(animateCounter);
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
}


/* ===== TESTIMONIAL SLIDER ===== */
const track        = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');

if (track && dotsContainer && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let current = 0;
    let autoSlideTimer = null;

    // Build dot buttons
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className    = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    function goToSlide(index) {
        current = ((index % total) + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        updateDots();
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(() => goToSlide(current + 1), 5000);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

    prevBtn.addEventListener('click', () => { goToSlide(current - 1); startAutoSlide(); });
    nextBtn.addEventListener('click', () => { goToSlide(current + 1); startAutoSlide(); });

    // Pause on hover
    const slider = document.getElementById('testimonialSlider');
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Touch / swipe support
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        stopAutoSlide();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        const delta = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 40) {
            goToSlide(delta > 0 ? current + 1 : current - 1);
        }
        startAutoSlide();
    }, { passive: true });

    // Keyboard navigation
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(current - 1);
        if (e.key === 'ArrowRight') goToSlide(current + 1);
    });

    startAutoSlide();
}


/* ===== SCROLL-REVEAL ANIMATION ===== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Stagger cards in a grid
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            const index    = Array.from(siblings).indexOf(entry.target);
            entry.target.style.transitionDelay = `${(index % 4) * 80}ms`;
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ===== CONTACT FORM (demo handler — replace with real endpoint) ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic client-side validation
        const name  = contactForm.querySelector('[name="name"]').value.trim();
        const phone = contactForm.querySelector('[name="phone"]').value.trim();
        const email = contactForm.querySelector('[name="email"]').value.trim();

        if (!name || !phone || !email) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Simple email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        const btn = contactForm.querySelector('.btn-submit');
        btn.disabled = true;
        btn.innerHTML = 'SENDING… <i class="fas fa-spinner fa-spin"></i>';

        // Simulate async send (swap with real fetch/API call)
        setTimeout(() => {
            showFormMessage('Thank you! Your message has been sent. We\'ll be in touch shortly.', 'success');
            btn.innerHTML = 'MESSAGE SENT <i class="fas fa-check"></i>';
            btn.style.background = '#1a9b4e';
            contactForm.reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = 'SUBMIT <i class="fas fa-paper-plane"></i>';
                btn.style.background = '';
                removeFormMessage();
            }, 5000);
        }, 1200);
    });
}

function showFormMessage(text, type) {
    removeFormMessage();
    const msg = document.createElement('p');
    msg.id        = 'formMsg';
    msg.textContent = text;
    msg.style.cssText = `
        font-family: 'Montserrat', sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin-top: 14px;
        padding: 12px 16px;
        border-radius: 4px;
        color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        background: ${type === 'success' ? 'rgba(25,135,84,0.25)' : 'rgba(220,53,69,0.25)'};
        border: 1px solid ${type === 'success' ? 'rgba(25,135,84,0.4)' : 'rgba(220,53,69,0.4)'};
    `;
    contactForm.appendChild(msg);
}

function removeFormMessage() {
    const existing = document.getElementById('formMsg');
    if (existing) existing.remove();
}


/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id], .about-section[id]');
const navItems = document.querySelectorAll('.nav-links .nav-item');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(item => item.classList.remove('active'));
            const id   = entry.target.id;
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) link.classList.add('active');
        }
    });
}, { threshold: 0.35 });

sections.forEach(section => navObserver.observe(section));
