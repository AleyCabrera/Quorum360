import React from "react";

function Header() {
    return (
        <header className="bg-gray-900 text-white">
        <div className="flex justify-between items-center py-4 px-6">
            <img src="/assets/images/Q360.png" alt="Quorum360" className="h-10" />
            <nav className="flex space-x-6">
            <a href="inicio_secion.html" className="hover:text-yellow-500">Administrador</a>
            <a href="inicio_secion.html" className="hover:text-yellow-500">Residente</a>
            <a href="#" className="hover:text-yellow-500">Comunidad</a>
            <a href="#" className="hover:text-yellow-500">Servicios</a>
            <a href="#" className="hover:text-yellow-500">Soporte</a>
            <a href="#" className="hover:text-yellow-500">Contacto</a>
            </nav>
            <div>
            <a href="inicio_secion.html" className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">Iniciar Sesión</a>
            <a href="#" className="ml-4 border px-4 py-2 rounded hover:bg-yellow-500">Registrarse</a>
            </div>
        </div>
        </header>
    );
}

export default Header;

