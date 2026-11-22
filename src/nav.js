// ==========================================================================
// THE BELLE AMOURA RETREAT — UNIVERSAL NAVIGATION & DRAWER ENGINE
// ==========================================================================

(() => {
  let lastToggleTime = 0;

  window.__openRetreatDrawer = function() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.querySelectorAll('.menu-toggle, #menu-toggle-btn').forEach(b => b.setAttribute('aria-expanded', 'true'));
    }
  };

  window.__closeRetreatDrawer = function() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      document.querySelectorAll('.menu-toggle, #menu-toggle-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  };

  window.__toggleRetreatDrawer = function(e) {
    const now = Date.now();
    if (now - lastToggleTime < 280) {
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();
      return;
    }
    lastToggleTime = now;

    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    const drawer = document.getElementById('mobile-drawer');
    if (drawer && drawer.classList.contains('open')) {
      window.__closeRetreatDrawer();
    } else {
      window.__openRetreatDrawer();
    }
  };

  function initNav() {
    // 1. Sync copyright years
    document.querySelectorAll('#year, [data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });

    // 2. Ensure mobile drawer exists; if page has menu-toggle but no drawer, build it
    let drawer = document.getElementById('mobile-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.className = 'mobile-drawer';
      drawer.id = 'mobile-drawer';
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-label', 'Navigation drawer');
      drawer.innerHTML = `
        <div class="drawer-panel">
          <div>
            <div class="drawer-header">
              <a class="brand" href="/" style="color: #FFFFFF;">
                <div class="brand-logo-frame">
                  <img src="/assets/logo.png" alt="The Belle Amoura Retreat Official Logo" class="official-logo-img">
                </div>
                <div class="brand-title-wrap">
                  <span class="brand-name" style="color: #FFFFFF;">THE BELLE AMOURA RETREAT</span>
                  <span class="brand-subtitle" style="color: var(--gold-champagne, #E6D2A8);">THE WORLD, THOUGHTFULLY YOURS</span>
                </div>
              </a>
              <button class="drawer-close" id="drawer-close-btn" type="button" aria-label="Close menu">&times;</button>
            </div>
            <nav class="drawer-links" aria-label="Mobile navigation">
              <a href="/#packages" style="color: var(--teal-glow, #14B8A6);">Packages &amp; Installments <span>🔥</span></a>
              <a href="/#installment-calculator">Installment Calculator <span>🧮</span></a>
              <a href="/">Home <span>↗</span></a>
              <a href="/about.html">Our story <span>↗</span></a>
              <a href="/experiences.html">Experiences <span>↗</span></a>
              <a href="/journal.html">The Journal <span>↗</span></a>
              <a href="/gallery.html">Visual gallery <span>↗</span></a>
              <a href="/investors.html">Investors &amp; Partners <span>↗</span></a>
              <a href="/careers.html">Careers &amp; Contractors <span>↗</span></a>
              <a href="/influencers.html">Influencer Residencies <span>↗</span></a>
              <a href="/legal.html">Legal &amp; Governance <span>↗</span></a>
              <a href="/book-your-escape.html">Book your escape <span>↗</span></a>
              <a href="/contact.html">Contact concierge <span>↗</span></a>
            </nav>
          </div>
          <div class="drawer-contact">
            <span style="font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.16em;">Concierge Desk</span>
            <a href="tel:+254706168307">+254 706 168 307</a>
            <a href="mailto:thebelleamouraretreat@gmail.com">thebelleamouraretreat@gmail.com</a>
            <a href="https://wa.me/254706168307" target="_blank" rel="noopener noreferrer">WhatsApp Priority Liaison ↗</a>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
    }

    const menuButtons = document.querySelectorAll('.menu-toggle, #menu-toggle-btn, [data-menu-toggle]');
    const drawerClose = document.getElementById('drawer-close-btn');

    menuButtons.forEach(btn => {
      if (btn.dataset.navBound === 'true') return;
      btn.dataset.navBound = 'true';
      btn.addEventListener('click', (e) => {
        window.__toggleRetreatDrawer(e);
      });
    });

    if (drawerClose && drawerClose.dataset.navBound !== 'true') {
      drawerClose.dataset.navBound = 'true';
      drawerClose.addEventListener('click', (e) => {
        if (e && e.preventDefault) e.preventDefault();
        window.__closeRetreatDrawer();
      });
    }

    if (drawer && drawer.dataset.navBound !== 'true') {
      drawer.dataset.navBound = 'true';
      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) {
          window.__closeRetreatDrawer();
        }
      });

      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          window.__closeRetreatDrawer();
        });
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const d = document.getElementById('mobile-drawer');
        if (d && d.classList.contains('open')) {
          window.__closeRetreatDrawer();
        }
      }
    });

    // 3. Scroll Header Elevation & Glassmorphism
    const header = document.querySelector('.site-header');
    if (header) {
      const handleScroll = () => {
        if (window.scrollY > 25) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    // 4. Luxury Scroll-Reveal & Staggered Viewport Entrance
    const revealTargets = document.querySelectorAll(
      '.scroll-reveal, .strip-gallery-section, .safari-feature-section, .pool-retreat-section, ' +
      '.brand-emblem-section, .escapes-section, .discovery-card, .process-section, .inquiry-section, ' +
      '.footer-emblem-block, .about-grid-split, .gallery-item, .investor-pillar-card, .career-card'
    );

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.08
      });

      revealTargets.forEach((el, index) => {
        el.classList.add('scroll-reveal');
        if (!el.className.includes('stagger-')) {
          const mod = (index % 6) + 1;
          el.classList.add(`stagger-${mod}`);
        }
        observer.observe(el);
      });
    } else {
      // Fallback for older browsers
      revealTargets.forEach(el => {
        el.classList.add('scroll-reveal', 'is-revealed');
      });
    }

    // 5. Compact Private Journal Newsletter Form Handler
    const newsletterForm = document.getElementById('journal-newsletter-form');
    if (newsletterForm && newsletterForm.dataset.bound !== 'true') {
      newsletterForm.dataset.bound = 'true';
      const emailInput = document.getElementById('journal-newsletter-email');
      const submitBtn = document.getElementById('journal-newsletter-btn');
      const feedback = document.getElementById('journal-newsletter-feedback');

      newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (emailInput?.value || '').trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (feedback) {
            feedback.className = 'newsletter-feedback error show';
            feedback.textContent = 'Please enter a valid email address.';
          }
          if (emailInput) emailInput.focus();
          return;
        }

        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Subscribe';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Joining...</span>';
        }

        try {
          const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            throw new Error(data.error || 'Unable to register at this time. Please try again.');
          }

          if (feedback) {
            feedback.className = 'newsletter-feedback success show';
            feedback.innerHTML = `✦ ${data.message || 'Welcome to The Private Journal.'}`;
          }
          if (emailInput) emailInput.value = '';
          try { localStorage.setItem('ba_journal_subscribed', email); } catch (_) {}
        } catch (err) {
          if (feedback) {
            feedback.className = 'newsletter-feedback error show';
            feedback.textContent = err.message || 'Something went wrong. Please try again.';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

