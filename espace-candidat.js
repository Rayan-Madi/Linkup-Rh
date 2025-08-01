// Navigation mobile toggle
function toggleMenu() {
    const navlinks = document.querySelector('.navlinks');
    const hamburger = document.querySelector('.hamburger');
    
    navlinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Fermer le menu mobile lors du clic sur un lien
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navlinks a');
    const navlinks = document.querySelector('.navlinks');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navlinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});

// Gestion des fichiers uploadés
function setupFileUpload() {
    const fileInputs = document.querySelectorAll('.file-input');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const infoDiv = document.getElementById(input.id + 'Info');
            
            if (file) {
                // Vérifier la taille du fichier (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Le fichier est trop volumineux. Taille maximum : 5MB');
                    input.value = '';
                    infoDiv.classList.remove('show');
                    return;
                }
                
                // Vérifier le type de fichier pour les CV et lettres de motivation
                if (input.accept === 'application/pdf' && file.type !== 'application/pdf') {
                    alert('Seuls les fichiers PDF sont acceptés pour ce champ.');
                    input.value = '';
                    infoDiv.classList.remove('show');
                    return;
                }
                
                // Afficher les informations du fichier
                const fileSize = (file.size / 1024 / 1024).toFixed(2);
                infoDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <strong>${file.name}</strong> (${fileSize} MB)
                `;
                infoDiv.classList.add('show');
            } else {
                infoDiv.classList.remove('show');
            }
        });
    });
}

// Validation des champs
function validateField(field) {
    const fieldContainer = field.parentElement;
    const fieldError = fieldContainer.querySelector('.field-error');
    
    // Supprimer les classes d'erreur existantes
    fieldContainer.classList.remove('has-error');
    if (fieldError) {
        fieldError.remove();
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // Validation selon le type de champ
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Ce champ est obligatoire';
    } else if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Format d\'email invalide';
        }
    } else if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!phoneRegex.test(field.value.trim().replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Format de téléphone invalide';
        }
    }
    
    if (!isValid) {
        fieldContainer.classList.add('has-error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.textContent = errorMessage;
        fieldContainer.appendChild(errorSpan);
        setTimeout(() => errorSpan.classList.add('animate-in'), 10);
    }
    
    return isValid;
}

// Validation des checkboxes obligatoires
function validateCheckboxes() {
    const requiredCheckboxes = document.querySelectorAll('input[type="checkbox"][required]');
    let allValid = true;
    
    requiredCheckboxes.forEach(checkbox => {
        const container = checkbox.closest('.checkbox-container');
        const errorDiv = container.parentElement.querySelector('.checkbox-error');
        
        container.classList.remove('error');
        errorDiv.classList.remove('show');
        
        if (!checkbox.checked) {
            container.classList.add('error');
            errorDiv.classList.add('show');
            allValid = false;
        }
    });
    
    return allValid;
}

// Validation des fichiers obligatoires
function validateFiles() {
    const requiredFiles = document.querySelectorAll('.file-input[required]');
    let allValid = true;
    
    requiredFiles.forEach(fileInput => {
        const label = document.querySelector(`label[for="${fileInput.id}"]`);
        
        if (!fileInput.files.length) {
            label.style.borderColor = '#ff4757';
            label.style.background = 'rgba(255, 71, 87, 0.1)';
            allValid = false;
        } else {
            label.style.borderColor = '';
            label.style.background = '';
        }
    });
    
    return allValid;
}

// Animation de soumission du formulaire
function animateSubmitButton(isSubmitting) {
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');
    
    if (isSubmitting) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        btnText.textContent = 'Envoi en cours...';
        btnIcon.className = 'fas fa-spinner fa-spin';
    } else {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        btnText.textContent = 'Envoyer ma candidature';
        btnIcon.className = 'fas fa-paper-plane';
    }
}

// Gestion de la soumission du formulaire
function setupFormSubmission() {
    const form = document.getElementById('candidateForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validation de tous les champs
        const formFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let formValid = true;
        
        formFields.forEach(field => {
            if (!validateField(field)) {
                formValid = false;
            }
        });
        
        // Validation des checkboxes
        if (!validateCheckboxes()) {
            formValid = false;
        }
        
        // Validation des fichiers
        if (!validateFiles()) {
            formValid = false;
        }
        
        if (!formValid) {
            // Faire défiler vers le premier champ d'erreur
            const firstError = form.querySelector('.has-error, .error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Animation du bouton de soumission
        animateSubmitButton(true);
        
        try {
            // Préparer les données du formulaire
            const formData = new FormData(form);
            
            // Envoyer le formulaire
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                // Succès - afficher le message de confirmation
                showSuccessMessage();
                form.reset();
                
                // Réinitialiser les informations de fichiers
                document.querySelectorAll('.file-info').forEach(info => {
                    info.classList.remove('show');
                });
                
                // Réinitialiser les styles des labels de fichiers
                document.querySelectorAll('.file-upload-label').forEach(label => {
                    label.style.borderColor = '';
                    label.style.background = '';
                });
            } else {
                throw new Error('Erreur lors de l\'envoi du formulaire');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'envoi de votre candidature. Veuillez réessayer.');
        } finally {
            animateSubmitButton(false);
        }
    });
}

// Afficher le message de succès
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // Faire défiler vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fermer le message de succès
function closeSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('show');
}

// Validation en temps réel
function setupRealTimeValidation() {
    const formFields = document.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        // Validation lors de la perte de focus
        field.addEventListener('blur', function() {
            if (this.value.trim() || this.hasAttribute('required')) {
                validateField(this);
            }
        });
        
        // Supprimer l'erreur lors de la saisie
        field.addEventListener('input', function() {
            const fieldContainer = this.parentElement;
            if (fieldContainer.classList.contains('has-error')) {
                fieldContainer.classList.remove('has-error');
                const errorSpan = fieldContainer.querySelector('.field-error');
                if (errorSpan) {
                    errorSpan.remove();
                }
            }
        });
    });
    
    // Validation des checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const container = this.closest('.checkbox-container');
            const errorDiv = container.parentElement.querySelector('.checkbox-error');
            
            if (this.checked) {
                container.classList.remove('error');
                errorDiv.classList.remove('show');
            }
        });
    });
}

// Animation des éléments flottants
function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Ajouter une animation aléatoire à chaque élément
        element.style.animationDelay = `${index * 2}s`;
        element.style.animationDuration = `${8 + Math.random() * 4}s`;
    });
}

// Effet de parallaxe simple pour les éléments flottants
function setupParallax() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Initialisation de tous les composants
document.addEventListener('DOMContentLoaded', function() {
    setupFileUpload();
    setupFormSubmission();
    setupRealTimeValidation();
    animateFloatingElements();
    setupParallax();
    
    // Fermer le message de succès en cliquant en dehors
    document.getElementById('successMessage').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessMessage();
        }
    });
    
    // Fermer le message de succès avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSuccessMessage();
        }
    });
});

// Animation d'apparition des sections au scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les sections principales
    const sections = document.querySelectorAll('.intro-card, .form-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// Démarrer les animations de scroll après le chargement
window.addEventListener('load', setupScrollAnimations);