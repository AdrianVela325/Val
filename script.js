// ============================================
// LOAD PICTURES FROM FOLDER
// ============================================

// Array to store picture filenames
let pictureFiles = [];

// Function to load pictures from /pictures folder
async function loadPicturesFromFolder() {
    try {
        // Hardcoded list of pictures for fully static site
        const pictures = [
            'IMG_20251223_013835_689.jpg',
            'IMG_20251223_200701_449.jpg',
            'IMG_20251223_202108_512.jpg',
            'IMG_20251223_205636_196.jpg',
            'IMG_20251224_110309_273.jpg',
            'IMG_20251224_110325_093.jpg',
            'IMG_20251224_110803_996.jpg',
            'IMG_20251224_182426_026.jpg',
            'IMG_20251224_183914_820.jpg',
            'IMG_20251225_154548_6.jpg',
            'IMG_20251225_165547_295.jpg',
            'IMG_20251225_170107_717.jpg',
            'IMG_20251225_174359_374.jpg',
            'IMG_20251225_203422_057.jpg',
            'IMG_20251225_203521_774.jpg',
            'IMG_20251226_141256_769.jpg',
            'IMG_20251226_143052_472.jpg',
            'IMG_20251226_165733_4.jpg',
            'IMG_20251228_050406_271.jpg',
            'IMG_20251228_062809_819.jpg'
        ];

        // Create picture objects
        pictureFiles = pictures.map(pic => ({
            url: 'pictures/' + pic,
            title: pic.replace('.jpg', '').replace(/_/g, ' '),
            description: 'Memory from our moments together ❤️'
        }));

        console.log(`Loaded ${pictureFiles.length} pictures from hardcoded list`);
        populateCarousel();
        
    } catch (error) {
        console.error('Error loading pictures:', error);
    }
}

// Function to populate carousel with loaded pictures
function populateCarousel() {
    const carouselFrame = document.getElementById('carouselFrame');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    if (!carouselFrame || !indicatorsContainer) return;

    carouselFrame.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    pictureFiles.forEach((pic, index) => {
        // Create carousel card
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.setAttribute('data-index', index);
        card.innerHTML = `
            <div class="card-flip">
                <div class="card-front">
                    <img src="${pic.url}" alt="${pic.title}" loading="lazy">
                </div>
                <div class="card-back">
                    <div class="card-content">
                        <h3>${pic.title}</h3>
                        <p>${pic.description}</p>
                    </div>
                </div>
            </div>
        `;
        carouselFrame.appendChild(card);

        // Create indicator
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        indicator.setAttribute('data-index', index);
        if (index === 0) indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
    });

    // Update carousel card references after creating new elements
    carouselCards = document.querySelectorAll('.carousel-card');
    indicators = document.querySelectorAll('.indicator');
    
    // Setup event listeners for the new elements
    setupCarouselEventListeners();

    // Re-initialize carousel with new elements
    setTimeout(() => {
        initCarousel();
    }, 100);
}

// ============================================
// BACKGROUND MUSIC CONTROL
// ============================================

const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

if (musicToggle && bgMusic) {
    console.log('Music elements found');
    
    // Set initial volume to 50%
    bgMusic.volume = 0.5;
    console.log('Music volume set to 50%');
    
    // Autoplay with unmute on page load
    window.addEventListener('load', function() {
        console.log('Page loaded - unmuting and playing music');
        bgMusic.muted = false;
        bgMusic.currentTime = 0;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Music playing successfully');
                    musicToggle.classList.remove('muted');
                })
                .catch(error => {
                    console.error('Audio autoplay failed:', error);
                    console.log('Waiting for user interaction...');
                });
        }
    });

    // Handle audio errors
    bgMusic.addEventListener('error', function(e) {
        console.error('Audio error:', e);
        console.error('Error code:', bgMusic.error?.code);
        console.error('Error message:', bgMusic.error?.message);
    });

    // Fallback: Play music on first user interaction if autoplay failed
    document.addEventListener('click', function initMusic() {
        console.log('User clicked - attempting to play music');
        if (bgMusic.paused) {
            bgMusic.muted = false;
            bgMusic.play()
                .then(() => {
                    console.log('Music started after user click');
                    musicToggle.classList.remove('muted');
                })
                .catch(error => {
                    console.error('Music playback failed:', error);
                });
        }
        document.removeEventListener('click', initMusic);
    }, { once: true });

    // Toggle music on button click
    musicToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (bgMusic.paused) {
            console.log('Resuming music');
            bgMusic.muted = false;
            bgMusic.play()
                .then(() => {
                    musicToggle.classList.remove('muted');
                })
                .catch(error => {
                    console.error('Resume failed:', error);
                });
        } else {
            console.log('Pausing music');
            bgMusic.pause();
            musicToggle.classList.add('muted');
        }
    });
}

