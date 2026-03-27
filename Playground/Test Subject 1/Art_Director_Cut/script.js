document.addEventListener('DOMContentLoaded', () => {
    // --- Top Menu Logic (from original) ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuCloseBtn = document.getElementById('menu-close-btn');

    if (hamburgerBtn && mobileMenu && menuCloseBtn) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            hamburgerBtn.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });

        menuCloseBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
        });

        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Accordion Logic (Minimal FAQ) ---
    const accordions = document.querySelectorAll('.minimal-accordion-item');
    accordions.forEach(acc => {
        const header = acc.querySelector('.minimal-accordion-header');
        header.addEventListener('click', () => {
            const isActive = acc.classList.contains('active');
            
            // Close all
            accordions.forEach(other => other.classList.remove('active'));
            
            // Toggle clicked
            if (!isActive) {
                acc.classList.add('active');
            }
        });
    });

    // ==========================================
    // ART DIRECTOR'S CUT V2: EDITORIAL GSAP
    // ==========================================
    
    // Safety check for GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Navigation Dark Mode Transition
        ScrollTrigger.create({
            trigger: ".editorial-realm",
            start: "top 80px",
            onEnter: () => gsap.to(".navigation", {backgroundColor: "rgba(3, 5, 9, 0.85)", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.05)", duration: 0.3}),
            onLeaveBack: () => gsap.to(".navigation", {backgroundColor: "rgba(255, 255, 255, 0.72)", color: "#1d1d1f", borderBottom: "1px solid rgba(0,0,0,0.05)", duration: 0.3})
        });

        // 2. The Pinned Sequence (How It Works)
        // Only run pin mechanism if screen is desktop size
        let mm = gsap.matchMedia();

        mm.add("(min-width: 1025px)", () => {
            // Pin the media container while the right side scrolls
            ScrollTrigger.create({
                trigger: ".cinematic-pinned-section",
                start: "top 120px", 
                end: "bottom bottom", 
                pin: ".media-pin-container",
                pinSpacing: false
            });

            // Add simple scroll scrub scaling effect to the video to emphasize progression
            gsap.to(".pinned-media", {
                scale: 1.2,
                scrollTrigger: {
                    trigger: ".cinematic-pinned-section",
                    start: "top center",
                    end: "bottom center",
                    scrub: 1
                }
            });

            // Opacity revealing for the text steps
            const steps = gsap.utils.toArray('.editorial-step');
            steps.forEach(step => {
                gsap.fromTo(step, 
                    { opacity: 0.2, x: 50 },
                    { 
                        opacity: 1, 
                        x: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: step,
                            start: "top 60%", // When it reaches 60% of viewport
                            end: "top 30%",
                            scrub: true
                        }
                    }
                );
            });
        });

        // 3. Image Parallax Anchor
        gsap.to(".parallax-anchor img", {
            yPercent: 15, // Smooth parallax shift
            ease: "none",
            scrollTrigger: {
                trigger: ".editorial-split-section",
                start: "top bottom", 
                end: "bottom top",
                scrub: true
            }
        });

        // 4. Stagger Grid Reveal (Who this is for)
        gsap.from(".grid-cell", {
            opacity: 0,
            y: 40,
            duration: 1,
            stagger: 0.2, // reveal one by one
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".strict-brutalist-grid",
                start: "top 80%"
            }
        });

    }
});
