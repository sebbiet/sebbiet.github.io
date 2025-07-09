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

// Timeline Animation on Scroll - Enhanced for AOS-like behavior
const timelineItems = document.querySelectorAll('.timeline-item[data-aos="fade-up"]');

const timelineOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const timelineObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
        }
    });
}, timelineOptions);

// Apply observer to timeline items
if ('IntersectionObserver' in window) {
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
} else {
    // Fallback - show all items
    timelineItems.forEach(item => {
        item.classList.add('aos-animate');
    });
}

// Initialize navigation state on load
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveSection();
    handleNavbarScroll();
});

// Google Analytics Event Tracking
// Helper function to send GA events
function sendGAEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

// Track navigation clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const section = this.getAttribute('href').replace('#', '');
        sendGAEvent('navigation_click', {
            'navigation_section': section,
            'event_category': 'navigation',
            'event_label': section
        });
    });
});

// Track theme toggle
themeToggle.addEventListener('click', () => {
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    sendGAEvent('theme_toggle', {
        'theme_selected': newTheme,
        'event_category': 'user_preferences',
        'event_label': newTheme
    });
});

// Track mobile menu toggle
hamburger.addEventListener('click', () => {
    const isOpening = !navMenu.classList.contains('active');
    sendGAEvent('mobile_menu_toggle', {
        'menu_action': isOpening ? 'open' : 'close',
        'event_category': 'navigation',
        'event_label': isOpening ? 'menu_opened' : 'menu_closed'
    });
});

// Track external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        const url = this.getAttribute('href');
        let linkType = 'external';
        
        if (url.includes('linkedin.com')) {
            linkType = 'linkedin';
        } else if (url.includes('x.com') || url.includes('twitter.com')) {
            linkType = 'twitter';
        } else if (url.includes('.pdf')) {
            linkType = 'resume_download';
        } else if (url.includes('octfolio.com')) {
            linkType = 'octfolio';
        } else if (url.includes('meetnomics.com')) {
            linkType = 'meetnomics';
        }
        
        sendGAEvent('external_link_click', {
            'link_url': url,
            'link_type': linkType,
            'event_category': 'outbound',
            'event_label': linkType
        });
    });
});

// Track CTA button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        const buttonClass = this.classList.contains('btn-primary') ? 'primary' : 'secondary';
        const section = this.closest('section')?.getAttribute('id') || 'unknown';
        
        sendGAEvent('cta_click', {
            'button_text': buttonText,
            'button_type': buttonClass,
            'section': section,
            'event_category': 'engagement',
            'event_label': `${section}_${buttonText.toLowerCase().replace(/\s+/g, '_')}`
        });
    });
});

// Scroll depth tracking
let scrollDepthMarks = {
    25: false,
    50: false,
    75: false,
    90: false,
    100: false
};

function trackScrollDepth() {
    const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
    
    Object.keys(scrollDepthMarks).forEach(mark => {
        if (scrollPercent >= parseInt(mark) && !scrollDepthMarks[mark]) {
            scrollDepthMarks[mark] = true;
            sendGAEvent('scroll_depth', {
                'percent_scrolled': mark,
                'event_category': 'engagement',
                'event_label': `${mark}_percent`
            });
        }
    });
}

// Debounced scroll depth tracking
const debouncedScrollDepth = debounce(trackScrollDepth, 250);
window.addEventListener('scroll', debouncedScrollDepth, { passive: true });

// Track time on page milestones
const timeMarks = [30, 60, 120, 300]; // seconds
let timeMarkIndex = 0;

function trackTimeOnPage() {
    if (timeMarkIndex < timeMarks.length) {
        sendGAEvent('time_on_page', {
            'seconds': timeMarks[timeMarkIndex],
            'event_category': 'engagement',
            'event_label': `${timeMarks[timeMarkIndex]}_seconds`
        });
        timeMarkIndex++;
        
        if (timeMarkIndex < timeMarks.length) {
            setTimeout(trackTimeOnPage, (timeMarks[timeMarkIndex] - timeMarks[timeMarkIndex - 1]) * 1000);
        }
    }
}

// Start time tracking after 30 seconds
setTimeout(trackTimeOnPage, 30000);

// Track section visibility
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            sendGAEvent('section_view', {
                'section_name': sectionId,
                'event_category': 'engagement',
                'event_label': sectionId
            });
            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe all main sections
document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});