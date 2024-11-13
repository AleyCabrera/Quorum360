import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Gallery from "./Gallery";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

function App() {
    return (
        <div className="font-sans">
        <Header />
        <main>
            <Hero />
            <Gallery />
            <Testimonials />
        </main>
        <Footer />
        </div>
    );
}

export default App;

