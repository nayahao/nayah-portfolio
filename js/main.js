/**
 * NAYAH LAURENT — PORTFOLIO · main.js
 * ─────────────────────────────────────────────────
 * 1.  Loading Screen    — boot window + progress bar
 * 2.  Mouse Glow        — warm ambient radial light
 * 3.  Custom Cursor     — dot + ring with spring lag
 * 4.  Typing Animation  — cycles words in hero
 * 5.  Navbar            — scroll state + active link
 * 6.  Mobile Menu       — hamburger toggle
 * 7.  Scroll Reveal     — fade + scale on .reveal elements
 * 8.  Text Scramble     — section titles resolve from random chars
 * 9.  Card Tilt         — 3D perspective on project cards
 * 10. Project Video     — hover-to-play demo videos
 * 11. Contact Form      — AJAX submit via Formspree
 */

'use strict';


/* ══════════════════════════════════════════════════════
   1. LOADING SCREEN
   Appends terminal-style lines one by one, fills the
   progress bar, then fades out and triggers hero anims.
   ══════════════════════════════════════════════════════ */

(function initLoader() {
    const loader   = document.getElementById('loader');
    const terminal = document.getElementById('loader-terminal');
    const prog     = document.getElementById('loader-prog');
    const pct      = document.getElementById('loader-pct');

    if (!loader) return;

    document.body.style.overflow = 'hidden';

    /* REPLACE: Edit these boot lines */
    const lines = [
        '> initializing system...',
        '> loading portfolio data...',
        '> compiling projects...',
        '> warming up animations...',
        '> ready!',
    ];

    let lineIdx = 0;

    function addLine() {
        if (lineIdx >= lines.length) { fillBar(); return; }

        const p = document.createElement('p');
        p.className = 'mono';
        p.textContent = lines[lineIdx];
        if (lineIdx === lines.length - 1) p.classList.add('done');
        terminal.appendChild(p);

        // Slide-in transition on next frame
        requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('show')));

        lineIdx++;
        setTimeout(addLine, 360);
    }

    function fillBar() {
        let progress = 0;
        const tick = setInterval(() => {
            progress += 2;
            const capped = Math.min(progress, 100);
            prog.style.width = capped + '%';
            pct.textContent  = Math.floor(capped) + '%';

            if (capped >= 100) {
                clearInterval(tick);
                setTimeout(dismiss, 280);
            }
        }, 16);
    }

    function dismiss() {
        loader.classList.add('fade-out');

        setTimeout(() => {
            loader.remove();
            document.body.style.overflow = '';

            // Stagger hero elements in with blur-fade animation
            document.querySelectorAll('.hero-anim').forEach((el, i) => {
                setTimeout(() => el.classList.add('in'), i * 95);
            });
        }, 650);
    }

    setTimeout(addLine, 320);
})();


/* ══════════════════════════════════════════════════════
   2. MOUSE GLOW
   Large radial-gradient div that follows the cursor
   with spring smoothing — creates soft ambient warmth.
   Opacity is slightly higher than before per feedback.
   ══════════════════════════════════════════════════════ */

(function initMouseGlow() {
    const glow = document.getElementById('mouse-glow');
    if (!glow || !window.matchMedia('(hover: hover)').matches) {
        if (glow) glow.style.display = 'none';
        return;
    }

    let cx = window.innerWidth  / 2;
    let cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    (function animateGlow() {
        // Spring factor 0.08 — slightly more responsive than before
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;

        glow.style.left = cx + 'px';
        glow.style.top  = cy + 'px';

        requestAnimationFrame(animateGlow);
    })();
})();


/* ══════════════════════════════════════════════════════
   3. CUSTOM CURSOR
   Dot follows mouse instantly.
   Ring follows with spring lag (softer, more fluid).
   Ring expands on hover over interactive elements.
   ══════════════════════════════════════════════════════ */

(function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (!dot || !ring || !window.matchMedia('(hover: hover)').matches) return;

    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function moveCursor() {
        // Ring spring: 0.14
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;

        dot.style.left  = mx + 'px';
        dot.style.top   = my + 'px';
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';

        requestAnimationFrame(moveCursor);
    })();

    const interactables = 'a, button, .btn, .chip, .skill-tag, .social-card, .proj-card, .tl-item, input, textarea, .nav-link, .logo-text';

    document.addEventListener('mouseover', e => {
        if (e.target.closest(interactables)) document.body.classList.add('hovering');
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(interactables)) document.body.classList.remove('hovering');
    });

    document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('clicking'));
})();


/* ══════════════════════════════════════════════════════
   4. TYPING ANIMATION
   Cycles through words in the hero section.
   REPLACE: Edit the words array below.
   ══════════════════════════════════════════════════════ */

(function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    /* REPLACE: These are the cycling words in the hero "Building ___" line */
    const words = [
        'full-stack web apps.',
        'AI-powered features.',
        'data pipelines.',
        'mobile experiences.',
        'things that matter.',
    ];

    let wordIdx  = 0;
    let charIdx  = 0;
    let deleting = false;

    const TYPE_SPEED   = 80;
    const DELETE_SPEED = 40;
    const PAUSE_END    = 2000;
    const PAUSE_START  = 380;

    function tick() {
        const word = words[wordIdx];

        if (!deleting) {
            charIdx++;
            el.textContent = word.slice(0, charIdx);

            if (charIdx === word.length) {
                deleting = true;
                setTimeout(tick, PAUSE_END);
                return;
            }
        } else {
            charIdx--;
            el.textContent = word.slice(0, charIdx);

            if (charIdx === 0) {
                deleting = false;
                wordIdx  = (wordIdx + 1) % words.length;
                setTimeout(tick, PAUSE_START);
                return;
            }
        }

        setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
    }

    // Delay start to let loader finish first
    setTimeout(tick, 1500);
})();


