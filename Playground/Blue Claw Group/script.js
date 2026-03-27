document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close others
            faqItems.forEach(otherItem => {
                if(otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // Subtly track mouse to slightly rotate 3D dashboard on Desktop
    const heroVisual = document.querySelector('.hero-visual');
    const dashWrapper = document.querySelector('.dashboard-3d-wrapper');

    if (heroVisual && dashWrapper && window.innerWidth > 1024) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Adjust tilt magnitude
            const tiltX = (y - centerY) / 20; 
            const tiltY = (centerX - x) / 20;
            
            // Base rotation: rotateX(15deg) rotateY(-15deg)
            dashWrapper.style.transform = `rotateX(${15 + tiltX}deg) rotateY(${-15 + tiltY}deg)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            dashWrapper.style.transform = `rotateX(15deg) rotateY(-15deg)`;
        });
    }
});
