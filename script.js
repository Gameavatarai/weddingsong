// Background Music Setup
document.addEventListener('DOMContentLoaded', function() {
    // Initialize background music
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        // Set volume to 7%
        backgroundMusic.volume = 0.07;
        
        // Try to play background music automatically
        const playBackgroundMusic = function() {
            // Unmute the audio (it's initially muted to help with autoplay)
            backgroundMusic.muted = false;
            
            // Try to play the audio
            backgroundMusic.play().catch(function(error) {
                console.log("Background music autoplay prevented by browser:", error);
                
                // If autoplay fails, we'll play on first user interaction
                document.addEventListener('click', function onFirstInteraction() {
                    backgroundMusic.play();
                    document.removeEventListener('click', onFirstInteraction);
                }, { once: true });
            });
        };
        
        // Try to play immediately
        playBackgroundMusic();
        
        // Also try to play when the window loads completely
        window.addEventListener('load', playBackgroundMusic);
    }
});

// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const elementsToTranslate = document.querySelectorAll('[data-en][data-de]');
    
    // Set initial language based on browser preference or default to English
    let currentLang = localStorage.getItem('language') || 
                     (navigator.language.startsWith('de') ? 'de' : 'en');
    
    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Update all translatable elements
        elementsToTranslate.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
        
        // Update active button state for both desktop and mobile buttons
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            // Handle both desktop (lang-en, lang-de) and mobile (lang-en-mobile, lang-de-mobile) buttons
            if (btn.id === `lang-${lang}` || btn.id === `lang-${lang}-mobile`) {
                btn.classList.add('active');
            }
        });
        
        // Update document language
        document.documentElement.lang = lang;
    }
    
    // Add click event listeners to language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Extract language from id (handles both 'lang-en' and 'lang-en-mobile' formats)
            const lang = this.id.includes('-mobile') ? 
                        this.id.split('-')[1] : // For mobile buttons: lang-en-mobile -> en
                        this.id.split('-')[1];  // For desktop buttons: lang-en -> en
            updateLanguage(lang);
        });
    });
    
    // Initialize with current language
    updateLanguage(currentLang);
});

// Additional functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to header
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add animation on scroll for feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and steps
    document.querySelectorAll('.feature-card, .step, .pricing-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add click handlers for CTA buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Handle "Order Your Song" buttons - scroll to pricing section
            if (this.textContent.includes('Order Your Song') || this.textContent.includes('Bestellen Sie Ihr Lied') ||
                this.textContent.includes('Order Your Song Now') || this.textContent.includes('Bestellen Sie Ihr Lied jetzt')) {
                e.preventDefault();
                
                // Scroll to pricing section
                const pricingSection = document.getElementById('pricing');
                if (pricingSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = pricingSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // Handle other demo buttons
            else if (this.textContent.includes('Create') || this.textContent.includes('Erstellen') || 
                this.textContent.includes('Get Started') || this.textContent.includes('Loslegen') ||
                this.textContent.includes('Start Creating') || this.textContent.includes('Jetzt mit der Erstellung')) {
                e.preventDefault();
                
                // Show a simple alert for demo purposes
                const message = currentLang === 'en' 
                    ? 'Thank you for your interest! This would redirect to the song creation process.'
                    : 'Vielen Dank für Ihr Interesse! Dies würde zum Lied-Erstellungsprozess weiterleiten.';
                
                alert(message);
            } 
            // Handle "Listen to Samples" buttons
            else if (this.textContent.includes('Listen') || this.textContent.includes('Hören')) {
                e.preventDefault();
                
                // Show the audio player
                const audioPlayerContainer = document.getElementById('audio-player-container');
                const audioElement = document.getElementById('sample-audio');
                
                if (audioPlayerContainer && audioElement) {
                    audioPlayerContainer.classList.add('active');
                    audioElement.play();
                }
            }
        });
    });
    
    // Mobile menu toggle functionality
    const setupMobileMenu = () => {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            // Toggle mobile menu
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
            });
            
            // Close mobile menu when clicking on a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('mobile-active');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('mobile-active');
                }
            });
        }
    };
    
    // Initialize mobile menu
    setupMobileMenu();
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
});

