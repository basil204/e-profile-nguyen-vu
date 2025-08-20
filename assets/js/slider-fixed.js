// ========================================
// OPTIMIZED SLIDER FOR SERVER DEPLOYMENT
// ========================================

(function() {
    'use strict';
    
    // Wait for DOM to be fully loaded
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState !== 'loading') {
                    fn();
                }
            });
        }
    }

    // Main slider initialization
    function initSliders() {
        // Certificate slider
        initCertificateSlider();
        
        // Project sliders
        initProjectSliders();
        
        // Activity scrollers
        initActivityScrollers();
        
        // Skills diagram
        initSkillsDiagram();
    }

    // Certificate slider with error handling
    function initCertificateSlider() {
        const slider = document.querySelector('.certificate-slider');
        if (!slider) return;

        const slides = Array.from(slider.querySelectorAll('.certificate-slide'));
        const prevBtn = slider.querySelector('.certificate-prev');
        const nextBtn = slider.querySelector('.certificate-next');

        if (slides.length === 0) return;

        let current = 0;
        let timer = null;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let dragDistance = 0;

        // Configuration
        const config = {
            autoplay: true,
            interval: 3000,
            swipeThreshold: 30,
            dragThreshold: 10
        };

        // Show slide function
        function showSlide(index) {
            if (!slides || slides.length === 0) return;
            
            const n = slides.length;
            index = (index % n + n) % n;
            
            if (index === current) return;
            
            try {
                slides[current].classList.remove('active');
                slides[index].classList.add('active');
                current = index;
            } catch (e) {
                console.warn('Error showing slide:', e);
            }
        }

        // Navigation functions
        function next() { showSlide(current + 1); }
        function prev() { showSlide(current - 1); }

        // Autoplay functions
        function startAutoplay() {
            if (!config.autoplay || timer) return;
            try {
                timer = setInterval(next, config.interval);
            } catch (e) {
                console.warn('Error starting autoplay:', e);
            }
        }

        function stopAutoplay() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        // Touch event handlers
        function handleTouchStart(e) {
            try {
                const touch = e.changedTouches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                isDragging = true;
                dragDistance = 0;
                stopAutoplay();
                slider.classList.add('dragging');
            } catch (e) {
                console.warn('Touch start error:', e);
            }
        }

        function handleTouchMove(e) {
            if (!isDragging) return;
            
            try {
                const touch = e.changedTouches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;

                if (Math.abs(deltaY) > Math.abs(deltaX)) return;
                
                dragDistance = Math.abs(deltaX);
                
                const activeSlide = slides[current];
                if (activeSlide) {
                    activeSlide.style.transform = `translateX(${deltaX * 0.3}px)`;
                    activeSlide.style.transition = 'none';
                }
                
                e.preventDefault();
            } catch (e) {
                console.warn('Touch move error:', e);
            }
        }

        function handleTouchEnd(e) {
            if (!isDragging) return;
            
            try {
                const touch = e.changedTouches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;

                // Reset transform
                const activeSlide = slides[current];
                if (activeSlide) {
                    activeSlide.style.transform = '';
                    activeSlide.style.transition = 'transform 0.3s ease';
                }

                // Handle swipe
                if (Math.abs(deltaX) > config.swipeThreshold && Math.abs(deltaY) < 60) {
                    if (deltaX < 0) next();
                    else prev();
                }

                isDragging = false;
                slider.classList.remove('dragging');
                startAutoplay();
            } catch (e) {
                console.warn('Touch end error:', e);
            }
        }

        // Mouse event handlers
        function handleMouseDown(e) {
            if (e.button !== 0) return;
            
            try {
                startX = e.clientX;
                startY = e.clientY;
                isDragging = true;
                dragDistance = 0;
                stopAutoplay();
                slider.classList.add('dragging');
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            } catch (e) {
                console.warn('Mouse down error:', e);
            }
        }

        function handleMouseMove(e) {
            if (!isDragging) return;
            
            try {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                if (Math.abs(deltaY) > Math.abs(deltaX)) return;
                
                dragDistance = Math.abs(deltaX);
                
                const activeSlide = slides[current];
                if (activeSlide) {
                    activeSlide.style.transform = `translateX(${deltaX * 0.3}px)`;
                    activeSlide.style.transition = 'none';
                }
            } catch (e) {
                console.warn('Mouse move error:', e);
            }
        }

        function handleMouseUp(e) {
            if (!isDragging) return;
            
            try {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                // Reset transform
                const activeSlide = slides[current];
                if (activeSlide) {
                    activeSlide.style.transform = '';
                    activeSlide.style.transition = 'transform 0.3s ease';
                }

                // Handle drag
                if (Math.abs(deltaX) > config.swipeThreshold && Math.abs(deltaY) < 60) {
                    if (deltaX < 0) next();
                    else prev();
                }

                isDragging = false;
                slider.classList.remove('dragging');
                startAutoplay();
                
                // Clean up
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            } catch (e) {
                console.warn('Mouse up error:', e);
            }
        }

        // Button event handlers
        function handlePrevClick() {
            try {
                stopAutoplay();
                prev();
                startAutoplay();
            } catch (e) {
                console.warn('Prev button error:', e);
            }
        }

        function handleNextClick() {
            try {
                stopAutoplay();
                next();
                startAutoplay();
            } catch (e) {
                console.warn('Next button error:', e);
            }
        }

        // Keyboard support
        function handleKeydown(e) {
            try {
                if (e.key === 'ArrowRight') {
                    stopAutoplay();
                    next();
                    startAutoplay();
                    e.preventDefault();
                }
                if (e.key === 'ArrowLeft') {
                    stopAutoplay();
                    prev();
                    startAutoplay();
                    e.preventDefault();
                }
            } catch (e) {
                console.warn('Keyboard error:', e);
            }
        }

        // Event binding with error handling
        try {
            // Touch events
            slider.addEventListener('touchstart', handleTouchStart, { passive: false });
            slider.addEventListener('touchmove', handleTouchMove, { passive: false });
            slider.addEventListener('touchend', handleTouchEnd, { passive: false });
            
            // Mouse events
            slider.addEventListener('mousedown', handleMouseDown);
            
            // Button events
            if (prevBtn) prevBtn.addEventListener('click', handlePrevClick);
            if (nextBtn) nextBtn.addEventListener('click', handleNextClick);
            
            // Keyboard events
            slider.addEventListener('keydown', handleKeydown);
            
            // Hover events
            slider.addEventListener('mouseenter', stopAutoplay);
            slider.addEventListener('mouseleave', startAutoplay);
            
            // Accessibility
            slider.setAttribute('tabindex', '0');
            slider.setAttribute('aria-roledescription', 'carousel');
            
            // Initialize first slide
            slides[current].classList.add('active');
            
            // Start autoplay
            startAutoplay();
            
        } catch (e) {
            console.error('Error binding events to certificate slider:', e);
        }
    }

    // Project sliders
    function initProjectSliders() {
        const sliders = document.querySelectorAll('.project-slider');
        
        sliders.forEach(slider => {
            try {
                const slides = Array.from(slider.querySelectorAll('.project-slide'));
                const prevBtn = slider.querySelector('.project-prev');
                const nextBtn = slider.querySelector('.project-next');
                
                if (slides.length === 0) return;
                
                let current = 0;

                function showSlide(idx) {
                    current = (idx + slides.length) % slides.length;
                    slides.forEach((s, i) => s.classList.toggle('active', i === current));
                }

                if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
                if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));

                // Initialize first slide
                showSlide(0);
                
            } catch (e) {
                console.warn('Error initializing project slider:', e);
            }
        });
    }

    // Activity scrollers
    function initActivityScrollers() {
        const scrollers = document.querySelectorAll('.activity-scroller');
        
        scrollers.forEach(scroller => {
            try {
                let isDown = false;
                let startX = 0;
                let scrollStart = 0;
                let moved = false;
                const THRESH = 5;

                scroller.addEventListener('pointerdown', (e) => {
                    if (e.button !== 0) return;
                    isDown = true;
                    moved = false;
                    scroller.setPointerCapture(e.pointerId);
                    scroller.classList.add('dragging');
                    startX = e.clientX;
                    scrollStart = scroller.scrollLeft;
                });

                scroller.addEventListener('pointermove', (e) => {
                    if (!isDown) return;
                    const dx = e.clientX - startX;
                    if (Math.abs(dx) > THRESH) moved = true;
                    scroller.scrollLeft = scrollStart - dx;
                });

                const end = () => {
                    isDown = false;
                    scroller.classList.remove('dragging');
                };
                
                scroller.addEventListener('pointerup', end);
                scroller.addEventListener('pointercancel', end);
                scroller.addEventListener('pointerleave', end);

                scroller.addEventListener('click', (e) => {
                    if (moved) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, true);

                scroller.addEventListener('wheel', (e) => {
                    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
                    e.preventDefault();
                    scroller.scrollLeft += e.deltaX;
                }, { passive: false });
                
            } catch (e) {
                console.warn('Error initializing activity scroller:', e);
            }
        });
    }

    // Skills diagram
    function initSkillsDiagram() {
        const scroller = document.querySelector('.skills-diagram');
        if (!scroller) return;

        try {
            let isDown = false;
            let startX = 0;
            let startLeft = 0;

            scroller.addEventListener('pointerdown', (e) => {
                isDown = true;
                scroller.setPointerCapture(e.pointerId);
                scroller.style.cursor = 'grabbing';
                startX = e.clientX;
                startLeft = scroller.scrollLeft;
            });

            scroller.addEventListener('pointermove', (e) => {
                if (!isDown) return;
                const dx = e.clientX - startX;
                scroller.scrollLeft = startLeft - dx;
            });

            ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => {
                scroller.addEventListener(ev, () => {
                    isDown = false;
                    scroller.style.cursor = 'grab';
                });
            });
            
        } catch (e) {
            console.warn('Error initializing skills diagram:', e);
        }
    }

    // Initialize when ready
    ready(initSliders);

    // Fallback initialization for older browsers
    if (document.readyState === 'complete') {
        initSliders();
    }

})();
