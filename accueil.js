// JAVASCRIPT UNIFIÉ POUR NAVBAR - À ajouter dans les deux pages

function toggleMenu() {
    const navlinks = document.querySelector('.navlinks');
    const hamburger = document.querySelector('.hamburger');
    
    navlinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Fermer le menu lors du clic sur un lien (mobile)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navlinks a');
    const navlinksContainer = document.querySelector('.navlinks');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navlinksContainer.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Fermer le menu lors du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navlinksContainer.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});