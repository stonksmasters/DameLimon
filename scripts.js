// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    /* ================================
       1. Initialize GLightbox
    ================================ */
    const initGLightbox = () => {
      if (typeof GLightbox !== 'undefined') {
        GLightbox({
          selector: '.glightbox',
          touchNavigation: true,
          loop: true,
          autoplayVideos: true
        });
      } else {
        console.error('GLightbox library is not loaded.');
      }
    };

    /* ================================
       2. Mobile Menu Toggle
    ================================ */
    const initMobileMenuToggle = () => {
      const menuToggle = document.querySelector('.menu-toggle');
      const navMenu = document.querySelector('nav ul');
      if (menuToggle && navMenu) {
        const toggleMenu = () => {
          navMenu.classList.toggle('active');
          menuToggle.classList.toggle('active');
        };
        menuToggle.addEventListener('click', toggleMenu);
        menuToggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
          }
        });
        document.addEventListener('click', (e) => {
          if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
          }
        });
      } else {
        console.warn('Mobile menu elements not found.');
      }
    };

    /* ================================
       3. Smooth Scrolling for Navigation Links
    ================================ */
    const initSmoothScrolling = () => {
      document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            const headerOffset = 80;
            const offsetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            const navMenu = document.querySelector('nav ul');
            const menuToggle = document.querySelector('.menu-toggle');
            if (navMenu.classList.contains('active')) {
              navMenu.classList.remove('active');
              menuToggle.classList.remove('active');
            }
          }
        });
      });
    };

    /* ================================
       4. Throttled Scroll Event Handling
    ================================ */
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHeaderOnScroll();
          updateBackToTopVisibility();
          updateActiveNavLink();
          updateScrollIndicator();
          ticking = false;
        });
        ticking = true;
      }
    };

    /* ================================
       5. Update Header on Scroll
    ================================ */
    const updateHeaderOnScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        header.classList.toggle('scrolled', window.pageYOffset > 100);
      }
    };

    /* ================================
       6. Back to Top Button Visibility
    ================================ */
    const updateBackToTopVisibility = () => {
      const btn = document.getElementById('backToTop');
      if (btn) {
        if (window.pageYOffset > 300) {
          btn.style.display = 'block';
          btn.style.opacity = '1';
        } else {
          btn.style.display = 'none';
          btn.style.opacity = '0';
        }
      }
    };

    /* ================================
       7. Active Navigation Link Highlighting
    ================================ */
    const updateActiveNavLink = () => {
      let current = '';
      document.querySelectorAll('.section').forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 100) {
          current = section.id;
        }
      });
      document.querySelectorAll('nav ul li a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').substring(1) === current);
      });
    };

    /* ================================
       8. Scroll Indicator Update
    ================================ */
    const updateScrollIndicator = () => {
      const indicator = document.querySelector('[data-scroll-indicator]');
      if (indicator) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        const angle = scrollPercent * 360;
        indicator.style.setProperty('--scroll-progress', `${angle}deg`);
      }
    };

    /* ================================
       9. Back to Top Button Handler
    ================================ */
    const initBackToTop = () => {
      const btn = document.getElementById('backToTop');
      if (btn) {
        btn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    };

    /* ================================
       10. Scroll Indicator Click Handler
    ================================ */
    const initScrollIndicatorClick = () => {
      const indicator = document.querySelector('[data-scroll-indicator]');
      if (indicator) {
        indicator.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    };

    /* ================================
       11. Scroll Reveal Animations
    ================================ */
    const initScrollReveal = () => {
      const revealElements = document.querySelectorAll('.section, .about-content, .contact-form, .hero-content');
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        revealElements.forEach(el => observer.observe(el));
      } else {
        revealElements.forEach(el => el.classList.add('in-view'));
      }
    };

    /* ================================
       12. Custom Cursor Functionality (commented out)
    ================================ */
    /*
    const initCustomCursor = () => {
      // ...
    };
    */

    /* ================================
       13. Music Library Player
    ================================ */
    const initMusicLibrary = () => {
      const realCards = document.querySelectorAll('.track-card:not(.track-placeholder)');
      const placeholderCards = document.querySelectorAll('.track-card.track-placeholder');
      let currentAudio = null;
      let currentCard = null;
      let isSeeking = false;

      const fmt = (s) => {
        const m = Math.floor(s / 60);
        return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
      };

      const showToast = (msg) => {
        const existing = document.querySelector('.music-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'music-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('visible'));
        setTimeout(() => {
          toast.classList.remove('visible');
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      };

      const resetControls = (card) => {
        const slider = card.querySelector('.track-slider');
        const time   = card.querySelector('.track-time');
        if (slider) { slider.value = 0; slider.style.setProperty('--fill-pct', '0%'); }
        if (time)   { time.textContent = '0:00'; }
      };

      // Pause only — keeps audio alive at current position
      const pauseCurrent = () => {
        if (currentAudio) currentAudio.pause();
        if (currentCard) {
          currentCard.classList.remove('is-playing');
          const icon = currentCard.querySelector('.play-btn i');
          const btn  = currentCard.querySelector('.play-btn');
          if (icon) icon.classList.replace('fa-pause', 'fa-play');
          if (btn)  btn.classList.remove('is-pausing');
        }
      };

      // Full stop — destroys audio and resets controls (used when switching tracks or on end)
      const stopCurrent = () => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio = null;
        }
        if (currentCard) {
          currentCard.classList.remove('is-playing');
          const icon = currentCard.querySelector('.play-btn i');
          const btn  = currentCard.querySelector('.play-btn');
          if (icon) icon.classList.replace('fa-pause', 'fa-play');
          if (btn)  btn.classList.remove('is-pausing');
          resetControls(currentCard);
          currentCard = null;
        }
      };

      realCards.forEach(card => {
        const slider    = card.querySelector('.track-slider');
        const timeEl    = card.querySelector('.track-time');
        const rewindBtn = card.querySelector('.rewind-btn');

        /* ── Seek slider ── */
        if (slider) {
          // While dragging: update fill + time preview without seeking yet
          slider.addEventListener('mousedown',  () => { isSeeking = true; });
          slider.addEventListener('touchstart', () => { isSeeking = true; }, { passive: true });

          slider.addEventListener('input', (e) => {
            e.stopPropagation();
            const pct = slider.value;
            slider.style.setProperty('--fill-pct', `${pct}%`);
            if (currentCard === card && currentAudio && currentAudio.duration) {
              timeEl.textContent = fmt((pct / 100) * currentAudio.duration);
            }
          });

          // On release: commit the seek
          slider.addEventListener('change', (e) => {
            e.stopPropagation();
            isSeeking = false;
            if (currentCard === card && currentAudio && currentAudio.duration) {
              currentAudio.currentTime = (slider.value / 100) * currentAudio.duration;
            }
          });

          slider.addEventListener('click', (e) => e.stopPropagation());
        }

        /* ── Rewind −5s ── */
        if (rewindBtn) {
          rewindBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentCard === card && currentAudio) {
              currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 5);
            }
          });
        }

        /* ── Play / Pause (card click) ── */
        card.addEventListener('click', () => {
          // Same card: toggle pause ↔ resume
          if (currentCard === card) {
            if (currentAudio && !currentAudio.paused) {
              pauseCurrent();
            } else if (currentAudio && currentAudio.paused) {
              currentAudio.play().catch(stopCurrent);
              card.classList.add('is-playing');
              const icon = card.querySelector('.play-btn i');
              const btn  = card.querySelector('.play-btn');
              if (icon) icon.classList.replace('fa-play', 'fa-pause');
              if (btn)  btn.classList.add('is-pausing');
            }
            return;
          }

          // Different card: stop current, start fresh
          stopCurrent();

          const audio = new Audio(card.dataset.src);
          currentAudio = audio;
          currentCard  = card;

          card.classList.add('is-playing');
          const icon = card.querySelector('.play-btn i');
          const btn  = card.querySelector('.play-btn');
          if (icon) icon.classList.replace('fa-play', 'fa-pause');
          if (btn)  btn.classList.add('is-pausing');

          // Drive slider + time display
          audio.addEventListener('timeupdate', () => {
            if (isSeeking || !audio.duration) return;
            const pct = (audio.currentTime / audio.duration) * 100;
            if (slider) {
              slider.value = pct;
              slider.style.setProperty('--fill-pct', `${pct}%`);
            }
            if (timeEl) timeEl.textContent = fmt(audio.currentTime);
          });

          audio.play().catch(stopCurrent);
          audio.addEventListener('ended', stopCurrent);
        });
      });

      /* ── Placeholders ── */
      placeholderCards.forEach(card => {
        card.addEventListener('click', () => showToast('Coming soon — stay tuned'));
      });
    };

    /* ================================
       14. Initialization
    ================================ */
    const init = () => {
      initGLightbox();
      initMobileMenuToggle();
      initSmoothScrolling();
      initBackToTop();
      initScrollReveal();
      initMusicLibrary();
      initScrollIndicatorClick();
      window.addEventListener('scroll', handleScroll);
    };

    // Run initialization
    init();
});
