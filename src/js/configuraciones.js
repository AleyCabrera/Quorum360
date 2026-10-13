document.addEventListener('DOMContentLoaded', function() {
    // Navegación entre secciones
    const menuLinks = document.querySelectorAll('.config-menu a');
    const sections = document.querySelectorAll('.config-section');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Actualizar menú activo
            menuLinks.forEach(link => {
                link.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Mostrar sección correspondiente
            sections.forEach(section => {
                section.classList.remove('active');
                if(section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Validación de formularios
    const forms = document.querySelectorAll('.config-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            let isValid = true;
            const requiredInputs = this.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if(!input.value.trim()) {
                    input.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if(isValid) {
                // Simular envío exitoso
                alert('Configuración guardada exitosamente');
                
                // Aquí iría la lógica real para guardar los datos
                // fetch('/api/config', { method: 'POST', body: new FormData(this) })
                // .then(response => response.json())
                // .then(data => console.log(data));
            } else {
                alert('Por favor complete todos los campos requeridos');
            }
        });
    });
    
    // Gestión de usuarios
    const addUserBtn = document.getElementById('add-user-btn');
    const cancelUserBtn = document.getElementById('cancel-user-btn');
    const userForm = document.getElementById('user-form');
    const userFormTitle = document.getElementById('user-form-title');
    const usersList = document.querySelector('.users-list');
    
    // Datos de ejemplo (en un caso real vendrían de una API)
    const sampleUsers = [
        { id: 1, name: 'Admin Principal', email: 'admin@conjunto.com', role: 'admin' },
        { id: 2, name: 'Juan Pérez', email: 'juan@conjunto.com', role: 'residente' },
        { id: 3, name: 'Servicios Generales', email: 'servicios@empresa.com', role: 'proveedor' }
    ];
    
    // Renderizar lista de usuarios
    function renderUsersList() {
        usersList.innerHTML = '';
        
        sampleUsers.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div class="user-avatar-sm">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-info-sm">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
                <div class="user-role">${getRoleName(user.role)}</div>
                <div class="user-actions">
                    <button class="edit-user" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-user" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            usersList.appendChild(userItem);
        });
        
        // Event listeners para botones de edición/eliminación
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                editUser(userId);
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                if(confirm('¿Está seguro de eliminar este usuario?')) {
                    deleteUser(userId);
                }
            });
        });
    }
    
    function getRoleName(roleKey) {
        const roles = {
            'admin': 'Administrador',
            'residente': 'Residente',
            'proveedor': 'Proveedor',
            'vigilancia': 'Vigilancia'
        };
        return roles[roleKey] || roleKey;
    }
    
    function editUser(userId) {
        const user = sampleUsers.find(u => u.id === userId);
        if(user) {
            userFormTitle.textContent = 'Editar Usuario';
            document.getElementById('user-id').value = user.id;
            document.getElementById('user-nombre').value = user.name.split(' ')[0];
            document.getElementById('user-apellido').value = user.name.split(' ')[1] || '';
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-rol').value = user.role;
            
            // Mostrar formulario si está en móvil
            if(window.innerWidth < 1200) {
                document.querySelector('.user-form-container').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    }
    
    function deleteUser(userId) {
        // En una aplicación real, aquí harías una petición DELETE a la API
        const index = sampleUsers.findIndex(u => u.id === userId);
        if(index !== -1) {
            sampleUsers.splice(index, 1);
            renderUsersList();
            alert('Usuario eliminado');
        }
    }
    
    // Nuevo usuario
    addUserBtn.addEventListener('click', function() {
        userForm.reset();
        userFormTitle.textContent = 'Nuevo Usuario';
        document.getElementById('user-id').value = '';
    });
    
    // Cancelar edición
    cancelUserBtn.addEventListener('click', function() {
        userForm.reset();
        userFormTitle.textContent = 'Nuevo Usuario';
        document.getElementById('user-id').value = '';
    });
    
    // Envío del formulario de usuario
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('user-id').value;
        const nombre = document.getElementById('user-nombre').value;
        const apellido = document.getElementById('user-apielldo').value;
        const email = document.getElementById('user-email').value;
        const rol = document.getElementById('user-rol').value;
        const password = document.getElementById('user-password').value;
        const confirmPassword = document.getElementById('user-confirm-password').value;
        
        // Validación básica
        if(!nombre || !email || !rol) {
            alert('Por favor complete los campos requeridos');
            return;
        }
        
        if(userId === '' && (!password || password !== confirmPassword)) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // En una aplicación real, aquí harías una petición POST/PUT a la API
        const userData = {
            id: userId || Math.max(...sampleUsers.map(u => u.id), 0) + 1,
            name: `${nombre} ${apellido}`.trim(),
            email,
            role: rol
        };
        
        if(userId) {
            // Editar usuario existente
            const index = sampleUsers.findIndex(u => u.id === parseInt(userId));
            if(index !== -1) {
                sampleUsers[index] = userData;
            }
        } else {
            // Agregar nuevo usuario
            sampleUsers.push(userData);
        }
        
        renderUsersList();
        userForm.reset();
        alert(`Usuario ${userId ? 'actualizado' : 'creado'} exitosamente`);
    });
    
    // Indicador de fortaleza de contraseña
    const passwordInputs = ['new-password', 'user-password'];
    
    passwordInputs.forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.addEventListener('input', function() {
                updatePasswordStrength(this.value);
            });
        }
    });
    
    function updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthValue = document.getElementById('strength-value');
        
        // Calcular fortaleza (ejemplo básico)
        let strength = 0;
        let color = '';
        let text = '';
        
        if(password.length > 0) {
            strength += 1;
            if(password.length >= 8) strength += 1;
            if(/[A-Z]/.test(password)) strength += 1;
            if(/[0-9]/.test(password)) strength += 1;
            if(/[^A-Za-z0-9]/.test(password)) strength += 1;
        }
        
        switch(strength) {
            case 0:
                color = 'transparent';
                text = '';
                break;
            case 1:
                color = 'var(--color-danger)';
                text = 'Débil';
                break;
            case 2:
                color = 'var(--color-warning)';
                text = 'Moderada';
                break;
            case 3:
                color = '#3498db';
                text = 'Buena';
                break;
            case 4:
                color = '#2ecc71';
                text = 'Fuerte';
                break;
            case 5:
                color = 'var(--color-success)';
                text = 'Muy Fuerte';
                break;
        }
        
        if(strengthBar) strengthBar.style.backgroundColor = color;
        if(strengthBar) strengthBar.style.width = `${strength * 20}%`;
        if(strengthValue) {
            strengthValue.textContent = text;
            strengthValue.style.color = color;
        }
    }
    
    // Inicializar
    renderUsersList();
    
    // Mostrar primera sección por defecto
    if(menuLinks.length > 0 && sections.length > 0) {
        menuLinks[0].click();
    }
});