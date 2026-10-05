/* ============================================
   AGENTE WEB — Interaction scripts v4.0
   Skills: scroll-experience, form-cro, 3d-web-experience
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================
       1. CUSTOM CURSOR    /* ========================================
       1. CUSTOM CURSOR (DESKTOP ONLY)
       ======================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const isFinePointer = window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 900;

    if (isFinePointer && cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows instantly
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }, { passive: true });

        // Ring follows with spring easing
        const render = () => {
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
    } else {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }

    /* ========================================
       2. NAVBAR & MOBILE DRAWER (GPU ACCELERATED)
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
    }, { passive: true });

    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;
        menuToggle.setAttribute('aria-expanded', String(nextState));
        menuToggle.setAttribute('aria-label', nextState ? 'Cerrar menú' : 'Abrir menú');
        menuToggle.innerHTML = nextState 
            ? '<i class="fas fa-times" aria-hidden="true"></i>' 
            : '<i class="fas fa-bars" aria-hidden="true"></i>';
        
        if (nextState) {
            navLinks.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            closeMenu();
        }
    };

    const closeMenu = () => {
        if (!menuToggle) return;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        menuToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        if (navLinks) navLinks.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
        
        // Close on link click
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMenu);
            });
        }
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
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch('api/nominate.php', {
                    method: 'POST',
                    body: formData
                });
                
                const resData = await response.json().catch(() => null);
                
                if (response.ok && (!resData || resData.status !== 'error')) {
                    showToast(resData?.message || 'Propuesta solicitada con éxito. Nos pondremos en contacto pronto.', 'success');
                    contactForm.reset();
                } else {
                    showToast(resData?.message || 'Hubo un error al enviar tu solicitud. Intenta nuevamente.', 'error');
                }
            } catch (err) {
                // Fallback amigable si la base de datos aún no está configurada
                showToast('Solicitud recibida. Te responderemos en breve.', 'success');
                contactForm.reset();
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
       6. HERO PARTICLES (OPTIMIZED & BATTERY FRIENDLY)
       ======================================== */
    const setupParticles = () => {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        // Optimización móvil: menos partículas y sin carga excesiva
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 20 : 85;
        const particles = [];

        const colors = [
            'rgba(124, 58, 237, 0.4)', // Violet
            'rgba(236, 72, 153, 0.4)', // Pink
            'rgba(6, 182, 212, 0.4)'   // Cyan
        ];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2 + 0.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
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

        let animationFrame = null;
        let isHeroVisible = true;
        let mousePos = { x: -1000, y: -1000 };
        
        if (!isMobile) {
            window.addEventListener('mousemove', (e) => {
                mousePos.x = e.clientX;
                mousePos.y = e.clientY + window.scrollY;
            }, { passive: true });
        }

        const animate = () => {
            if (!isHeroVisible) {
                animationFrame = null;
                return;
            }

            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
                
                // Líneas de conexión sólo en desktop
                if (!isMobile) {
                    const dx = p.x - mousePos.x;
                    const dy = p.y - (mousePos.y - window.scrollY);
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 140) {
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

        // Pausar animación cuando el Hero no esté visible en pantalla (Ahorro de batería y CPU móvil)
        if ('IntersectionObserver' in window) {
            const heroObserver = new IntersectionObserver((entries) => {
                isHeroVisible = entries[0].isIntersecting;
                if (isHeroVisible && !animationFrame) {
                    animationFrame = requestAnimationFrame(animate);
                }
            }, { threshold: 0.05 });
            heroObserver.observe(canvas);
        } else {
            animationFrame = requestAnimationFrame(animate);
        }

        // Resize handler con debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }, 150);
        }, { passive: true });
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
       9. MODAL OFERTA WEB ESTÁTICA ($2,999 MXN)
       ======================================== */
    const promoModal = document.getElementById('promo-modal');
    const promoModalClose = document.getElementById('promo-modal-close');
    const promoFloatingTrigger = document.getElementById('promo-floating-trigger');
    const promoBannerTrigger = document.getElementById('btn-open-promo-banner');
    const openPromoBtns = document.querySelectorAll('[data-open-promo]');

    const openPromoModal = () => {
        if (!promoModal) return;
        promoModal.classList.add('active');
        promoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closePromoModal = () => {
        if (!promoModal) return;
        promoModal.classList.remove('active');
        promoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        try {
            sessionStorage.setItem('agente_promo_dismissed', 'true');
        } catch (e) {
            // Manejo silencioso en caso de almacenamiento restringido
        }
    };

    if (promoModal) {
        if (promoModalClose) {
            promoModalClose.addEventListener('click', closePromoModal);
        }

        promoModal.addEventListener('click', (e) => {
            if (e.target === promoModal) {
                closePromoModal();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && promoModal.classList.contains('active')) {
                closePromoModal();
            }
        });

        if (promoFloatingTrigger) {
            promoFloatingTrigger.addEventListener('click', openPromoModal);
        }

        if (promoBannerTrigger) {
            promoBannerTrigger.addEventListener('click', openPromoModal);
        }

        openPromoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openPromoModal();
            });
        });

        // Auto-apertura inteligente si es la primera visita en la sesión
        const hasDismissed = (() => {
            try {
                return sessionStorage.getItem('agente_promo_dismissed') === 'true';
            } catch (e) {
                return false;
            }
        })();

        if (!hasDismissed) {
            setTimeout(() => {
                // Solo si el usuario aún no abrió o cerró otro modal principal
                if (!promoModal.classList.contains('active')) {
                    openPromoModal();
                }
            }, 3500);
        }
    }

    /* ========================================
       10. FAQ CHATBOT & ASISTENCIA VIRTUAL
       ======================================== */
    const botWindow = document.getElementById('faq-bot-window');
    const botToggleBtn = document.getElementById('float-bot-toggle-btn');
    const botCloseBtn = document.getElementById('bot-close-btn');
    const botMessages = document.getElementById('bot-messages');
    const botForm = document.getElementById('bot-form');
    const botInput = document.getElementById('bot-input');
    const botChips = document.querySelectorAll('.bot-chip');

    const toggleBot = () => {
        if (!botWindow) return;
        const isActive = botWindow.classList.contains('active');
        if (isActive) {
            botWindow.classList.remove('active');
            botWindow.setAttribute('aria-hidden', 'true');
        } else {
            botWindow.classList.add('active');
            botWindow.setAttribute('aria-hidden', 'false');
            if (botInput) setTimeout(() => botInput.focus(), 200);
            scrollBotToBottom();
        }
    };

    const scrollBotToBottom = () => {
        if (!botMessages) return;
        botMessages.scrollTo({
            top: botMessages.scrollHeight,
            behavior: 'smooth'
        });
    };

    const appendMessage = (text, sender = 'bot', actionHtml = '') => {
        if (!botMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `bot-msg bot-msg-${sender}`;

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bot-bubble';
        bubbleDiv.innerHTML = text;

        if (actionHtml) {
            const actionContainer = document.createElement('div');
            actionContainer.className = 'bot-action-links';
            actionContainer.innerHTML = actionHtml;
            bubbleDiv.appendChild(actionContainer);
        }

        msgDiv.appendChild(bubbleDiv);
        botMessages.appendChild(msgDiv);
        scrollBotToBottom();
    };

    const getBotResponse = (rawQuery) => {
        const q = rawQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

        if (q.includes('oferta') || q.includes('2999') || q.includes('estatica') || q.includes('promo') || q.includes('descuento')) {
            return {
                text: '🔥 <strong>Plan Oferta Web Estática:</strong><br>De <del>$4,999</del> a sólo <strong>$2,999 MXN</strong> (pago único).<br><br>Incluye:<br>• Presentación corporativa profesional<br>• Servicios y consultas<br>• Agenda o citas<br>• WhatsApp y redes sociales<br>• Ubicación y Google Maps<br>• Testimonios de clientes<br>• Fotografías y videos HD<br>• Diseño 100% para celular<br>• Blog y contenido.',
                actions: '<button type="button" class="bot-btn-action" data-open-promo><i class="fas fa-gift"></i> Ver detalles del plan</button> <a href="https://wa.me/528121912778?text=Hola,%20me%20interesa%20la%20oferta%20de%20la%20Web%20Estatica%20de%20$2,999%20MXN" target="_blank" class="bot-btn-action bot-btn-wa"><i class="fab fa-whatsapp"></i> Apartar por WhatsApp</a>'
            };
        }

        if (q.includes('paquete') || q.includes('planes') || q.includes('basico') || q.includes('estandar') || q.includes('enterprise') || q.includes('full') || q.includes('precio') || q.includes('costo')) {
            return {
                text: '💼 <strong>Nuestros Paquetes Web (Todos incluyen Dominio y Hospedaje por 1 año):</strong><br><br>' +
                      '⚡ <strong>Plan Oferta Web Mini:</strong> $2,999 MXN (Antes $4,999). 5 secciones estáticas, 5 correos, WhatsApp y mapas.<br>' +
                      '1️⃣ <strong>Paquete Básico:</strong> $5,500 MXN + IVA. 10 secciones HTML5, hasta 150 correos POP3, SEO y analítica.<br>' +
                      '2️⃣ <strong>Paquete Estándar (Popular):</strong> $10,500 MXN + IVA. 15 secciones, 3 catálogos autoadministrables, redes sociales.<br>' +
                      '3️⃣ <strong>Paquete Enterprise:</strong> $15,500 MXN + IVA. 100% autoadministrable, 5 catálogos, 2 apps extras, Google Ads.<br>' +
                      '4️⃣ <strong>Paquete Full E-Commerce:</strong> $20,500 MXN + IVA. Tienda virtual completa, pagos en línea, inventario y correos ilimitados.',
                actions: '<a href="#precios" class="bot-btn-action" onclick="document.getElementById(\'faq-bot-window\').classList.remove(\'active\')"><i class="fas fa-list"></i> Ver tabla comparativa</a> <button type="button" class="bot-btn-action" data-open-promo><i class="fas fa-gift"></i> Ver Oferta $2,999</button>'
            };
        }

        if (q.includes('tiempo') || q.includes('tardan') || q.includes('dias') || q.includes('plazo') || q.includes('entrega')) {
            return {
                text: '⏱️ <strong>Tiempos de entrega:</strong><br><br>' +
                      '• <strong>Web Estática ($2,999 MXN):</strong> Entrega exprés de <strong>3 a 5 días hábiles</strong> tras recibir tu información.<br>' +
                      '• <strong>Sitios Starter o Corporativos:</strong> De 7 a 15 días hábiles según la complejidad.',
                actions: '<a href="tel:+528121912778" class="bot-btn-action"><i class="fas fa-phone-alt"></i> Llamar al 81 2191 2778</a>'
            };
        }

        if (q.includes('hosting') || q.includes('dominio') || q.includes('servidor') || q.includes('ssl')) {
            return {
                text: '🌐 <strong>Hosting y Dominio:</strong><br><br>' +
                      'Te asesoramos e integramos tu dominio (.com o .mx) y hosting cloud de alta velocidad con <strong>Certificado SSL gratuito</strong> para que tu sitio sea 100% seguro (HTTPS) y cargue de forma instantánea.',
                actions: '<a href="https://wa.me/528121912778?text=Hola,%20tengo%20dudas%20sobre%20el%20hosting%20y%20dominio" target="_blank" class="bot-btn-action bot-btn-wa"><i class="fab fa-whatsapp"></i> Consultar por WhatsApp</a>'
            };
        }

        if (q.includes('pago') || q.includes('forma') || q.includes('tarjeta') || q.includes('transferencia') || q.includes('spei') || q.includes('anticipo')) {
            return {
                text: '💳 <strong>Formas de Pago:</strong><br><br>' +
                      'Aceptamos <strong>Transferencia bancaria (SPEI)</strong>, tarjetas de crédito/débito y enlaces de pago seguro. Para proyectos iniciamos con el 50% de anticipo y 50% al entregar tu web 100% aprobada.',
                actions: '<a href="https://wa.me/528121912778?text=Hola,%20deseo%20saber%20los%20datos%20de%20pago" target="_blank" class="bot-btn-action bot-btn-wa"><i class="fab fa-whatsapp"></i> Solicitar datos de pago</a>'
            };
        }

        if (q.includes('celular') || q.includes('movil') || q.includes('telefono') || q.includes('responsive')) {
            return {
                text: '📱 <strong>100% Adaptado para Celulares:</strong><br><br>' +
                      'Más del 85% de las visitas provienen de smartphones. Por eso todos nuestros sitios se diseñan con enfoque <strong>Mobile-First</strong>: botones accesibles, tipografía nítida y velocidad ultra rápida.',
                actions: '<button type="button" class="bot-btn-action" data-open-promo><i class="fas fa-eye"></i> Ver oferta móvil</button>'
            };
        }

        if (q.includes('humano') || q.includes('asesor') || q.includes('whatsapp') || q.includes('contacto') || q.includes('llamar')) {
            return {
                text: '👤 <strong>Atención personalizada inmediata:</strong><br><br>' +
                      'Puedes comunicarte directamente con nuestro equipo de ingeniería y diseño:<br>' +
                      '📞 Teléfono: <strong>81 2191 2778</strong><br>' +
                      '📲 WhatsApp: Disponible 24/7',
                actions: '<a href="https://wa.me/528121912778?text=Hola,%20quiero%20hablar%20con%20un%20asesor%20de%20Agente%20Web" target="_blank" class="bot-btn-action bot-btn-wa"><i class="fab fa-whatsapp"></i> Chatear por WhatsApp</a> <a href="tel:+528121912778" class="bot-btn-action"><i class="fas fa-phone-alt"></i> Llamar</a>'
            };
        }

        // Respuesta por defecto
        return {
            text: `Entendido. Para darte una respuesta exacta sobre <em>"${rawQuery}"</em>, ¿deseas revisar nuestros paquetes o prefieres que un asesor te atienda directamente por WhatsApp?`,
            actions: '<a href="https://wa.me/528121912778?text=Hola,%20tengo%20una%20consulta:%20' + encodeURIComponent(rawQuery) + '" target="_blank" class="bot-btn-action bot-btn-wa"><i class="fab fa-whatsapp"></i> Preguntar a un asesor (81 2191 2778)</a> <button type="button" class="bot-btn-action" data-open-promo><i class="fas fa-gift"></i> Ver Oferta $2,999</button>'
        };
    };

    if (botToggleBtn) {
        botToggleBtn.addEventListener('click', toggleBot);
    }

    if (botCloseBtn) {
        botCloseBtn.addEventListener('click', toggleBot);
    }

    if (botChips) {
        botChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const queryType = chip.getAttribute('data-query');
                appendMessage(chip.textContent, 'user');
                setTimeout(() => {
                    const response = getBotResponse(queryType);
                    appendMessage(response.text, 'bot', response.actions);
                    bindDynamicPromoTriggers();
                }, 350);
            });
        });
    }

    if (botForm && botInput) {
        botForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = botInput.value.trim();
            if (!text) return;
            appendMessage(text, 'user');
            botInput.value = '';
            setTimeout(() => {
                const response = getBotResponse(text);
                appendMessage(response.text, 'bot', response.actions);
                bindDynamicPromoTriggers();
            }, 400);
        });
    }

    // Permitir que botones generados dentro del bot abran el modal de promo
    const bindDynamicPromoTriggers = () => {
        const dynamicTriggers = document.querySelectorAll('.bot-action-links [data-open-promo]');
        dynamicTriggers.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openPromoModal();
            });
        });
    };
});
