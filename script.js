// Initialize Lucide Icons
lucide.createIcons();

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('nav-glass');
    } else {
        navbar.classList.remove('nav-glass');
    }
    
    lastScroll = currentScroll;
});

// Modal Functions
function openModal() {
    const modal = document.getElementById('quoteModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Re-initialize icons in modal
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('quoteModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Form Submission
const QUOTE_RECIPIENT_EMAIL = 'freddie.thecreator@gmail.com';
const EMAILJS_SERVICE_ID = 'service_ir9fzqf';
const EMAILJS_TEMPLATE_ID = 'template_zuwa5id';
const EMAILJS_PUBLIC_KEY = '5q0NN3w935pxFTiTU';
let isEmailJsInitialized = false;

document.getElementById('quoteForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        poolType: document.getElementById('poolType').value,
        coverType: document.getElementById('coverType').value
    };
    
    const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        pool_type: formData.poolType,
        cover_type: formData.coverType,
        to_email: QUOTE_RECIPIENT_EMAIL
    };

    // Add loading state
    submitBtn.classList.add('loading');
    submitBtn.innerText = 'Sending...';
    
    try {
        const canUseEmailJs =
            typeof window.emailjs !== 'undefined' &&
            EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
            EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

        if (canUseEmailJs) {
            if (!isEmailJsInitialized) {
                emailjs.init(EMAILJS_PUBLIC_KEY);
                isEmailJsInitialized = true;
            }
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        } else {
            // Fallback to a pre-filled email draft
            const subject = encodeURIComponent(`New Quote Request - ${formData.name}`);
            const body = encodeURIComponent(
                [
                    'A new quote request was submitted:',
                    '',
                    `Name: ${formData.name}`,
                    `Email: ${formData.email}`,
                    `Phone: ${formData.phone}`,
                    `Pool Type: ${formData.poolType}`,
                    `Interested In: ${formData.coverType}`
                ].join('\n')
            );
            window.location.href = `mailto:${QUOTE_RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
        }

        // Success state
        submitBtn.classList.remove('loading');
        submitBtn.innerText = 'Quote Requested!';
        submitBtn.classList.remove('bg-cyan-600', 'hover:bg-cyan-700');
        submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        
        // Reset form after delay
        setTimeout(() => {
            this.reset();
            submitBtn.innerText = originalText;
            submitBtn.classList.add('bg-cyan-600', 'hover:bg-cyan-700');
            submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
            closeModal();
            
            // Show success alert (in production, use a proper toast)
            alert('Thank you! Our team will contact you within 24 hours.');
        }, 1500);
    } catch (error) {
        console.error('Quote request failed:', error);
        submitBtn.classList.remove('loading');
        submitBtn.innerText = originalText;
        alert('Something went wrong while sending your request. Please try again.');
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.service-card, .stat-item');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    
    revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            document.getElementById('mobile-menu').classList.add('hidden');
        }
    });
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.relative img');
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter Animation for Stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 30);
};

// Intersection Observer for Stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statElements = entry.target.querySelectorAll('.text-4xl');
            statElements.forEach(stat => {
                const text = stat.textContent;
                const num = parseInt(text);
                if (!isNaN(num)) {
                    stat.textContent = '0';
                    setTimeout(() => animateCounter(stat, num), 100);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stat-item')?.parentElement?.parentElement;
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    
    // Add reveal class to elements
    document.querySelectorAll('.service-card, .stat-item').forEach(el => {
        el.classList.add('reveal');
    });
});
