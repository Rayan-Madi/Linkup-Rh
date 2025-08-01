// Contact Page JavaScript avec effets avancés et case à cocher corrigée

// Variables globales
let isSubmitting = false;

// Menu mobile toggle
function toggleMenu() {
    const navlinks = document.querySelector('.navlinks');
    const hamburger = document.querySelector('.hamburger');
    
    navlinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Fonction pour ouvrir Google Maps
function openGoogleMaps() {
    const address = "47 Boulevard de Courcelles, 75008 Paris, France";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeFormEffects();
    initializeAnimations();
    initializeFormValidation();
    setupEventListeners();
    initializeMap();
    initializeCheckbox();
});

// Initialisation de la carte
function initializeMap() {
    const iframe = document.getElementById('googleMap');
    const fallback = document.querySelector('.map-fallback');
    
    // Vérifier si l'iframe se charge correctement
    iframe.addEventListener('load', function() {
        console.log('Carte chargée avec succès');
    });
    
    iframe.addEventListener('error', function() {
        console.log('Erreur de chargement de la carte, affichage du fallback');
        iframe.style.display = 'none';
        if (fallback) {
            fallback.style.display = 'flex';
        }
    });
    
    // Timeout pour détecter les problèmes de chargement
    setTimeout(() => {
        if (!iframe.contentDocument && !iframe.contentWindow) {
            console.log('Carte non accessible, affichage du fallback');
            iframe.style.display = 'none';
            if (fallback) {
                fallback.style.display = 'flex';
            }
        }
    }, 5000);
}

// Initialisation spécifique de la case à cocher
function initializeCheckbox() {
    const checkbox = document.getElementById('consent');
    const checkboxContainer = document.querySelector('.checkbox-container');
    const checkboxError = document.getElementById('consentError');
    
    if (checkbox && checkboxContainer) {
        // Gestion du clic sur le conteneur
        checkboxContainer.addEventListener('click', function(e) {
            if (e.target !== checkbox) {
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        
        // Gestion du changement d'état
        checkbox.addEventListener('change', function() {
            updateCheckboxState();
            if (checkbox.checked && checkboxContainer.classList.contains('error')) {
                clearCheckboxError();
            }
        });
        
        // Gestion du focus
        checkbox.addEventListener('focus', function() {
            checkboxContainer.classList.add('focused');
        });
        
        checkbox.addEventListener('blur', function() {
            checkboxContainer.classList.remove('focused');
        });
    }
}

// Mise à jour de l'état visuel de la case à cocher
function updateCheckboxState() {
    const checkbox = document.getElementById('consent');
    const checkboxContainer = document.querySelector('.checkbox-container');
    
    if (checkbox && checkboxContainer) {
        if (checkbox.checked) {
            checkboxContainer.classList.add('checked');
        } else {
            checkboxContainer.classList.remove('checked');
        }
    }
}

// Affichage d'erreur pour la case à cocher
function showCheckboxError() {
    const checkboxContainer = document.querySelector('.checkbox-container');
    const checkboxError = document.getElementById('consentError');
    
    if (checkboxContainer && checkboxError) {
        checkboxContainer.classList.add('error');
        checkboxError.classList.add('show');
        
        // Animation de secousse
        checkboxContainer.style.animation = 'none';
        setTimeout(() => {
            checkboxContainer.style.animation = 'shake 0.5s ease-in-out';
        }, 10);
    }
}

// Suppression d'erreur pour la case à cocher
function clearCheckboxError() {
    const checkboxContainer = document.querySelector('.checkbox-container');
    const checkboxError = document.getElementById('consentError');
    
    if (checkboxContainer && checkboxError) {
        checkboxContainer.classList.remove('error');
        checkboxError.classList.remove('show');
        checkboxContainer.style.animation = 'none';
    }
}

// Configuration des effets de formulaire
function initializeFormEffects() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const line = group.querySelector('.form-line');
        
        if (input && line) {
            // Effet de focus sur les champs
            input.addEventListener('focus', () => {
                animateLine(line, true);
                addFloatingLabel(group);
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    animateLine(line, false);
                    removeFloatingLabel(group);
                }
            });
            
            // Animation au clavier
            input.addEventListener('input', () => {
                addTypewriterEffect(input);
            });
        }
    });
}

// Animation de la ligne sous les champs
function animateLine(line, show) {
    if (show) {
        line.style.width = '100%';
        line.style.opacity = '1';
    } else {
        line.style.width = '0%';
        line.style.opacity = '0.5';
    }
}

