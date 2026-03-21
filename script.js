/* ============================================================
   FRANKLIN XAVIER — PORTFÓLIO FOTOGRÁFICO
   script.js  |  Interações e animações
   ============================================================ */

'use strict';

/*Importando a biblioteca GSAP e seus plugins */
window.addEventListener("load", () => {

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  ScrollSmoother.create({
    smooth: 1.2,
    effects: true,
    smoothTouch: 0.1
  });

});



/* Animando nome */
gsap.to(".sobre__name-left, .sobre__name-right", {
  y: 200,
  ease: "none",
  scrollTrigger: {
    trigger: ".sobre",
    start: "top 70%",
    end: "bottom 40%",
    scrub: true
  }
});


/* ── 1. NAVBAR: fundo ao rolar + fechar menu mobile ────────── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('navMenu');
  const navLinks   = navMenu.querySelectorAll('.navbar__link');

  /* Adiciona classe .scrolled quando rolar além de 60px */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // executar imediatamente ao carregar

  /* Abre / fecha menu mobile */
  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    navMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  /* Fecha o menu ao clicar em qualquer link */
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  /* Fecha o menu ao clicar fora (overlay) */
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });
})();


/* ── 2. SCROLL SUAVE para âncoras internas ─────────────────── */
/* (complementa o scroll-behavior: smooth do CSS, garantindo
    compatibilidade com browsers mais antigos) */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 72;

      const targetY = target.getBoundingClientRect().top + window.scrollY - navH;

      ScrollSmoother.get().scrollTo(target, true);

    });
  });
})();


/* ── 3. ANIMAÇÃO AO ROLAR — Intersection Observer ──────────── */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  if (!elements.length) return;

  /* Aplica delay personalizado se informado via data-delay */
  elements.forEach(el => {
    const delay = el.dataset.delay;
    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          /* Para de observar após animar (performance) */
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   /* dispara quando 12% do elemento está visível */
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ── 4. EFEITO CURSOR NOS CARDS DO PORTFÓLIO ───────────────── */
/* Adiciona um cursor personalizado tipo "lupa" sobre os cards */
(function initPortfolioHover() {
  const cards = document.querySelectorAll('.portfolio__card');

  cards.forEach(card => {
    /* Cria o elemento de cursor */
    const cursor = document.createElement('div');
    cursor.className = 'portfolio__cursor';
    cursor.textContent = '+';
    cursor.style.cssText = `
      position: absolute;
      pointer-events: none;
      width: 48px; height: 48px;
      background: rgba(184, 92, 92, 0.9);
      color: #fff;
      font-family: var(--ff-head);
      font-size: 1.6rem;
      font-weight: 300;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                  opacity 0.3s ease;
      opacity: 0;
      z-index: 10;
    `;
    card.appendChild(cursor);

    /* Movimenta o cursor com o mouse */
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      cursor.style.left = `${e.clientX - rect.left}px`;
      cursor.style.top  = `${e.clientY - rect.top}px`;
    });

    card.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity   = '1';
    });

    card.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0)';
      cursor.style.opacity   = '0';
    });
  });
})();



/* ── 6. INDICADOR DE ANO automático no footer ──────────────── */
(function updateYear() {
  const yearEl = document.querySelector('.footer__copy');
  if (yearEl) {
    yearEl.textContent = yearEl.textContent.replace(
      /\d{4}/,
      new Date().getFullYear()
    );
  }
})();
