// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    /* ---------------------------
       1. Initialize GLightbox
    --------------------------- */
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

    /* ---------------------------
       2. Mobile Menu Toggle
    --------------------------- */
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active'); // Optional: Change icon when active
        });

        // Allow menu toggle via keyboard for accessibility
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            }
        });
    } else {
        console.warn('Menu toggle or navigation menu not found.');
    }

    /* ---------------------------
       3. Smooth Scrolling for Navigation Links
    --------------------------- */
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerOffset = 80; // Height of the fixed header
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close the nav menu on mobile after clicking
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            } else {
                console.warn(`Target section #${targetId} not found.`);
            }
        });
    });

    /* ---------------------------
       4. Scroll-Based Header Class Toggling
    --------------------------- */
    const header = document.querySelector('header');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) { // Threshold to add 'scrolled' class
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    } else {
        console.warn('Header not found.');
    }

    /* ---------------------------
       5. Back to Top Button Functionality
    --------------------------- */
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Show after scrolling down 300px
                backToTopButton.style.display = 'block';
                backToTopButton.style.opacity = '1';
            } else {
                backToTopButton.style.display = 'none';
                backToTopButton.style.opacity = '0';
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.warn('Back to Top button not found.');
    }

    /* ---------------------------
       6. Scroll Reveal Animations
    --------------------------- */
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
                    observer.unobserve(entry.target); // Stop observing after reveal
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            revealOnScroll.observe(element);
        });
    } else {
        // Fallback for browsers that do not support Intersection Observer
        revealElements.forEach(element => {
            element.classList.add('in-view');
        });
    }

    /* ---------------------------
       7. Optional: Initialize Parallax Effects
    --------------------------- */
    // Uncomment and modify if using Parallax.js
    /*
    const parallaxSections = document.querySelectorAll('.parallax');
    parallaxSections.forEach(section => {
        new Parallax(section);
    });
    */

    /* ---------------------------
       8. Accessibility Enhancements
    --------------------------- */
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && menuToggle && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });

    /* ---------------------------
       9. Active Link Highlighting
    --------------------------- */
    const sections = document.querySelectorAll('.section');
    const navLinkArray = Array.from(navLinks);

    if (sections.length && navLinkArray.length) {
        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    /* ---------------------------
       10. Form Submission Feedback
    --------------------------- */
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Implement form submission logic (e.g., AJAX)
            // For demonstration, we'll show an alert and reset the form
            alert('Thank you for your message!');
            contactForm.reset();
        });
    } else {
        console.warn('Contact form not found.');
    }
});