// Effet label flottant
function addFloatingLabel(group) {
    const label = group.querySelector('label');
    if (label) {
        label.style.transform = 'translateY(-5px) scale(0.9)';
        label.style.color = '#00ccff';
    }
}

function removeFloatingLabel(group) {
    const label = group.querySelector('label');
    if (label) {
        label.style.transform = 'translateY(0) scale(1)';
        label.style.color = '#00ccff';
    }
}

// Effet machine à écrire
function addTypewriterEffect(input) {
    input.style.borderBottomColor = '#00ccff';
    input.style.boxShadow = '0 2px 10px rgba(0, 204, 255, 0.3)';
    
    setTimeout(() => {
        input.style.boxShadow = '0 2px 5px rgba(0, 204, 255, 0.1)';
    }, 150);
}

// Animations d'entrée
function initializeAnimations() {
    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll('.contact-form-section, .contact-card, .contact-item');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Animation des éléments flottants
    animateFloatingElements();
    
    // Animation du titre au chargement
    animateHeroTitle();
}

// Animation des éléments flottants
function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const duration = 4000 + (index * 1000);
        const delay = index * 500;
        
        setTimeout(() => {
            animateFloat(element, duration);
        }, delay);
    });
}

function animateFloat(element, duration) {
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;
        
        const x = Math.sin(progress * Math.PI * 2) * 20;
        const y = Math.cos(progress * Math.PI * 2) * 15;
        const rotation = progress * 360;
        
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            animateFloat(element, duration);
        }
    }
    
    requestAnimationFrame(animate);
}

// Animation du titre hero
function animateHeroTitle() {
    const title = document.querySelector('.hero-title h1');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        title.style.opacity = '1';
        
        let index = 0;
        const typeSpeed = 100;
        
        function typeWriter() {
            if (index < text.length) {
                title.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
}

// Validation du formulaire
function initializeFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const fieldGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';
    
    // Supprime les erreurs précédentes
    clearFieldError(field);
    
    // Validation selon le type de champ
    switch (field.type) {
        case 'email':
            if (field.value && !isValidEmail(field.value)) {
                isValid = false;
                errorMessage = 'Format d\'email invalide';
            }
            break;
        case 'tel':
            if (field.value && !isValidPhone(field.value)) {
                isValid = false;
                errorMessage = 'Format de téléphone invalide';
            }
            break;
        default:
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorMessage = 'Ce champ est obligatoire';
            }
    }
    
    if (!isValid && fieldGroup) {
        showFieldError(fieldGroup, errorMessage);
    }
    
    return isValid;
}

function showFieldError(fieldGroup, message) {
    const input = fieldGroup.querySelector('input, select, textarea');
    const errorElement = document.createElement('span');
    
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ff4757;
        font-size: 0.8rem;
        position: absolute;
        bottom: -20px;
        left: 0;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;
    
    fieldGroup.appendChild(errorElement);
    fieldGroup.classList.add('has-error');
    
    // Animation d'apparition
    setTimeout(() => {
        errorElement.style.opacity = '1';
        errorElement.style.transform = 'translateY(0)';
    }, 10);
    
    // Style du champ en erreur
    if (input) {
        input.style.borderBottomColor = '#ff4757';
        input.style.backgroundColor = 'rgba(255, 71, 87, 0.1)';
    }
}

function clearFieldError(field) {
    const fieldGroup = field.closest('.form-group');
    if (!fieldGroup) return;
    
    const errorElement = fieldGroup.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        setTimeout(() => errorElement.remove(), 300);
    }
    
    fieldGroup.classList.remove('has-error');
    field.style.borderBottomColor = '';
    field.style.backgroundColor = '';
}

// Utilitaires de validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[-.\s]?\d{2}){4})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Soumission du formulaire
function setupEventListeners() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Fermeture du menu mobile sur clic de lien
    const navLinks = document.querySelectorAll('.navlinks a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const navlinks = document.querySelector('.navlinks');
                const hamburger = document.querySelector('.hamburger');
                navlinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Fermer le menu lors du redimensionnement
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const navlinks = document.querySelector('.navlinks');
            const hamburger = document.querySelector('.hamburger');
            navlinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    const checkbox = document.getElementById('consent');
    
    // Validation de tous les champs
    let isFormValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Validation spécifique de la case à cocher
    if (!checkbox.checked) {
        showCheckboxError();
        isFormValid = false;
    } else {
        clearCheckboxError();
    }
    
    if (!isFormValid) {
        showFormError('Veuillez corriger les erreurs dans le formulaire');
        return;
    }
    
    // Animation du bouton de soumission
    isSubmitting = true;
    animateSubmitButton(submitBtn, 'loading');
    
    try {
        // Simulation d'envoi (remplacer par votre logique d'envoi)
        await simulateFormSubmission(new FormData(form));
        
        // Succès
        animateSubmitButton(submitBtn, 'success');
        setTimeout(() => {
            showSuccessMessage();
            resetForm(form);
            animateSubmitButton(submitBtn, 'default');
        }, 1000);
        
    } catch (error) {
        // Erreur
        animateSubmitButton(submitBtn, 'error');
        showFormError('Une erreur est survenue. Veuillez réessayer.');
        setTimeout(() => {
            animateSubmitButton(submitBtn, 'default');
        }, 2000);
    } finally {
        isSubmitting = false;
    }
}

