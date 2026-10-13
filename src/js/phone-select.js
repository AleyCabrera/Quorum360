document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const countrySelect = document.getElementById('country-code');
    const countrySearch = document.getElementById('country-search');
    const flagImg = document.getElementById('selected-flag-img');
    const phoneInput = document.getElementById('phone');
    const errorMessage = document.getElementById('error-message');
    const copyButton = document.querySelector('.copy-button');

    // Cache para banderas y datos de países
    const flagCache = new Map();
    let countryData = null;

    // Patrones de validación por país
    const phonePatterns = {
        'co': { 
            pattern: '[0-9]{10}', 
            placeholder: '3001234567', 
            minLength: 10, 
            maxLength: 10,
            invalidNumbers: ['0000000000', '1111111111']
        },
        'us': { 
            pattern: '[0-9]{10}', 
            placeholder: '2025550123', 
            minLength: 10, 
            maxLength: 10,
            invalidNumbers: ['0000000000', '1234567890']
        },
        'gb': { 
            pattern: '[0-9]{11}', 
            placeholder: '07911123456', 
            minLength: 11, 
            maxLength: 11,
            invalidNumbers: ['00000000000']
        },
        'es': { 
            pattern: '[0-9]{9}', 
            placeholder: '612345678', 
            minLength: 9, 
            maxLength: 9,
            invalidNumbers: ['000000000']
        },
        'mx': { 
            pattern: '[0-9]{10}', 
            placeholder: '5512345678', 
            minLength: 10, 
            maxLength: 10,
            invalidNumbers: ['0000000000']
        },
        'pe': { 
            pattern: '[0-9]{9}', 
            placeholder: '912345678', 
            minLength: 9, 
            maxLength: 9,
            invalidNumbers: ['000000000']
        },
        'ar': { 
            pattern: '[0-9]{10}', 
            placeholder: '1123456789', 
            minLength: 10, 
            maxLength: 10,
            invalidNumbers: ['0000000000']
        },
        'cl': { 
            pattern: '[0-9]{9}', 
            placeholder: '912345678', 
            minLength: 9, 
            maxLength: 9,
            invalidNumbers: ['000000000']
        },
        'br': { 
            pattern: '[0-9]{11}', 
            placeholder: '11912345678', 
            minLength: 11, 
            maxLength: 11,
            invalidNumbers: ['00000000000']
        },
        've': { 
            pattern: '[0-9]{10}', 
            placeholder: '4121234567', 
            minLength: 10, 
            maxLength: 10,
            invalidNumbers: ['0000000000']
        }
    };

    // Función para cargar bandera con lazy loading
    async function loadFlag(countryCode) {
        if (flagCache.has(countryCode)) {
            flagImg.src = flagCache.get(countryCode);
            return;
        }

        const flagUrl = `https://flagcdn.com/w20/${countryCode}.png`;
        
        try {
            // Verificar si la imagen existe
            const response = await fetch(flagUrl, { method: 'HEAD' });
            if (response.ok) {
                flagCache.set(countryCode, flagUrl);
                flagImg.src = flagUrl;
                
                // Efecto de fade in
                flagImg.onload = () => {
                    flagImg.classList.add('loaded');
                };
            }
        } catch (error) {
            console.error('Error cargando bandera:', error);
        }
    }

    // Función para actualizar la bandera y el patrón del teléfono
    function updateFlagAndPattern() {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];
        const countryCode = selectedOption.getAttribute('data-flag');
        
        // Remover clase loaded para el efecto de fade
        flagImg.classList.remove('loaded');
        
        // Cargar bandera
        loadFlag(countryCode);
        
        // Actualizar patrón y placeholder del input
        const patternData = phonePatterns[countryCode];
        if (patternData) {
            phoneInput.pattern = patternData.pattern;
            phoneInput.placeholder = patternData.placeholder;
            phoneInput.maxLength = patternData.maxLength;
            phoneInput.minLength = patternData.minLength;
            
            // Anunciar cambio para lectores de pantalla
            errorMessage.setAttribute('aria-live', 'polite');
            errorMessage.textContent = `Formato esperado: ${patternData.placeholder}`;
            setTimeout(() => errorMessage.textContent = '', 3000);
        }
    }

    // Función para formatear número de teléfono
    function formatPhoneNumber(event) {
        const input = event.target;
        let value = input.value.replace(/\D/g, '');
        
        const countryCode = countrySelect.options[countrySelect.selectedIndex].getAttribute('data-flag');
        const patternData = phonePatterns[countryCode];
        
        if (patternData) {
            if (value.length > patternData.maxLength) {
                value = value.slice(0, patternData.maxLength);
            }
            
            // Formatear número según el país
            switch(countryCode) {
                case 'us':
                    if (value.length > 6) {
                        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                    } else if (value.length > 3) {
                        value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2');
                    }
                    break;
                // Agregar más formatos específicos por país
            }
        }
        
        input.value = value;
    }

    // Función para validar número de teléfono
    function validatePhone() {
        const countryCode = countrySelect.options[countrySelect.selectedIndex].getAttribute('data-flag');
        const patternData = phonePatterns[countryCode];
        const value = phoneInput.value.replace(/\D/g, '');
        
        if (!value) {
            errorMessage.textContent = 'El número de teléfono es requerido';
            return false;
        }
        
        if (value.length < patternData.minLength) {
            errorMessage.textContent = `El número debe tener al menos ${patternData.minLength} dígitos`;
            return false;
        }
        
        if (value.length > patternData.maxLength) {
            errorMessage.textContent = `El número no debe exceder ${patternData.maxLength} dígitos`;
            return false;
        }
        
        if (patternData.invalidNumbers && patternData.invalidNumbers.includes(value)) {
            errorMessage.textContent = 'Número de teléfono inválido';
            return false;
        }
        
        if (!new RegExp('^' + patternData.pattern + '$').test(value)) {
            errorMessage.textContent = 'Formato de número inválido para el país seleccionado';
            return false;
        }
        
        errorMessage.textContent = '';
        return true;
    }

    // Función para copiar número en formato internacional
    function copyInternationalNumber() {
        const countryCode = countrySelect.value;
        const phoneNumber = phoneInput.value.replace(/\D/g, '');
        const internationalNumber = `${countryCode}${phoneNumber}`;
        
        navigator.clipboard.writeText(internationalNumber).then(() => {
            copyButton.classList.add('copied');
            setTimeout(() => copyButton.classList.remove('copied'), 2000);
            
            // Anunciar para lectores de pantalla
            errorMessage.textContent = 'Número copiado al portapapeles';
            setTimeout(() => errorMessage.textContent = '', 2000);
        }).catch(err => {
            console.error('Error al copiar:', err);
            errorMessage.textContent = 'Error al copiar el número';
        });
    }

    // Función para filtrar países
    function filterCountries(searchTerm) {
        const options = countrySelect.options;
        const term = searchTerm.toLowerCase();
        
        for (let option of options) {
            const searchText = option.getAttribute('data-search');
            if (searchText.includes(term)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        }
    }

    // Event Listeners
    countrySelect.addEventListener('change', updateFlagAndPattern);
    phoneInput.addEventListener('input', formatPhoneNumber);
    phoneInput.addEventListener('blur', validatePhone);
    copyButton.addEventListener('click', copyInternationalNumber);
    
    // Búsqueda de países
    countrySearch.addEventListener('focus', () => {
        countrySearch.classList.add('active');
    });
    
    countrySearch.addEventListener('blur', (e) => {
        if (!e.relatedTarget || !e.relatedTarget.closest('.country-select-wrapper')) {
            setTimeout(() => {
                countrySearch.classList.remove('active');
            }, 200);
        }
    });
    
    countrySearch.addEventListener('input', (e) => {
        filterCountries(e.target.value);
    });

    // Detectar país automáticamente
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            countryData = data;
            const countryCode = data.country.toLowerCase();
            const option = Array.from(countrySelect.options)
                .find(opt => opt.getAttribute('data-flag') === countryCode);
            
            if (option) {
                option.selected = true;
                updateFlagAndPattern();
            }
        })
        .catch(error => console.error('Error detectando país:', error));

    // Inicializar
    updateFlagAndPattern();
});
