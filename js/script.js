/**
 * This script handles mobile menu toggling, smooth scrolling,
 * a welcome message prompt, and contact form validation for a single-page site.
 */

document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Functionality ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                 mobileMenu.classList.add('hidden');
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Animated Welcome Overlay ---
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const welcomeBox = document.getElementById('welcome-box');
    const nameForm = document.getElementById('name-form');
    const nameInput = document.getElementById('name-input');
    const welcomeMessageElement = document.getElementById('welcome-message');

    function handleWelcome(name) {
        // Update the main welcome message on the hero section
        welcomeMessageElement.textContent = `Hi ${name}, Welcome to Your Digital Marketplace`;
        
        // Start fade out animation for the overlay
        welcomeOverlay.classList.add('hidden');
    }

    // Check if a name is already stored in sessionStorage
    const storedName = sessionStorage.getItem('userName');

    if (storedName) {
        // If name exists, skip the animation and just set the content
        handleWelcome(storedName);
        welcomeOverlay.style.display = 'none'; // Hide overlay completely
    } else {
        // If no name, start the animation sequence
        // 1. After a short delay, fade in the welcome box
        setTimeout(() => {
            welcomeBox.classList.add('visible');
        }, 500); // 500ms delay

        // 2. Listen for form submission
        nameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let userName = nameInput.value.trim();
            if (userName === '') {
                userName = 'Guest';
            }
            sessionStorage.setItem('userName', userName);
            handleWelcome(userName);
        });
    }


    // --- Contact Form Validation and Submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameContactInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');
        const formSubmissionResult = document.getElementById('formSubmissionResult');
        const submittedData = document.getElementById('submittedData');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = validateForm();
            
            if (isValid) {
                submittedData.innerHTML = `
                    <p><strong>Name:</strong> ${escapeHTML(nameContactInput.value)}</p>
                    <p><strong>Email:</strong> ${escapeHTML(emailInput.value)}</p>
                    <p><strong>Phone:</strong> ${escapeHTML(phoneInput.value)}</p>
                    <p><strong>Message:</strong> ${escapeHTML(messageInput.value)}</p>
                `;
                formSubmissionResult.classList.remove('hidden');
                
                contactForm.reset();
                clearAllErrors();

                formSubmissionResult.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } else {
                // Bug Fix: Corrected typo from 'formSubmission-result' to 'formSubmissionResult'
                formSubmissionResult.classList.add('hidden');
            }
        });

        function validateForm() {
            let isValid = true;
            clearAllErrors();

            if (nameContactInput.value.trim() === '') {
                setError(nameContactInput, 'Name is required.');
                isValid = false;
            }

            if (emailInput.value.trim() === '') {
                setError(emailInput, 'Email is required.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                setError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            if (phoneInput.value.trim() === '') {
                setError(phoneInput, 'Phone number is required.');
                isValid = false;
            } else if (!isValidPhone(phoneInput.value.trim())) {
                setError(phoneInput, 'Please enter a valid phone number (at least 7 digits).');
                isValid = false;
            }

            if (messageInput.value.trim() === '') {
                setError(messageInput, 'Message is required.');
                isValid = false;
            }

            return isValid;
        }

        function setError(inputElement, message) {
            const formControl = inputElement.parentElement;
            const errorDiv = formControl.querySelector('.error-message');
            
            formControl.classList.add('error');
            errorDiv.innerText = message;
        }
        
        function clearAllErrors() {
             const errorControls = contactForm.querySelectorAll('.form-control.error');
             errorControls.forEach(control => {
                control.classList.remove('error');
                const errorDiv = control.querySelector('.error-message');
                if(errorDiv) {
                    errorDiv.innerText = '';
                }
             });
        }

        function isValidEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        function isValidPhone(phone) {
            const re = /^\d{7,}$/;
            return re.test(phone);
        }

        function escapeHTML(str) {
            const p = document.createElement("p");
            p.appendChild(document.createTextNode(str));
            return p.innerHTML;
        }
    }
});
