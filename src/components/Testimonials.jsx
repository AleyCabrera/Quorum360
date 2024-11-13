import React from "react";

const testimonials = [
    {
        name: "Laura González",
        role: "Contadora Pública",
        feedback: "Quorum360 facilita la generación de estados financieros...",
        image: "/assets/images/test2.png",
    },
    {
        name: "Juan Martínez",
        role: "Administrador de Propiedad Horizontal",
        feedback: "El sistema me permite llevar el control de los procesos...",
        image: "/assets/images/test1.png",
    },
];

function Testimonials() {
    return (
        <section className="py-10 bg-gray-50">
        <h2 className="text-center text-2xl font-bold mb-6">Testimonios</h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, index) => (
            <div key={index} className="p-4 bg-white rounded shadow">
                <img src={t.image} alt={t.name} className="w-16 h-16 mx-auto rounded-full mb-4" />
                <h4 className="text-lg font-bold">{t.name}</h4>
                <h5 className="text-sm text-gray-500">{t.role}</h5>
                <p className="mt-2">{t.feedback}</p>
            </div>
            ))}
        </div>
        </section>
    );
}

export default Testimonials;