// ============================================
// INTERACTIVE ENVELOPE
// ============================================

const envelope = document.getElementById('envelope');
if (envelope) {
    envelope.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('open');
        
        // Add heart animation on open
        if (this.classList.contains('open')) {
            createHeartParticles(e);
        }
    });
}

// Create heart particles effect when opening envelope
function createHeartParticles(event) {
    const container = document.querySelector('.envelope-container');
    if (!container) return;
    
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    const envelope = document.querySelector('.envelope');
    const envelopeRect = envelope.getBoundingClientRect();
    
    // Center position for particle burst
    const centerX = envelopeRect.left + envelopeRect.width / 2;
    const centerY = envelopeRect.top + envelopeRect.height / 2;
    
    container.style.position = 'relative';
    
    // Create two bursts: left and right
    createParticleBurst(container, hearts, centerX, centerY, 'right');
    createParticleBurst(container, hearts, centerX, centerY, 'left');
}

// Helper function to create particle burst in specific direction
function createParticleBurst(container, hearts, centerX, centerY, direction) {
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 20 + 15}px;
            opacity: 1;
            pointer-events: none;
            z-index: 100;
        `;
        
        const startX = centerX;
        const startY = centerY;
        
        heart.style.left = startX + 'px';
        heart.style.top = startY + 'px';
        
        document.body.appendChild(heart);
        
        // Animate heart floating in direction and fading out
        let x = startX;
        let y = startY;
        
        // Determine velocity based on direction
        const directionMultiplier = direction === 'left' ? -1 : 1;
        const vx = directionMultiplier * (Math.random() * 3 + 2);
        const vy = Math.random() * -4 - 2;
        let opacity = 1;
        
        function animateHeart() {
            x += vx;
            y += vy;
            opacity -= 0.02;
            
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            heart.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateHeart);
            } else {
                heart.remove();
            }
        }
        
        animateHeart();
    }
}

// ============================================
// CARD FLIP CAROUSEL - AMAZING TRANSITIONS
// ============================================

let currentCardIndex = 0;
let autoPlayActive = true;
let autoPlayInterval = null;
const autoPlayDelay = 5000; // 5 seconds

// Get carousel elements
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const autoPlayToggle = document.getElementById('autoPlayToggle');
let carouselCards = document.querySelectorAll('.carousel-card');
let indicators = document.querySelectorAll('.indicator');

// Initialize carousel
function initCarousel() {
    if (carouselCards.length === 0) return;
    
    // Show first card
    carouselCards[0].classList.add('active');
    indicators[0].classList.add('active');
    
    // Start auto play by default
    startAutoPlay();
}

// Start auto play
function startAutoPlay() {
    if (!autoPlayActive || carouselCards.length <= 1) return;
    
    autoPlayInterval = setInterval(() => {
        nextCard();
    }, autoPlayDelay);
}

// Stop auto play
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Go to next card with flip animation
function nextCard() {
    const currentCard = carouselCards[currentCardIndex];
    currentCard.classList.add('prev');
    currentCard.classList.remove('active', 'flipped');
    
    currentCardIndex = (currentCardIndex + 1) % carouselCards.length;
    
    setTimeout(() => {
        carouselCards.forEach(card => card.classList.remove('next', 'prev'));
        const newCard = carouselCards[currentCardIndex];
        newCard.classList.add('next', 'active');
        updateIndicators();
    }, 300);
}

// Go to previous card with flip animation
function prevCard() {
    const currentCard = carouselCards[currentCardIndex];
    currentCard.classList.add('next');
    currentCard.classList.remove('active', 'flipped');
    
    currentCardIndex = (currentCardIndex - 1 + carouselCards.length) % carouselCards.length;
    
    setTimeout(() => {
        carouselCards.forEach(card => card.classList.remove('next', 'prev'));
        const newCard = carouselCards[currentCardIndex];
        newCard.classList.add('prev', 'active');
        updateIndicators();
    }, 300);
}

// Go to specific card by index
function goToCard(index) {
    if (index === currentCardIndex || index < 0 || index >= carouselCards.length) return;
    
    const currentCard = carouselCards[currentCardIndex];
    currentCard.classList.remove('active', 'flipped');
    
    if (index > currentCardIndex) {
        currentCard.classList.add('prev');
    } else {
        currentCard.classList.add('next');
    }
    
    currentCardIndex = index;
    
    setTimeout(() => {
        carouselCards.forEach(card => card.classList.remove('next', 'prev'));
        const newCard = carouselCards[currentCardIndex];
        newCard.classList.add('active');
        updateIndicators();
    }, 300);
}

// Update indicator dots
function updateIndicators() {
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentCardIndex);
    });
}

// Toggle card flip
function toggleCardFlip() {
    const card = carouselCards[currentCardIndex];
    card.classList.toggle('flipped');
}

// Button event listeners
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        nextCard();
        if (autoPlayActive) startAutoPlay();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        prevCard();
        if (autoPlayActive) startAutoPlay();
    });
}

// Auto play toggle
if (autoPlayToggle) {
    autoPlayToggle.addEventListener('change', (e) => {
        autoPlayActive = e.target.checked;
        if (autoPlayActive) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    });
}

// Initialize carousel event listeners
function setupCarouselEventListeners() {
    // Indicator click
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoPlay();
            goToCard(index);
            if (autoPlayActive) startAutoPlay();
        });
    });

    // Card click to flip
    carouselCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index === currentCardIndex) {
                toggleCardFlip();
            }
        });
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        stopAutoPlay();
        nextCard();
        if (autoPlayActive) startAutoPlay();
    } else if (e.key === 'ArrowLeft') {
        stopAutoPlay();
        prevCard();
        if (autoPlayActive) startAutoPlay();
    } else if (e.key === ' ') {
        e.preventDefault();
        toggleCardFlip();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPicturesFromFolder();
});

// ============================================
// MOBILE MENU AND OTHER INTERACTIONS
// ============================================

// Mobile Menu Toggle with animations
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        // Add animation
        navMenu.style.animation = 'slideInDown 0.3s ease-out';
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger?.classList.remove('active');
    });
});

// Smooth scrolling for anchor links with animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Add glow effect
            target.style.animation = 'glow 1s ease-out';
        }
    });
});

// Active nav link highlighting with smooth transition
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.animation = 'pulse 0.6s ease-out';
        }
    });
});

// Enhanced Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
            
            // Add ripple effect on portfolio items
            if (entry.target.classList.contains('portfolio-item')) {
                entry.target.style.animation = 'fadeInScale 0.6s ease-out';
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all portfolio items and testimonials
document.querySelectorAll('.portfolio-item, .testimonial-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
    observer.observe(element);
});

// Enhanced Form validation - REMOVED (personal portfolio only)
// Contact form functionality removed for personal use

// Helper function to show notifications
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.4s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.4s ease-in forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Helper function to animate shake effect
function animateShake(element) {
    element.style.animation = 'wobble 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = 'none';
    }, 500);
}

// Helper function to animate bounce effect
function animateBounce(element) {
    element.style.animation = 'bounce 0.6s ease-out';
    setTimeout(() => {
        element.style.animation = 'none';
    }, 600);
}

// Responsive video embedding
const videos = document.querySelectorAll('.portfolio-video video');
videos.forEach(video => {
    video.setAttribute('width', '100%');
    video.setAttribute('height', 'auto');
});

// Add click effects to portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.zIndex = '10';
    });
    item.addEventListener('mouseleave', () => {
        item.style.zIndex = 'auto';
    });
});


// Add click effects to testimonial stars - REMOVED (testimonials section deleted)

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.animation = 'fadeInScale 0.6s ease-out';
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger?.classList.remove('active');
    }
    
    // Add keyboard navigation for sections
    if (e.key === 'ArrowDown') {
        const nextSection = document.querySelector('section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Prevent flash of unstyled content
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
});

// Add parallax effect on scroll for floating hearts
window.addEventListener('scroll', () => {
    const floatingHearts = document.querySelectorAll('.floating-heart');
    floatingHearts.forEach((heart, index) => {
        const scrollPos = window.scrollY;
        const speed = 0.5 + (index * 0.1);
        heart.style.transform = `translateY(${scrollPos * speed}px)`;
    });
});

// Easter egg: click hearts multiple times for special effect
let heartClickCount = 0;
document.querySelectorAll('.heart').forEach(heart => {
    heart.addEventListener('click', () => {
        heartClickCount++;
        heart.style.animation = 'rotateIn 0.4s ease-out';
        
        if (heartClickCount >= 5) {
            showNotification('You have a loving heart! ❤️', 'success');
            heartClickCount = 0;
        }
    });
});
