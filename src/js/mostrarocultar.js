document.addEventListener("DOMContentLoaded", () => {
    const togglePassword = document.querySelector(".toggle-password");
    const passwordField = document.querySelector("#password");
    const eyeIcon = togglePassword.querySelector(".icon-eye");

    togglePassword.addEventListener("click", () => {
        const isPasswordVisible = passwordField.type === "text";
        passwordField.type = isPasswordVisible ? "password" : "text";
        eyeIcon.classList.toggle("fa-eye", isPasswordVisible);
        eyeIcon.classList.toggle("fa-eye-slash", !isPasswordVisible);
    });
});
