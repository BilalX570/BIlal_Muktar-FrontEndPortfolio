// DOM Elements
const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const form = document.getElementById('contactForm');
const backToTop = document.querySelector('.back-to-top');

// Typing animation variables
const typedTextSpan = document.querySelector('.typed-text');
const cursorSpan = document.querySelector('.cursor');
const textArray = ['fast websites.', 'responsive UIs.', 'clean code.', 'great experiences.'];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 1500;
let textArrayIndex = 0;
let charIndex = 0;

// Back-to-top visibility
window.addEventListener('scroll', () => {
    if (!backToTop) return;
    backToTop.style.display = window.scrollY > 500 ? 'flex' : 'none';
});

// Sidebar toggle (mobile)
if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('is-open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
            sidebar.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// Close sidebar when clicking on a link (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (sidebar && sidebar.classList.contains('is-open')) {
            sidebar.classList.remove('is-open');
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});

// Typing animation function
function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains('typing')) {
            cursorSpan.classList.add('typing');
        }
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove('typing');
        setTimeout(erase, newTextDelay);
    }
}

// Erasing animation function
function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains('typing')) {
            cursorSpan.classList.add('typing');
        }
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove('typing');
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) {
            textArrayIndex = 0;
        }
        setTimeout(type, typingDelay + 1000);
    }
}

// Start typing animation on DOM load
document.addEventListener('DOMContentLoaded', () => {
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});

// Form validation
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;
    
    // Reset error states
    name.style.borderColor = '#ddd';
    email.style.borderColor = '#ddd';
    message.style.borderColor = '#ddd';
    
    // Validate name
    if (!name.value.trim()) {
        name.style.borderColor = 'red';
        isValid = false;
    }
    
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        email.style.borderColor = 'red';
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        message.style.borderColor = 'red';
        isValid = false;
    }
    
    if (isValid) {
        // In a real application, you would send the form data to a server here
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
    }
});

// Smooth scrolling for navigation links (no top navbar offset now)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-category, .project-card, .about-content, .contact-content, .timeline-item').forEach(el => {
    observer.observe(el);
});