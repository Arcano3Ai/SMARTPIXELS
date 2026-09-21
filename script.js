/* ============================================
   AGENTE WEB — Interaction scripts v4.0
   Skills: scroll-experience, form-cro, 3d-web-experience
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================
       1. CUSTOM CURSOR
       ======================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows instantly
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        // Ring follows with spring easing
        const render = () => {
            // Spring calculation
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            
            cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        // Hover states on interactions
        const interactables = document.querySelectorAll('a, button, input, select, .service-card, .port-card, .pricing-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.style.width = '60px';
                cursorRing.style.height = '60px';
                cursorRing.style.borderColor = 'var(--primary)';
                cursorRing.style.backgroundColor = 'rgba(124, 58, 237, 0.05)';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.style.width = '34px';
                cursorRing.style.height = '34px';
                cursorRing.style.borderColor = 'rgba(255,255,255,0.6)';
                cursorRing.style.backgroundColor = 'transparent';
            });
        });
    }

    /* ========================================
       2. NAVBAR & MOBILE MENU
       ======================================== */
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const mobileOverlay = document.getElementById('mobile-overlay');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            navLinks.style.right = '0';
            mobileOverlay.style.display = 'block';
            setTimeout(() => mobileOverlay.style.opacity = '1', 10);
            document.body.style.overflow = 'hidden';
        } else {
            closeMenu();
        }
    };

    const closeMenu = () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        navLinks.style.right = '-100%';
        mobileOverlay.style.opacity = '0';
        setTimeout(() => mobileOverlay.style.display = 'none', 300);
        document.body.style.overflow = 'auto';
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', closeMenu);
        
        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ========================================
       3. SCROLL REVEAL ANIMATIONS
       ======================================== */
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealOnScroll.observe(el));

    // Force active on load for elements near top
    setTimeout(() => {
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    /* ========================================
       4. NUMBER COUNTER ANIMATION (METRICS)
       ======================================== */
    const metricNumbers = document.querySelectorAll('.metric-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        
        metricNumbers.forEach(num => {
            const target = parseFloat(num.getAttribute('data-target'));
            const prefix = num.getAttribute('data-prefix') || '';
            const suffix = num.getAttribute('data-suffix') || '';
            
            // Check if it's a float
            const isFloat = target % 1 !== 0;
            const duration = 2000;
            const steps = 60;
            const stepTime = duration / steps;
            
            let current = 0;
            
            const render = () => {
                current += target / steps;
                
                if (current >= target) {
                    num.innerText = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
                } else {
                    num.innerText = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
                    setTimeout(render, stepTime);
                }
            };
            
            render();
        });
        
        countersAnimated = true;
    };

    const metricsSection = document.querySelector('.metrics-bar');
    if (metricsSection) {
        const metricsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                metricsObserver.disconnect();
            }
        }, { threshold: 0.5 });
        
        metricsObserver.observe(metricsSection);
    }

    /* ========================================
       5. CRO-OPTIMIZED FORM VALIDATION & AJAX
       ======================================== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('form-submit-btn');

        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        };

        const showError = (input, message) => {
            const group = input.closest('.form-group');
            const errorSpan = group.querySelector('.field-error');
            group.classList.add('has-error');
            if (errorSpan) errorSpan.textContent = message;
            input.setAttribute('aria-invalid', 'true');
        };

        const clearError = (input) => {
            const group = input.closest('.form-group');
            const errorSpan = group.querySelector('.field-error');
            group.classList.remove('has-error');
            if (errorSpan) errorSpan.textContent = '';
            input.setAttribute('aria-invalid', 'false');
        };

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.required && input.value.trim() === '') {
                    showError(input, 'Este campo es obligatorio');
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    showError(input, 'Ingresa un correo válido');
                } else {
                    clearError(input);
                }
            });
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.required && input.value.trim() === '') {
                    showError(input, 'Este campo es obligatorio');
                    isValid = false;
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    showError(input, 'Ingresa un correo válido');
                    isValid = false;
                }
            });

            if (!isValid) {
                // Focus first error
                const firstError = contactForm.querySelector('.has-error input, .has-error select');
                if (firstError) firstError.focus();
                return;
            }

            // UI Loading state
            submitBtn.classList.add('loading');
            
            // Simulate API Call (would be replaced with actual fetch)
            try {
                // Form Data capture 
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                console.log('Sending data:', data);

                // Fake network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show Success
                showToast('Propuesta solicitada con éxito. Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();
                
            } catch (err) {
                showToast('Hubo un error al enviar tu solicitud. Intenta nuevamente.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
            }
        });
    }

    // Toast Notification System
    const toast = document.getElementById('toast');
    let toastTimeout;
    
    const showToast = (message, type = 'success') => {
        if (!toast) return;
        
        clearTimeout(toastTimeout);
        
        const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        toast.className = `toast show ${type}`;
        
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    };

    /* ========================================
       6. HERO PARTICLES (THREE.JS LITE)
       ======================================== */
    const setupParticles = () => {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        // Performance optimization: fewer particles on mobile
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 40 : 100;
        const particles = [];

        // Colors matching design system (Tailwind equivalents)
        const colors = [
            'rgba(124, 58, 237, 0.4)', // Violet
            'rgba(236, 72, 153, 0.4)', // Pink
            'rgba(6, 182, 212, 0.4)'   // Cyan
        ];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 0.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Bounce edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let animationFrame;
        let mousePos = { x: -1000, y: -1000 };
        
        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY + window.scrollY; // Adjust for scroll
        });

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
                
                // Draw connecting lines if near mouse (only on desktop)
                if (!isMobile) {
                    const dx = p.x - mousePos.x;
                    const dy = p.y - (mousePos.y - window.scrollY); // correct mouse relative to viewport
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mousePos.x, mousePos.y - window.scrollY);
                        ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 - dist/1000})`;
                        ctx.stroke();
                    }
                }
            });
            
            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    };

    // Load Three / Particles
    // Check if we want to run the 2d context fallback (we do, for performance)
    setupParticles();

    /* ========================================
       8. PORTFOLIO FILTER TABS
       ======================================== */
    const filterBtns = document.querySelectorAll('.port-filter-btn');
    const portCards = document.querySelectorAll('#portfolio-grid .port-card');

    if (filterBtns.length && portCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetFilter = btn.getAttribute('data-filter');

                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                portCards.forEach(card => {
                    const categories = (card.getAttribute('data-category') || '').split(' ');
                    if (targetFilter === 'all' || categories.includes(targetFilter)) {
                        card.classList.remove('port-hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 20);
                    } else {
                        card.classList.add('port-hidden');
                    }
                });
            });
        });
    }

    /* ========================================
       9. PAGESPEED VIEW SWITCHER & LIGHTBOX MODAL
       ======================================== */
    const btnViewWeb = document.getElementById('btn-view-web');
    const btnViewSpeed = document.getElementById('btn-view-speed');
    const allPortCards = document.querySelectorAll('.port-card');
    const psModal = document.getElementById('pagespeed-modal');
    const psModalImg = document.getElementById('ps-modal-img');
    const psModalTitle = document.getElementById('ps-modal-title');
    const psModalClose = document.getElementById('ps-modal-close');

    // Function to set card view (web or speed)
    function setCardView(card, viewType) {
        const tabBtns = card.querySelectorAll('.card-tab-btn');
        const imgWeb = card.querySelector('.port-img-web');
        const imgSpeed = card.querySelector('.port-img-speed');

        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-card-view') === viewType) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (viewType === 'speed') {
            if (imgWeb) imgWeb.classList.remove('active');
            if (imgSpeed) imgSpeed.classList.add('active');
        } else {
            if (imgSpeed) imgSpeed.classList.remove('active');
            if (imgWeb) imgWeb.classList.add('active');
        }
    }

    // Global View Switcher handlers
    if (btnViewWeb && btnViewSpeed) {
        btnViewWeb.addEventListener('click', () => {
            btnViewWeb.classList.add('active');
            btnViewSpeed.classList.remove('active');
            allPortCards.forEach(card => setCardView(card, 'web'));
        });

        btnViewSpeed.addEventListener('click', () => {
            btnViewSpeed.classList.add('active');
            btnViewWeb.classList.remove('active');
            allPortCards.forEach(card => setCardView(card, 'speed'));
        });
    }

    // Individual Card Tab Click Handlers
    document.querySelectorAll('.card-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const viewType = btn.getAttribute('data-card-view');
            const card = btn.closest('.port-card');
            if (card && viewType) {
                setCardView(card, viewType);
            }
        });
    });

    // Lightbox Modal Open Function
    function openPsModal(src, title) {
        if (!psModal || !psModalImg) return;
        psModalImg.src = src;
        if (psModalTitle) {
            const titleSpan = psModalTitle.querySelector('span');
            if (titleSpan) {
                titleSpan.textContent = title || 'Auditoría Oficial Google PageSpeed Insights';
            }
        }
        psModal.classList.add('open');
        psModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePsModal() {
        if (!psModal) return;
        psModal.classList.remove('open');
        psModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (psModalImg) psModalImg.src = '';
        }, 300);
    }

    // Click on elements that have data-lightbox (e.g. badges, speed images)
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-lightbox]');
        if (target) {
            e.preventDefault();
            e.stopPropagation();
            const src = target.getAttribute('data-lightbox');
            const title = target.getAttribute('data-lightbox-title');
            if (src) {
                openPsModal(src, title);
            }
        }
    });

    // Modal Close Triggers
    if (psModalClose) {
        psModalClose.addEventListener('click', closePsModal);
    }

    if (psModal) {
        psModal.addEventListener('click', (e) => {
            if (e.target === psModal) {
                closePsModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && psModal && psModal.classList.contains('open')) {
            closePsModal();
        }
    });
});
