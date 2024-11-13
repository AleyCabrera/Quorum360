import React from "react";

function Gallery() {
    const images = [
        "/assets/images/image1.png",
        "/assets/images/image2.png",
        "/assets/images/image3.jpg",
        "/assets/images/image4.jpg",
        "/assets/images/image5.jpg",
    ];

    return (
            <section className="py-10 bg-white">
            <h2 className="text-center text-2xl font-bold mb-6">Galería</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {images.map((img, index) => (
                <img key={index} src={img} alt={`Imagen ${index}`} className="rounded shadow" />
                ))}
            </div>
            </section>
        );
    }

export default Gallery;
