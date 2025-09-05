// Main initialization when the page loads
window.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
    
    // Initialize mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Initialize all effects
    initScrollAnimations();
    initHoverEffects();
    initScrollToSections();
    animateStats();
    
    // Initialize Three.js scene if available
    if (typeof initThreeScene === 'function') {
        initThreeScene();
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.transform = 'translateY(0)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else if (currentScroll < lastScroll) {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
    
    lastScroll = currentScroll;
});

// Add shadow to navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Scroll Animations
function initScrollAnimations() {
    // Add parallax effect to hero elements
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 50;
            const y = (window.innerHeight / 2 - e.pageY) / 50;
            
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
    
    // Smooth scroll for anchor links
    function initScrollToSections() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Animate stats counter
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const count = parseInt(target.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const step = count / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCount = () => {
                        current += step;
                        if (current < count) {
                            target.textContent = Math.ceil(current);
                            requestAnimationFrame(updateCount);
                        } else {
                            target.textContent = count;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    // Scroll indicator animation
    const scrollIndicator = document.querySelector('.scroll-icon span');
    if (scrollIndicator) {
        setInterval(() => {
            scrollIndicator.style.opacity = '0.5';
            setTimeout(() => {
                scrollIndicator.style.opacity = '1';
            }, 500);
        }, 1500);
    }
}

// 3D Hover Effects
function initHoverEffects() {
    // Add 3D hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            button.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-3px)`;
            
            // Parallax effect for the button's shadow
            const shadowX = (x - centerX) / 20;
            const shadowY = (y - centerY) / 20;
            button.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(106, 13, 173, 0.5)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            button.style.boxShadow = '0 5px 15px rgba(106, 13, 173, 0.3)';
        });
    });
    
    // Add 3D hover effect to features
    const features = document.querySelectorAll('.feature');
    
    features.forEach(feature => {
        feature.addEventListener('mousemove', (e) => {
            const rect = feature.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            feature.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
            feature.style.boxShadow = '0 15px 30px rgba(106, 13, 173, 0.4)';
        });
        
        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            feature.style.boxShadow = '0 5px 15px rgba(106, 13, 173, 0.2)';
        });
    });
}

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature, .section-title, .join-text');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animation
window.addEventListener('DOMContentLoaded', () => {
    const features = document.querySelectorAll('.feature');
    const sectionTitles = document.querySelectorAll('.section-title');
    const joinText = document.querySelector('.join-text');
    
    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px)';
        feature.style.transition = 'all 0.6s ease-out';
    });
    
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';
        title.style.transition = 'all 0.6s ease-out';
    });
    
    if (joinText) {
        joinText.style.opacity = '0';
        joinText.style.transform = 'translateY(20px)';
        joinText.style.transition = 'all 0.6s ease-out';
    }
    
    // Initial check
    setTimeout(animateOnScroll, 100);
});

window.addEventListener('scroll', animateOnScroll);

// Add hover effect to buttons
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const x = e.pageX - this.offsetLeft;
        const y = e.pageY - this.offsetTop;
        
        const ripples = document.createElement('span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        this.appendChild(ripples);
        
        setTimeout(() => {
            ripples.remove();
        }, 1000);
    });
});
