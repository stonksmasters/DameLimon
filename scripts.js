// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    /* ================================
       1. Initialize GLightbox
    ================================ */
    const initGLightbox = () => {
      if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
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
        // Close the mobile menu when clicking outside
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
      const navLinks = document.querySelectorAll('nav ul li a');
      navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            const headerOffset = 80; // Height of the fixed header
            const offsetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            // Close mobile menu if open
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
      const backToTopButton = document.getElementById('backToTop');
      if (backToTopButton) {
        if (window.pageYOffset > 300) {
          backToTopButton.style.display = 'block';
          backToTopButton.style.opacity = '1';
        } else {
          backToTopButton.style.display = 'none';
          backToTopButton.style.opacity = '0';
        }
      }
    };
  
    /* ================================
       7. Active Navigation Link Highlighting
    ================================ */
    const updateActiveNavLink = () => {
      const sections = document.querySelectorAll('.section');
      const navLinks = document.querySelectorAll('nav ul li a');
      let current = '';
      sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 100) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').substring(1) === current);
      });
    };
  
    /* ================================
       8. Scroll Indicator Update
       (Fills the circle based on scroll progress)
    ================================ */
    const updateScrollIndicator = () => {
      const scrollIndicator = document.querySelector('[data-scroll-indicator]');
      if (scrollIndicator) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        // Calculate angle in degrees (from 0 to 360)
        const angle = scrollPercent * 360;
        // Update the custom property --scroll-progress with the computed angle
        scrollIndicator.style.setProperty('--scroll-progress', `${angle}deg`);
      }
    };
  
    /* ================================
       9. Back to Top Button Handler
    ================================ */
    const initBackToTop = () => {
      const backToTopButton = document.getElementById('backToTop');
      if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    };
  
    /* ================================
       10. Scroll Indicator Click Handler
    ================================ */
    const initScrollIndicatorClick = () => {
      const scrollIndicator = document.querySelector('[data-scroll-indicator]');
      if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    };
  
    /* ================================
       11. Scroll Reveal Animations via IntersectionObserver
    ================================ */
    const initScrollReveal = () => {
      const revealElements = document.querySelectorAll('.section, .about-content, .contact-form, .hero-content');
      if ('IntersectionObserver' in window) {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };
        const revealOnScroll = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        }, observerOptions);
        revealElements.forEach(el => revealOnScroll.observe(el));
      } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('in-view'));
      }
    };
  
    /* ================================
       12. Custom Cursor Functionality
         - Default image: /assets/images/MouseCursor1.png
         - Hovering over clickable elements: /assets/images/MouseCursor2.png
         - Adds a pressed effect on mousedown/up
    ================================ */
    const initCustomCursor = () => {
      const customCursor = document.querySelector('[data-cursor]');
      if (customCursor && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
          // Update the cursor position
          customCursor.style.left = `${e.clientX}px`;
          customCursor.style.top = `${e.clientY}px`;
  
          // Check the element directly under the cursor
          const hoveredElem = document.elementFromPoint(e.clientX, e.clientY);
          const clickable = hoveredElem && hoveredElem.closest('a, button, input, textarea, [data-clickable]');
          if (clickable) {
            customCursor.style.backgroundImage = "url('/assets/images/MouseCursor2.png')";
          } else {
            customCursor.style.backgroundImage = "url('/assets/images/MouseCursor1.png')";
          }
        });
  
        // Optional: Add a pressed (clicked) effect
        document.addEventListener('mousedown', () => {
          customCursor.classList.add('cursor--clicked');
        });
        document.addEventListener('mouseup', () => {
          customCursor.classList.remove('cursor--clicked');
        });
      }
    };
  
    /* ================================
       13. Audio Player Waveform (Placeholder)
    ================================ */
    const initAudioPlayers = () => {
      const audioPlayers = document.querySelectorAll('[data-audio-player]');
      if (audioPlayers.length) {
        audioPlayers.forEach(player => {
          const audio = player.querySelector('audio');
          const waveform = player.querySelector('[data-waveform]');
          if (audio && waveform) {
            // TODO: Implement audio waveform visualization using the Web Audio API.
            console.log('Audio player ready for waveform visualization:', audio);
          }
        });
      }
    };
  
    /* ================================
       14. Initialization Function
    ================================ */
    const init = () => {
      initGLightbox();
      initMobileMenuToggle();
      initSmoothScrolling();
      initBackToTop();
      initScrollReveal();
      initCustomCursor();
      initAudioPlayers();
      initScrollIndicatorClick();
      window.addEventListener('scroll', handleScroll);
    };
  
    // Run initialization
    init();
  });
  