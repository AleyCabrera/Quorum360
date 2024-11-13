import React from "react";

function Hero() {
    return (
        <section className="bg-gray-100 py-10 text-center">
        <div className="max-w-3xl mx-auto">
            <img src="/assets/images/Q360-1.png" alt="Quorum360" className="mx-auto w-32" />
            <div className="mt-6 space-y-4">
            <a href="inicio_secion.html" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Administrador</a>
            <a href="inicio_secion.html" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Residente</a>
            </div>
        </div>
        </section>
    );
}

export default Hero;
