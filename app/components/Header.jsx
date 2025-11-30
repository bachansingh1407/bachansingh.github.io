"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiFileText, FiMenu, FiX } from "react-icons/fi";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const navLinks = [
        { href: "#projects", label: "Projects" },
        { href: "#skills", label: "Skills" },
        { href: "#experience", label: "Experience" },
        { href: "#contact", label: "Contact" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if (scrollTop > 10) {
                setHasScrolled(true);
            } else {
                setHasScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleResumeClick = () => {
        const resumeUrl = "/resume.pdf";
        window.open(resumeUrl, "_blank");
    };

    const handleNavClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={`px-4 w-full bg-white sticky top-0 z-50 transition-all duration-300 ${
            hasScrolled ? "border-b border-gray-200 shadow-sm" : "border-b-0"
        }`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link 
                        href="/" 
                        className="font-bold text-xl sm:text-2xl text-gray-900 hover:text-blue-600 transition-colors duration-200"
                        onClick={handleNavClick}
                    >
                        Bachan Singh
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200 relative group py-2"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Resume Button */}
                    <div className="hidden md:flex">
                        <button
                            onClick={handleResumeClick}
                            className="flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 lg:px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium hover:shadow-md active:scale-95"
                        >
                            <FiFileText className="text-sm" />
                            <span className="text-sm">Resume</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden fixed top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-5 duration-300">
                        <nav className="flex flex-col p-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm uppercase tracking-wide"
                                    onClick={handleNavClick}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <button 
                                onClick={() => {
                                    handleResumeClick();
                                    handleNavClick();
                                }}
                                className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all duration-200 mt-2 font-medium"
                            >
                                <FiFileText className="text-sm" />
                                <span className="text-sm">Download Resume</span>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}