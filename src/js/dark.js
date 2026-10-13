document.addEventListener('DOMContentLoaded', () => {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    darkModeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});

