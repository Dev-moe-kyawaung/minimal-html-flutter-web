// ==========================================
// TYPING EFFECT
// ==========================================

const titles = [
    'Android Developer @ Microsoft',
    'Full-Stack Engineer',
    'AWS Solutions Architect',
    'Kotlin Specialist',
    'UI/UX Enthusiast',
    'Cloud Native Developer'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector('.hero-subtitle');
const typingSpeed = 60;
const deletingSpeed = 30;
const delayBeforeDelete = 2000;

function typeEffect() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }
    
    typingElement.textContent = currentTitle.substring(0, charIndex);
    
    let delay = isDeleting ? deletingSpeed : typingSpeed;
    
    if (!isDeleting && charIndex === currentTitle.length) {
        delay = delayBeforeDelete;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        delay = typingSpeed;
    }
    
    setTimeout(typeEffect, delay);
}

// Start typing when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', typeEffect);
} else {
    typeEffect();
}

// ==========================================
// NAVIGATION & MOBILE MENU
// ==========================================

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', 
        navToggle.classList.contains('active') ? 'true' : 'false'
    );
}

navToggle?.addEventListener('click', toggleMobileMenu);

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

// ==========================================
// SKILLS TABS
// ==========================================

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        // Remove active class from all
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        document.getElementById(tabName).classList.add('active');
    });
});

// Keyboard navigation for tabs
tabButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
        let targetIndex = index;
        
        if (e.key === 'ArrowLeft') {
            targetIndex = index === 0 ? tabButtons.length - 1 : index - 1;
        } else if (e.key === 'ArrowRight') {
            targetIndex = index === tabButtons.length - 1 ? 0 : index + 1;
        } else {
            return;
        }
        
        e.preventDefault();
        tabButtons[targetIndex].click();
        tabButtons[targetIndex].focus();
    });
});

// ==========================================
// SMOOTH SCROLLING & ANIMATION ON SCROLL
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.skill-card, .project-card, .cert-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ==========================================
// SKILL PROGRESS ANIMATION
// ==========================================

let animatedSkills = false;

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedSkills) {
                animatedSkills = true;
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = 'progressBar 1.5s ease-out';
        }, index * 100);
    });
}

// ==========================================
// CONTACT FORM
// ==========================================

const contactForm = document.getElementById('contactForm');
const formStatus = document.querySelector('.form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        try {
            // Using Formspree or similar service
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showFormStatus('✓ Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            showFormStatus('✗ Failed to send message. Please try again or contact me directly.', 'error');
            console.error('Form error:', error);
        }
    });
}

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 5000);
    }
}

// ==========================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// NAVBAR ACTIVE STATE
// ==========================================

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ==========================================
// LAZY LOADING IMAGES
// ==========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, { threshold: 0.01 });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// PERFORMANCE: PREFETCH RESOURCES
// ==========================================

function addPrefetch() {
    const resources = [
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ];
    
    resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = resource.rel;
        link.href = resource.href;
        if (resource.crossorigin) {
            link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
    });
}

addPrefetch();

// ==========================================
// PWA SERVICE WORKER REGISTRATION
// ==========================================

if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then(registration => {
                console.log('✓ Service Worker registered');
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// ==========================================
// PERFORMANCE MONITORING
// ==========================================

if ('PerformanceObserver' in window) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
            }
        });
        
        observer.observe({ 
            entryTypes: ['measure', 'navigation'] 
        });
    } catch (e) {
        // Performance Observer not supported
    }
}

// ==========================================
// ANALYTICS (Optional - Replace with your code)
// ==========================================

// Track page views
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href,
            'page_path': window.location.pathname
        });
    }
}

document.addEventListener('DOMContentLoaded', trackPageView);

console.log('🚀 Portfolio loaded successfully! Version 1.0.0');
console.log('📧 Contact: moekyawaung@engineer.com');
console.log('🔗 GitHub: https://github.com/Moe-KyawAung');
