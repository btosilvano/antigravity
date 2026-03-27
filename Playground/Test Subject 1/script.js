document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');

    if (hamburgerBtn && mobileMenu) {
        const toggleMenu = () => {
            hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        hamburgerBtn.addEventListener('click', toggleMenu);

        const closeBtn = document.getElementById('menu-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    gsap.registerPlugin(ScrollTrigger);

    // VSL scale-up animation on scroll
    const vslContainer = document.querySelector('.video-container');
    if (vslContainer) {
        gsap.to(vslContainer, 
            {
                maxWidth: "100%",
                width: "96vw",
                scrollTrigger: {
                    trigger: ".main-video-section",
                    start: "top 75%",
                    end: "center center",
                    scrub: 1
                },
                ease: "power1.inOut"
            }
        );
    }

    // Text & Content Fade-Ins on scroll generally for the rest of the page
    gsap.utils.toArray('.feature, .faq-item, .final-cta > *').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });
});
