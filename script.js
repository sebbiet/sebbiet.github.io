// Performance: Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Constants for magic numbers
const SCROLL_THRESHOLD = 50;
const HEADER_OFFSET = 80;
const SECTION_OFFSET = 100;
const DEBOUNCE_WAIT = 20;

// Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to light
let currentTheme = 'light';
try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        currentTheme = savedTheme;
    }
} catch (error) {
    console.error('Error accessing localStorage:', error);
}
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    try {
        const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update ARIA label
        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    try {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        
        // Update ARIA expanded
        hamburger.setAttribute('aria-expanded', isActive);
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = isActive ? 'rotate(45deg) translateY(8px)' : 'none';
        spans[1].style.opacity = isActive ? '0' : '1';
        spans[2].style.transform = isActive ? 'rotate(-45deg) translateY(-8px)' : 'none';
    } catch (error) {
        console.error('Error toggling navigation:', error);
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        try {
            // Close mobile menu if open
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            hamburger.setAttribute('aria-expanded', 'false');
            
            // Smooth scroll to target
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            console.error('Error during smooth scroll:', error);
        }
    });
});

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function highlightActiveSection() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - SECTION_OFFSET;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Debounced scroll handler for better performance
const debouncedHighlight = debounce(highlightActiveSection, DEBOUNCE_WAIT);
window.addEventListener('scroll', debouncedHighlight, { passive: true });

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');

const handleNavbarScroll = () => {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    navbar.style.boxShadow = scrolled ? '0 2px 10px var(--shadow)' : '0 2px 4px var(--shadow)';
};

const debouncedNavbarScroll = debounce(handleNavbarScroll, DEBOUNCE_WAIT);
window.addEventListener('scroll', debouncedNavbarScroll, { passive: true });

// Fade In Animation on Scroll
const fadeElements = document.querySelectorAll('.timeline-item, .project-card, .contact-item');

const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

// Check if IntersectionObserver is supported
if ('IntersectionObserver' in window) {
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        appearOnScroll.observe(element);
    });
} else {
    // Fallback for browsers without IntersectionObserver
    fadeElements.forEach(element => {
        element.style.opacity = '1';
    });
}

// Initialize navigation state on load
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveSection();
    handleNavbarScroll();
});