// Set up audio player functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up close button for audio player
    const closePlayerBtn = document.getElementById('close-player');
    const audioPlayerContainer = document.getElementById('audio-player-container');
    const audioElement = document.getElementById('sample-audio');
    const backgroundMusic = document.getElementById('background-music');
    
    // Function to resume background music
    const resumeBackgroundMusic = function() {
        if (backgroundMusic && !backgroundMusic.paused) {
            return; // Already playing
        }
        
        if (backgroundMusic) {
            backgroundMusic.play().catch(function(error) {
                console.log("Could not resume background music:", error);
            });
        }
    };
    
    // Function to pause background music
    const pauseBackgroundMusic = function() {
        if (backgroundMusic && !backgroundMusic.paused) {
            backgroundMusic.pause();
        }
    };
    
    if (closePlayerBtn && audioPlayerContainer && audioElement) {
        // When sample audio ends, resume background music
        audioElement.addEventListener('ended', function() {
            resumeBackgroundMusic();
        });
        
        // When sample audio starts playing, pause background music
        audioElement.addEventListener('play', function() {
            pauseBackgroundMusic();
        });
        
        // Close button handler
        closePlayerBtn.addEventListener('click', function() {
            audioPlayerContainer.classList.remove('active');
            audioElement.pause();
            audioElement.currentTime = 0;
            resumeBackgroundMusic();
        });
        
        // Also close when clicking outside the player
        audioPlayerContainer.addEventListener('click', function(e) {
            if (e.target === audioPlayerContainer) {
                audioPlayerContainer.classList.remove('active');
                audioElement.pause();
                audioElement.currentTime = 0;
                resumeBackgroundMusic();
            }
        });
        
        // Listen for ESC key to close player
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && audioPlayerContainer.classList.contains('active')) {
                audioPlayerContainer.classList.remove('active');
                audioElement.pause();
                audioElement.currentTime = 0;
                resumeBackgroundMusic();
            }
        });
    }
    
    // Add direct click handler for the Listen to Samples button
    const listenSamplesBtn = document.getElementById('listen-samples-btn');
    if (listenSamplesBtn && audioPlayerContainer && audioElement) {
        listenSamplesBtn.addEventListener('click', function() {
            audioPlayerContainer.classList.add('active');
            pauseBackgroundMusic();
            audioElement.play();
        });
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to music notes
    const musicNotes = document.querySelector('.music-notes');
    if (musicNotes) {
        musicNotes.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(10deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        musicNotes.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // Add particle effect to hero section (simple version)
    const hero = document.querySelector('.hero');
    if (hero) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'rgba(255, 255, 255, 0.3)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 2 + 's';
            hero.appendChild(particle);
        }
    }
    
    // Set up pricing policy popup
    const pricingPolicyLink = document.getElementById('pricing-policy-link');
    const pricingPolicyPopup = document.getElementById('pricing-policy-popup');
    const closePricingPolicy = document.getElementById('close-pricing-policy');
    
    if (pricingPolicyLink && pricingPolicyPopup && closePricingPolicy) {
        // Open popup when clicking the link
        pricingPolicyLink.addEventListener('click', function(e) {
            e.preventDefault();
            pricingPolicyPopup.classList.add('active');
        });
        
        // Close popup when clicking the close button
        closePricingPolicy.addEventListener('click', function() {
            pricingPolicyPopup.classList.remove('active');
        });
        
        // Close popup when clicking outside the content
        pricingPolicyPopup.addEventListener('click', function(e) {
            if (e.target === pricingPolicyPopup) {
                pricingPolicyPopup.classList.remove('active');
            }
        });
        
        // Close popup when pressing ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && pricingPolicyPopup.classList.contains('active')) {
                pricingPolicyPopup.classList.remove('active');
            }
        });
    }
    
    // Set up contact form popup
    const contactUsLinks = document.querySelectorAll('a[data-en="Contact Us"], a[data-de="Kontaktieren Sie uns"]');
    const contactFormPopup = document.getElementById('contact-form-popup');
    const closeContactForm = document.getElementById('close-contact-form');
    
    if (contactUsLinks.length > 0 && contactFormPopup && closeContactForm) {
        // Open popup when clicking any Contact Us link
        contactUsLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                contactFormPopup.classList.add('active');
            });
        });
        
        // Close popup when clicking the close button
        closeContactForm.addEventListener('click', function() {
            contactFormPopup.classList.remove('active');
        });
        
        // Close popup when clicking outside the content
        contactFormPopup.addEventListener('click', function(e) {
            if (e.target === contactFormPopup) {
                contactFormPopup.classList.remove('active');
            }
        });
        
        // Close popup when pressing ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && contactFormPopup.classList.contains('active')) {
                contactFormPopup.classList.remove('active');
            }
        });
    }
    
    // Set up cookie consent popup
    const cookieConsentPopup = document.getElementById('cookie-consent-popup');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const declineCookiesBtn = document.getElementById('decline-cookies');
    
    if (cookieConsentPopup && acceptCookiesBtn && declineCookiesBtn) {
        // Check if user has already made a choice
        const cookieConsent = localStorage.getItem('cookieConsent');
        
        if (!cookieConsent) {
            // Show popup after a short delay to ensure page is loaded
            setTimeout(() => {
                cookieConsentPopup.classList.add('active');
            }, 1000);
        } else {
            // Hide popup if user has already made a choice
            cookieConsentPopup.classList.remove('active');
        }
        
        // Handle accept cookies
        acceptCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsentPopup.classList.remove('active');
            
            // Here you can add code to enable analytics, tracking, etc.
            console.log('Cookies accepted');
        });
        
        // Handle decline cookies
        declineCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            cookieConsentPopup.classList.remove('active');
            
            // Here you can add code to disable analytics, tracking, etc.
            console.log('Cookies declined');
        });
    }
});