/* ══════════════════════════════════════════════════════
   5. NAVBAR
   Adds glass background after 50px scroll.
   Highlights the nav link for the visible section.
   ══════════════════════════════════════════════════════ */

(function initNavbar() {
    const navbar   = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (!navbar) return;

    function onScroll() {
        navbar.classList.toggle('floating', window.scrollY > 80);

        let active = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 150) active = sec.id;
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + active);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();


/* ══════════════════════════════════════════════════════
   6. MOBILE MENU
   ══════════════════════════════════════════════════════ */

(function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (!toggle || !links) return;

    function close() {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    links.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));

    document.addEventListener('click', e => {
        if (links.classList.contains('open') &&
            !links.contains(e.target) &&
            !toggle.contains(e.target)) {
            close();
        }
    });
})();


/* ══════════════════════════════════════════════════════
   7. SCROLL REVEAL
   .reveal elements fade + scale in when entering viewport.
   Siblings in the same parent get a staggered --delay.
   ══════════════════════════════════════════════════════ */

(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('in-view'));
        return;
    }

    // Group siblings and assign stagger delays
    const groups = {};
    els.forEach(el => {
        const key = el.parentElement ? el.parentElement.className || 'root' : 'root';
        if (!groups[key]) groups[key] = [];
        groups[key].push(el);
    });

    Object.values(groups).forEach(group => {
        group.forEach((el, i) => {
            el.style.setProperty('--delay', (Math.min(i, 4) * 0.1) + 's');
        });
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════════════════════
   7b. SKILL TAG STAGGER
   When a skill panel enters view, its tags fade in one
   by one with a small delay between each.
   ══════════════════════════════════════════════════════ */

(function initSkillStagger() {
    if (!('IntersectionObserver' in window)) return;

    const bodies = document.querySelectorAll('.skill-body');
    if (!bodies.length) return;

    // Start tags invisible
    bodies.forEach(body => {
        body.querySelectorAll('.skill-tag').forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(6px)';
            tag.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        });
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const tags = entry.target.querySelectorAll('.skill-tag');
            tags.forEach((tag, i) => {
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = '';
                }, i * 45 + 80);
            });
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    bodies.forEach(body => obs.observe(body));
})();


/* ══════════════════════════════════════════════════════
   8. TEXT SCRAMBLE
   Section headings with data-scramble resolve from
   random characters left-to-right when they enter view.
   ══════════════════════════════════════════════════════ */

(function initScramble() {
    const CHARS  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';
    const FRAMES = 16;
    const TICK   = 35;

    function scramble(el) {
        const target = el.dataset.scramble || el.textContent;
        let frame = 0;

        const run = () => {
            const progress = frame / FRAMES;

            el.textContent = target.split('').map((ch, i) => {
                if (ch === ' ' || ch === "'") return ch;
                if (i / target.length < progress) return ch;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('');

            if (frame < FRAMES) {
                frame++;
                setTimeout(run, TICK);
            } else {
                el.textContent = target;
            }
        };

        run();
    }

    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll('[data-scramble]');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scramble(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    targets.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════════════════════
   9. CARD TILT — 3D perspective on project cards
   Subtly rotates each card based on mouse position
   within it. Resets smoothly when mouse leaves.
   ══════════════════════════════════════════════════════ */

(function initCardTilt() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    document.querySelectorAll('.proj-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
            const y = (e.clientY - rect.top)  / rect.height - 0.5;

            card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();


/* ══════════════════════════════════════════════════════
   10. PROJECT VIDEO HOVER
   If a card has <video class="proj-video">, it auto-plays
   on hover and the thumbnail fades out.

   HOW TO ADD A VIDEO TO A CARD:
   Inside .proj-media, add:
       <video class="proj-video"
              src="assets/videos/your-demo.mp4"
              loop muted playsinline></video>
   ══════════════════════════════════════════════════════ */

(function initProjectVideos() {
    document.querySelectorAll('.proj-card').forEach(card => {
        const media = card.querySelector('.proj-media');
        const video = card.querySelector('.proj-video');
        const thumb = card.querySelector('.proj-thumb, .proj-ph');

        if (!media || !video) return;

        media.addEventListener('mouseenter', () => {
            video.play().catch(() => {}); // suppress autoplay policy errors
            video.classList.add('playing');
            if (thumb) thumb.style.opacity = '0';
        });

        media.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
            video.classList.remove('playing');
            if (thumb) thumb.style.opacity = '1';
        });
    });
})();


/* ══════════════════════════════════════════════════════
   11. CONTACT FORM — AJAX via Formspree
   Submits without a page reload.
   REPLACE: Set your Formspree endpoint in the form action attr.
   ══════════════════════════════════════════════════════ */

(function initContactForm() {
    const form   = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const btn      = form.querySelector('[type="submit"]');
        const origHTML = btn.innerHTML;

        btn.disabled  = true;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> sending...';
        status.textContent = '';
        status.className   = 'form-status';

        try {
            const res = await fetch(form.action, {
                method:  'POST',
                body:    new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (res.ok) {
                status.textContent = "// sent! i'll get back to you soon.";
                form.reset();
            } else {
                const data = await res.json().catch(() => ({}));
                const msg  = data?.errors?.map(err => err.message).join(', ')
                           || 'something went wrong — try emailing me directly.';
                throw new Error(msg);
            }
        } catch (err) {
            status.textContent = '// error: ' + err.message;
            status.classList.add('error');
        } finally {
            btn.disabled  = false;
            btn.innerHTML = origHTML;
        }
    });
})();
