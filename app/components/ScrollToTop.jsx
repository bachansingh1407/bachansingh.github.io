"use client";
import { FaAngleUp } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { FiCornerLeftUp } from 'react-icons/fi';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-4 cursor-pointer rounded-full shadow-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300 z-50 group"
                    aria-label="Scroll to top"
                >
                    <FiCornerLeftUp className="text-gray-600 text-xl group-hover:text-blue-600 transition-colors" />
                </button>
            )}
        </>
    );
}