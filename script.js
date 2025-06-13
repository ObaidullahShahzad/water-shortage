// Utility Functions
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

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    if (navbar) {
        const handleScroll = debounce(() => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10);

        window.addEventListener('scroll', handleScroll);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger counter animation if element has data-target
            const target = entry.target.querySelector('[data-target]');
            if (target) {
                animateCounter(target);
            }
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});

// Counter animation
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on target value
        let displayValue;
        if (target >= 1000000) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
            displayValue = (current / 1000).toFixed(1) + 'K';
        } else if (target % 1 !== 0) {
            displayValue = current.toFixed(1);
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = displayValue;
    }, 16);
}

// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('[data-category]');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Image modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.modal-close');

    if (modal) {
        // Add click listeners to all images in gallery
        const galleryImages = document.querySelectorAll('.gallery-section img, .wildlife-image img, .activism-image img, .success-image img');
        
        galleryImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                modal.style.display = 'block';
                modalImg.src = this.src;
                modalCaption.textContent = this.alt || this.closest('.wildlife-info, .activism-info, .success-info')?.querySelector('h3')?.textContent || '';
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', closeImageModal);
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeImageModal();
            }
        });
    }

    function closeImageModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const actionButtons = document.querySelectorAll('.action-btn');
    const actionModal = document.getElementById('actionModal');
    const modalBody = document.getElementById('modalBody');

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Show success message
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                
                // Reset button
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('Successfully subscribed to our newsletter!', 'success');
                this.reset();
            }
        });
    }

    // Action button modals
    if (actionButtons.length > 0 && actionModal) {
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                showActionModal(action);
            });
        });

        // Close modal
        const closeModal = actionModal.querySelector('.modal-close');
        if (closeModal) {
            closeModal.addEventListener('click', closeActionModal);
        }

        actionModal.addEventListener('click', function(e) {
            if (e.target === actionModal) {
                closeActionModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && actionModal.style.display === 'block') {
                closeActionModal();
            }
        });
    }

    function showActionModal(action) {
        const content = getModalContent(action);
        modalBody.innerHTML = content;
        actionModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeActionModal() {
        actionModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function getModalContent(action) {
        const contents = {
            donate: `
                <div class="modal-header">
                    <h2><i class="fas fa-heart"></i> Make a Donation</h2>
                    <p>Your contribution directly supports reforestation and water conservation projects worldwide.</p>
                </div>
                <div class="donation-options">
                    <div class="donation-amount">
                        <h3>Choose Your Impact:</h3>
                        <div class="amount-buttons">
                            <button class="amount-btn" data-amount="10">$10<br><small>Plant 10 trees</small></button>
                            <button class="amount-btn" data-amount="25">$25<br><small>Clean water for 1 family</small></button>
                            <button class="amount-btn" data-amount="50">$50<br><small>Protect 0.5 acres</small></button>
                            <button class="amount-btn" data-amount="100">$100<br><small>Protect 1 acre of forest</small></button>
                        </div>
                    </div>
                    <div class="custom-amount">
                        <label for="customAmount">Custom Amount:</label>
                        <input type="number" id="customAmount" placeholder="Enter amount" min="1">
                    </div>
                    <button class="btn btn-primary large" onclick="processDonation()">Donate Now</button>
                </div>
            `,
            volunteer: `
                <div class="modal-header">
                    <h2><i class="fas fa-hands-helping"></i> Volunteer With Us</h2>
                    <p>Join thousands of volunteers making a real difference in conservation efforts.</p>
                </div>
                <div class="volunteer-options">
                    <div class="volunteer-type">
                        <h3><i class="fas fa-seedling"></i> Tree Planting Events</h3>
                        <p>Join local tree planting initiatives in your area. Perfect for individuals, families, and groups.</p>
                        <button class="btn btn-secondary">Find Events Near Me</button>
                    </div>
                    <div class="volunteer-type">
                        <h3><i class="fas fa-tint"></i> Water Conservation Projects</h3>
                        <p>Help implement water-saving technologies and educate communities about conservation.</p>
                        <button class="btn btn-secondary">Learn More</button>
                    </div>
                    <div class="volunteer-type">
                        <h3><i class="fas fa-chalkboard-teacher"></i> Environmental Education</h3>
                        <p>Teach others about environmental issues and sustainable practices in schools and communities.</p>
                        <button class="btn btn-secondary">Get Involved</button>
                    </div>
                </div>
            `,
            advocate: `
                <div class="modal-header">
                    <h2><i class="fas fa-bullhorn"></i> Become an Advocate</h2>
                    <p>Use your voice to create change and influence policy for environmental protection.</p>
                </div>
                <div class="advocacy-actions">
                    <div class="advocacy-item">
                        <h3><i class="fab fa-facebook"></i> Social Media Campaign</h3>
                        <p>Share our content and spread awareness about water scarcity and deforestation.</p>
                        <div class="social-share">
                            <button class="btn btn-primary">Share on Facebook</button>
                            <button class="btn btn-primary">Share on Twitter</button>
                            <button class="btn btn-primary">Share on Instagram</button>
                        </div>
                    </div>
                    <div class="advocacy-item">
                        <h3><i class="fas fa-envelope"></i> Contact Representatives</h3>
                        <p>Reach out to your local and national representatives about environmental policies.</p>
                        <button class="btn btn-secondary">Find My Representatives</button>
                    </div>
                    <div class="advocacy-item">
                        <h3><i class="fas fa-calendar-alt"></i> Organize Local Events</h3>
                        <p>Host awareness events, film screenings, or educational workshops in your community.</p>
                        <button class="btn btn-secondary">Event Planning Guide</button>
                    </div>
                </div>
            `,
            partner: `
                <div class="modal-header">
                    <h2><i class="fas fa-handshake"></i> Corporate Partnership</h2>
                    <p>Partner with us to create meaningful environmental impact while achieving your sustainability goals.</p>
                </div>
                <div class="partnership-options">
                    <div class="partnership-tier">
                        <h3>Sustainability Programs</h3>
                        <ul>
                            <li>Carbon offset initiatives</li>
                            <li>Employee engagement programs</li>
                            <li>Sustainable supply chain consulting</li>
                            <li>Environmental impact reporting</li>
                        </ul>
                    </div>
                    <div class="partnership-tier">
                        <h3>Sponsorship Opportunities</h3>
                        <ul>
                            <li>Reforestation project sponsorship</li>
                            <li>Water conservation initiative funding</li>
                            <li>Educational program support</li>
                            <li>Research and development partnerships</li>
                        </ul>
                    </div>
                    <div class="contact-partnership">
                        <p>Ready to make a difference together?</p>
                        <button class="btn btn-primary large">Contact Partnership Team</button>
                    </div>
                </div>
            `
        };

        return contents[action] || '<p>Content not available.</p>';
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `;

    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Donation processing (mock function)
function processDonation() {
    const selectedAmount = document.querySelector('.amount-btn.selected');
    const customAmount = document.getElementById('customAmount');
    
    let amount = 0;
    if (selectedAmount) {
        amount = selectedAmount.getAttribute('data-amount');
    
    } else if (customAmount && customAmount.value) {
        amount = customAmount.value;
    }

    if (amount > 0) {
        showNotification(`Thank you for your $${amount} donation! You'll be redirected to our secure payment processor.`, 'success');
        // In a real application, this would redirect to a payment processor
        setTimeout(() => {
            document.getElementById('actionModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 2000);
    } else {
        showNotification('Please select or enter a donation amount.', 'error');
    }
}

// Add click handlers for donation amounts
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('amount-btn')) {
        // Remove previous selection
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
        // Add selection to clicked button
        e.target.classList.add('selected');
        // Clear custom amount
        const customAmount = document.getElementById('customAmount');
        if (customAmount) customAmount.value = '';
    }
});

// Custom amount input handler
document.addEventListener('input', function(e) {
    if (e.target.id === 'customAmount') {
        // Remove selection from amount buttons
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
    }
});

// Parallax effect for hero sections
document.addEventListener('DOMContentLoaded', function() {
    const parallaxElements = document.querySelectorAll('.hero-background, .page-header-bg');
    
    if (parallaxElements.length > 0) {
        const handleParallax = debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 10);

        window.addEventListener('scroll', handleParallax);
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Add loading animation to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });
});

