document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('animated-logo');
    const hero = document.querySelector('.hero');
    
    // Crear partículas dinámicas
    function createParticles() {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Tamaño aleatorio entre 3px y 8px
            const size = Math.random() * 5 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Posición inicial aleatoria
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.bottom = `-${size}px`;
            
            // Duración de animación aleatoria
            const duration = Math.random() * 10 + 10;
            particle.style.animationDuration = `${duration}s`;
            
            // Retraso aleatorio
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            hero.appendChild(particle);
        }
    }
    
    // Efecto de destello aleatorio
    function randomFlash() {
        logo.classList.add('flash-effect');
        
        setTimeout(() => {
            logo.classList.remove('flash-effect');
            
            // Programar próximo destello en un tiempo aleatorio
            const nextFlash = Math.random() * 8000 + 5000;
            setTimeout(randomFlash, nextFlash);
        }, 1000);
    }
    
    // Iniciar efectos
    createParticles();
    randomFlash();
    
    // Efecto al hacer hover
    logo.addEventListener('mouseenter', () => {
        logo.style.transform = 'scale(1.1) rotate(-5deg)';
        logo.style.filter = 'drop-shadow(0 10px 20px rgba(23, 190, 187, 0.3)) brightness(1.05)';
    });
    
    logo.addEventListener('mouseleave', () => {
        logo.style.transform = '';
        logo.style.filter = '';
    });
});