function animateSubmitButton(btn, state) {
    if (!btn) return;
    
    const span = btn.querySelector('span');
    const icon = btn.querySelector('i');
    
    switch (state) {
        case 'loading':
            if (span) span.textContent = 'Envoi en cours...';
            if (icon) icon.className = 'fas fa-spinner fa-spin';
            btn.disabled = true;
            btn.style.background = 'linear-gradient(135deg, #6c757d 0%, #495057 100%)';
            break;
            
        case 'success':
            if (span) span.textContent = 'Message envoyé !';
            if (icon) icon.className = 'fas fa-check';
            btn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            break;
            
        case 'error':
            if (span) span.textContent = 'Erreur d\'envoi';
            if (icon) icon.className = 'fas fa-exclamation-triangle';
            btn.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
            break;
            
        case 'default':
            if (span) span.textContent = 'Envoyer le message';
            if (icon) icon.className = 'fas fa-paper-plane';
            btn.disabled = false;
            btn.style.background = 'linear-gradient(135deg, #007bff 0%, #00ccff 100%)';
            break;
    }
}

// Simulation d'envoi de formulaire
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simuler un succès dans 90% des cas
            if (Math.random() > 0.1) {
                console.log('Formulaire envoyé avec succès:', Object.fromEntries(formData));
                resolve({ success: true });
            } else {
                reject(new Error('Erreur de simulation'));
            }
        }, 2000);
    });
}

function showFormError(message) {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    let errorDiv = form.querySelector('.form-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background: rgba(255, 71, 87, 0.1);
            border: 1px solid #ff4757;
            color: #ff4757;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            font-size: 0.9rem;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    errorDiv.textContent = message;
    setTimeout(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Suppression automatique après 5 secondes
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 5000);
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('show');
        
        // Ajout d'une animation de confettis
        createConfetti();
    }
}

function closeSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.remove('show');
    }
}

function resetForm(form) {
    if (!form) return;
    
    form.reset();
    
    // Réinitialiser les styles des champs
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const line = group.querySelector('.form-line');
        
        if (input) {
            input.style.borderBottomColor = '';
            input.style.backgroundColor = '';
        }
        
        if (line) {
            line.style.width = '0%';
        }
        
        clearFieldError(input);
        removeFloatingLabel(group);
    });
    
    // Réinitialiser la case à cocher
    const checkboxContainer = document.querySelector('.checkbox-container');
    if (checkboxContainer) {
        checkboxContainer.classList.remove('checked', 'error');
    }
    clearCheckboxError();
}

// Effet confettis pour le succès
function createConfetti() {
    const colors = ['#007bff', '#00ccff', '#fff', '#f1f1f1'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;
        confettiContainer.appendChild(confetti);
    }
    
    // Suppression du conteneur après l'animation
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.remove();
        }
    }, 5000);
}

// Injection du CSS d'animation de secousse pour la case à cocher
function injectShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes confetti-fall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .has-error input,
        .has-error select,
        .has-error textarea {
            border-bottom-color: #ff4757 !important;
            background-color: rgba(255, 71, 87, 0.1) !important;
        }
        
        .checkbox-container.focused {
            box-shadow: 0 0 0 3px rgba(0, 204, 255, 0.2);
        }
        
        .checkbox-container.checked {
            border-color: rgba(0, 204, 255, 0.5);
            background: rgba(0, 204, 255, 0.05);
        }
    `;
    document.head.appendChild(style);
}

// Initialiser les animations CSS
injectShakeAnimation();

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// Support pour les navigateurs plus anciens
if (!window.FormData) {
    console.warn('FormData non supporté dans ce navigateur');
}

// Log pour vérifier que le script est chargé
console.log('Contact.js chargé avec succès');