// Cycle diagram animation
document.addEventListener('DOMContentLoaded', function() {
    const cycleSteps = document.querySelectorAll('.cycle-step');
    
    if (cycleSteps.length > 0) {
        let currentStep = 0;
        
        const animateCycle = () => {
            // Remove active class from all steps
            cycleSteps.forEach(step => step.classList.remove('active'));
            
            // Add active class to current step
            if (cycleSteps[currentStep]) {
                cycleSteps[currentStep].classList.add('active');
            }
            
            // Move to next step
            currentStep = (currentStep + 1) % cycleSteps.length;
        };

        // Start animation when cycle diagram is visible
        const cycleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const interval = setInterval(animateCycle, 2000);
                    // Stop animation when element is no longer visible
                    const stopObserver = new IntersectionObserver((stopEntries) => {
                        stopEntries.forEach(stopEntry => {
                            if (!stopEntry.isIntersecting) {
                                clearInterval(interval);
                                stopObserver.disconnect();
                            }
                        });
                    });
                    stopObserver.observe(entry.target);
                    cycleObserver.unobserve(entry.target);
                }
            });
        });

        const cycleDiagram = document.querySelector('.cycle-diagram');
        if (cycleDiagram) {
            cycleObserver.observe(cycleDiagram);
        }
    }
});

// Add CSS for cycle step active state
const style = document.createElement('style');
style.textContent = `
    .cycle-step.active {
        transform: scale(1.1);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #fee2e2, #fecaca);
    }
    
    .amount-btn.selected {
        background: linear-gradient(135deg, #059669, #047857);
        color: white;
        transform: scale(1.05);
    }
    
    .amount-btn {
        padding: 1rem;
        border: 2px solid #e5e7eb;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
        font-weight: 600;
    }
    
    .amount-btn:hover {
        border-color: #059669;
        transform: translateY(-2px);
    }
    
    .amount-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .modal-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .modal-header h2 {
        color: #1e40af;
        margin-bottom: 1rem;
    }
    
    .modal-header i {
        margin-right: 0.5rem;
        color: #059669;
    }
    
    .volunteer-type, .advocacy-item, .partnership-tier {
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        border-left: 4px solid #059669;
    }
    
    .volunteer-type h3, .advocacy-item h3 {
        color: #1e40af;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .social-share {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 1rem;
    }
    
    .social-share .btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    .partnership-tier ul {
        list-style: none;
        margin-top: 1rem;
    }
    
    .partnership-tier li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
    }
    
    .partnership-tier li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #059669;
        font-weight: bold;
    }
    
    .contact-partnership {
        text-align: center;
        margin-top: 2rem;
        padding: 2rem;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
        border-radius: 10px;
    }
`;
document.head.appendChild(style);