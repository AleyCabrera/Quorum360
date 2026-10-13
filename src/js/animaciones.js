document.addEventListener('DOMContentLoaded', function() {
    // Animación de aparición suave
    const aboutSection = document.querySelector('.about-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(aboutSection);
    
    // Añadir estilos dinámicos
    const features = document.querySelectorAll('.features-list li');
    features.forEach((feature, index) => {
        feature.style.transitionDelay = `${index * 0.1}s`;
    });
});