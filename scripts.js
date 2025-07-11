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
       13. Audio Player Waveform Placeholder
    ================================ */
    const initAudioPlayers = () => {
      document.querySelectorAll('[data-audio-player]').forEach(player => {
        const audio = player.querySelector('audio');
        const waveform = player.querySelector('[data-waveform]');
        if (audio && waveform) {
          console.log('Audio player ready for waveform visualization:', audio);
        }
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
      // initCustomCursor();  <-- removed
      initAudioPlayers();
      initScrollIndicatorClick();
      window.addEventListener('scroll', handleScroll);
    };

    // Run initialization
    init();
});
