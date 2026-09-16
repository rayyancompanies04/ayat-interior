document.addEventListener('DOMContentLoaded', () => {
  const heroNav = document.querySelector('.navbar--hero');
  if (heroNav) {
    const onScroll = () => {
      if (window.scrollY > 40) heroNav.classList.add('is-scrolled');
      else heroNav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mm-close');

  const openMenu = () => {
    if (!menu) return;
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    if (!menu) return;
    menu.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (toggle) toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (menu) {
    menu.querySelectorAll('.mm-item:not(.mm-expand), .mm-subitem, .mm-contact').forEach(el => {
      el.addEventListener('click', closeMenu);
    });
    document.querySelectorAll('.mm-expand').forEach(btn => {
      btn.addEventListener('click', () => {
        const submenu = document.getElementById(btn.dataset.target);
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        if (submenu) submenu.classList.toggle('open');
      });
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sent — we\'ll be in touch';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 2600);
    });
  }

  // Hero Slider Auto-sliding
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds
    let slideTimer;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) slide.classList.add('active');
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    const startSlideshow = () => {
      slideTimer = setInterval(nextSlide, slideInterval);
    };

    const stopSlideshow = () => {
      clearInterval(slideTimer);
    };

    // Initialize first slide
    showSlide(0);

    // Start auto-slide
    startSlideshow();

    // Pause on hover
    heroSlider.addEventListener('mouseenter', stopSlideshow);
    heroSlider.addEventListener('mouseleave', startSlideshow);
  }
});
