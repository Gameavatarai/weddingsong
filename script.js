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
    const elementsWithLang = document.querySelectorAll('[data-en][data-de]');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Set default language
    let currentLang = 'en';
    
    // Initialize language
    updateLanguage(currentLang);
    
    // Handle active navigation state
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(pageYOffset >= (sectionTop - sectionHeight/3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Add event listeners to language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.id.split('-')[1]; // Extract 'en' or 'de' from 'lang-en' or 'lang-de'
            
            if (selectedLang !== currentLang) {
                currentLang = selectedLang;
                updateLanguage(currentLang);
                updateActiveButton(this);
            }
        });
    });
    
    function updateLanguage(lang) {
        // Add fade transition
        document.body.classList.add('fade-transition');
        
        setTimeout(() => {
            // Update all elements with language data attributes
            elementsWithLang.forEach(element => {
                const text = element.getAttribute(`data-${lang}`);
                if (text) {
                    element.textContent = text;
                }
            });
            
            // Update document title
            const titleElement = document.querySelector('title');
            if (titleElement) {
                const titleText = titleElement.getAttribute(`data-${lang}`);
                if (titleText) {
                    titleElement.textContent = titleText;
                }
            }
            
            // Update HTML lang attribute
            document.documentElement.lang = lang;
            
            // Remove fade transition
            document.body.classList.remove('fade-transition');
            document.body.classList.add('active');
            
            // Store language preference
            localStorage.setItem('preferredLanguage', lang);
        }, 150);
    }
    
    function updateActiveButton(activeButton) {
        // Remove active class from all buttons
        langButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        activeButton.classList.add('active');
    }
    
    // Check for stored language preference
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && (storedLang === 'en' || storedLang === 'de')) {
        currentLang = storedLang;
        updateLanguage(currentLang);
        
        // Update active button
        const activeButton = document.getElementById(`lang-${currentLang}`);
        if (activeButton) {
            updateActiveButton(activeButton);
        }
    }
    
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
    
    // Add click handlers for CTA buttons (placeholder functionality)
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default for demo purposes
            if (this.textContent.includes('Create') || this.textContent.includes('Erstellen') || 
                this.textContent.includes('Get Started') || this.textContent.includes('Loslegen') ||
                this.textContent.includes('Start Creating') || this.textContent.includes('Jetzt mit der Erstellung')) {
                e.preventDefault();
                
                // Show a simple alert for demo purposes
                const message = currentLang === 'en' 
                    ? 'Thank you for your interest! This would redirect to the song creation process.'
                    : 'Vielen Dank für Ihr Interesse! Dies würde zum Lied-Erstellungsprozess weiterleiten.';
                
                alert(message);
            } else if (this.textContent.includes('Listen') || this.textContent.includes('Hören')) {
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
    
    // Add mobile menu toggle (for future enhancement)
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav');
        const navLinks = document.querySelector('.nav-links');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.display = 'none';
        mobileMenuBtn.style.background = 'none';
        mobileMenuBtn.style.border = 'none';
        mobileMenuBtn.style.fontSize = '1.5rem';
        mobileMenuBtn.style.color = '#333';
        mobileMenuBtn.style.cursor = 'pointer';
        
        nav.appendChild(mobileMenuBtn);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
        });
        
        // Show/hide mobile menu button based on screen size
        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
                navLinks.style.display = navLinks.classList.contains('mobile-active') ? 'flex' : 'none';
            } else {
                mobileMenuBtn.style.display = 'none';
                navLinks.style.display = 'flex';
                navLinks.classList.remove('mobile-active');
            }
        };
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    };
    
    // Initialize mobile menu
    createMobileMenu();
    
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
