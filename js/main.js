// AYAT INTERIOR — main.js

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  let ticking = false;
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');

    const toTop = document.querySelector('.to-top');
    if (toTop) toTop.classList.toggle('show', window.scrollY > 700);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // Mobile drawer
  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-close');
  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.classList.add('drawer-open');
    burger && burger.setAttribute('aria-expanded', 'true');
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.classList.remove('drawer-open');
    burger && burger.setAttribute('aria-expanded', 'false');
  };
  if (burger && drawer) {
    burger.addEventListener('click', openDrawer);
    closeBtn && closeBtn.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('.has-sub > a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const sub = a.nextElementSibling;
        const isOpen = sub.classList.contains('open');
        drawer.querySelectorAll('.sub-list.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) sub.classList.add('open');
      });
    });
    // Close the drawer when a real link inside it is followed
    drawer.querySelectorAll('a[href]:not([href="#"])').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });
  }

  // Desktop / tablet mega-menu — click-to-toggle so it also works reliably
  // on touchscreens in the range where the full nav (not the burger) shows.
  const setDropdownState = (parent, open) => {
    parent.classList.toggle('open', open);
    const trigger = parent.querySelector(':scope > a.nav-link');
    if (trigger) trigger.setAttribute('aria-expanded', String(open));
  };
  document.querySelectorAll('.has-dropdown > a.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const parent = link.closest('.has-dropdown');
      if (!parent || window.getComputedStyle(document.querySelector('.main-nav')).display === 'none') return;
      e.preventDefault();
      const isOpen = parent.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach(el => setDropdownState(el, false));
      if (!isOpen) setDropdownState(parent, true);
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(el => setDropdownState(el, false));
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown.open').forEach(el => setDropdownState(el, false));
      if (drawer && drawer.classList.contains('open')) closeDrawer();
    }
  });

  // Reset open menus when the viewport crosses a breakpoint (e.g. rotating
  // a tablet), so nothing is left stuck open in the wrong layout.
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.has-dropdown.open').forEach(el => setDropdownState(el, false));
      if (window.innerWidth > 1024 && drawer && drawer.classList.contains('open')) closeDrawer();
    }, 150);
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1600;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = (target * eased);
          el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cio.observe(el));
  }

  // Project filter (projects.html)
  const filterBtns = document.querySelectorAll('.filter-bar button');
  const cards = document.querySelectorAll('[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        cards.forEach(card => {
          const show = cat === 'all' || card.dataset.category === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Hero slideshow (if present)
  const slides = document.querySelectorAll('.hero-media img');
  if (slides.length > 1) {
    let i = 0;
    slides[0].style.opacity = slides[0].style.opacity || '0.42';
    setInterval(() => {
      slides[i].style.opacity = 0;
      i = (i + 1) % slides.length;
      slides[i].style.opacity = 0.42;
    }, 5000);
  }

  // Contact form (demo only — no backend)
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message Sent';
      form.reset();
      setTimeout(() => (btn.textContent = original), 2600);
    });
  }

  // Current year
  document.querySelectorAll('.cur-year').forEach(el => el.textContent = new Date().getFullYear());
});
