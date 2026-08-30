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
// Theme is initialised by the inline script in <head> (avoids a flash of
// the wrong theme). Just read whatever it already set on <html> here.
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    try {
        const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update ARIA label
        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');

        // Track theme toggle
        sendGAEvent('theme_toggle', {
            'theme_selected': theme,
            'event_category': 'user_preferences',
            'event_label': theme
        });
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

        // Track mobile menu toggle
        sendGAEvent('mobile_menu_toggle', {
            'menu_action': isActive ? 'open' : 'close',
            'event_category': 'navigation',
            'event_label': isActive ? 'menu_opened' : 'menu_closed'
        });
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
// Only sections with an id can match a nav link. Sections without one (the
// proof band) must not wipe the active state as they scroll past.
const sections = document.querySelectorAll('section[id]');
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
    navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
};

const debouncedNavbarScroll = debounce(handleNavbarScroll, DEBOUNCE_WAIT);
window.addEventListener('scroll', debouncedNavbarScroll, { passive: true });

// Scroll Reveal
// One mechanism for the whole page. The hidden start state lives in CSS under
// `.js [data-reveal]`, and `.js` is only ever set by the inline head script, so
// with JavaScript disabled nothing is hidden in the first place. If
// IntersectionObserver is missing we simply reveal everything immediately.
const revealElements = document.querySelectorAll('[data-reveal]');

const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
};

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => revealObserver.observe(element));
} else {
    revealElements.forEach(element => element.classList.add('is-revealed'));
}

// Self-updating tenure counters
// The static HTML already contains a correct value (for crawlers and
// no-JS visitors) - this just keeps it accurate as years pass.
function updateYearCounts() {
    document.querySelectorAll('.js-years').forEach(el => {
        const since = parseInt(el.getAttribute('data-since'), 10);
        if (!isNaN(since)) {
            el.textContent = new Date().getFullYear() - since;
        }
    });
}

// Initialize navigation state on load
document.addEventListener('DOMContentLoaded', () => {
    highlightActiveSection();
    handleNavbarScroll();
    updateYearCounts();
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
        } else if (url.includes('asbestoslist.com')) {
            linkType = 'asbestoslist';
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