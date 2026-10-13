document.addEventListener("DOMContentLoaded", () => {
    const flagIcon = document.getElementById("flag-icon");
    const countryCodeSelect = document.getElementById("country-code");
    const phoneInput = document.getElementById("phone");
    const errorMessage = document.getElementById("error-message");

    // Función para actualizar bandera y patrón dinámico
    const updateFlagAndPattern = () => {
        const selectedOption = countryCodeSelect.selectedOptions[0];
        const flag = selectedOption.dataset.flag;
        const pattern = selectedOption.dataset.pattern;

        flagIcon.src = flag;
        phoneInput.pattern = pattern;
        errorMessage.textContent = ""; // Limpia el mensaje de error
    };

    // Detección automática del país
    axios.get("https://ipapi.co/json/")
        .then(response => {
            const data = response.data;
            const countryCode = data.country_calling_code;
            const countryFlag = data.country_flag;

            const optionToSelect = Array.from(countryCodeSelect.options).find(
                option => option.value === countryCode
            );

            if (optionToSelect) {
                optionToSelect.selected = true;
                updateFlagAndPattern();
            }
        })
        .catch(error => {
            console.error("Error al detectar el país:", error);
        });

    // Cambia la bandera y patrón cuando se selecciona otro país
    countryCodeSelect.addEventListener("change", updateFlagAndPattern);

    // Validación personalizada
    document.querySelector(".form").addEventListener("submit", (event) => {
        if (!phoneInput.checkValidity()) {
            event.preventDefault();
            errorMessage.textContent = "Por favor, ingresa un número válido según el país seleccionado.";
        }
    });
});
