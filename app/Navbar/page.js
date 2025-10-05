"use client"
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [activeSection, setActiveSection] = useState("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            
            if (current) {
                setActiveSection(current);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: "Home", href: "#home", section: "home", icon: "🏠" },
        { name: "About", href: "#about", section: "about", icon: "👤" },
        { name: "Skills", href: "#skills", section: "skills", icon: "⚡" },
        { name: "Projects", href: "#projects", section: "projects", icon: "💼" },
        { name: "Experience", href: "#experience", section: "experience", icon: "🚀" },
        { name: "Contact", href: "#contact", section: "contact", icon: "📞" }
    ];

    return (
        <>
            {/* Desktop Sidebar Navigation */}
            <nav className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-4">
                    <div className="flex flex-col space-y-3">
                        {/* Logo */}
                        <Link 
                            href="#home" 
                            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl text-white font-bold text-lg mb-4 hover:scale-110 transition-transform duration-200 shadow-lg"
                        >
                            B
                        </Link>
                        
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                                    activeSection === item.section 
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                
                                {/* Tooltip */}
                                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                    {item.name}
                                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-r-slate-800 border-t-transparent border-b-transparent"></div>
                                </div>

                                {/* Active indicator */}
                                {activeSection === item.section && (
                                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-md">
                <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-3">
                    <div className="flex items-center justify-between">
                        {navItems.slice(0, 4).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                                    activeSection === item.section 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className="text-2xl mb-1">{item.icon}</span>
                                <span className="text-xs font-medium">{item.name}</span>
                                
                                {activeSection === item.section && (
                                    <div className="absolute -top-1 w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                                )}
                            </Link>
                        ))}
                        
                        {/* More Menu Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                                isMobileMenuOpen 
                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span className="text-2xl mb-1">⚙️</span>
                            <span className="text-xs font-medium">More</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Expanded Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-sm">
                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {navItems.slice(4).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                        activeSection === item.section 
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}
                            
                            {/* Contact CTA */}
                            <Link
                                href="#contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 col-span-2 justify-center"
                            >
                                <span>📧</span>
                                Get In Touch
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Tablet Top Navigation */}
            <nav className="hidden md:block lg:hidden fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-2xl">
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link 
                            href="#home" 
                            className="flex items-center gap-3 group"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                                B
                            </div>
                            <div>
                                <div className="text-white font-semibold">Bachan Singh</div>
                                <div className="text-emerald-400 text-sm">Frontend Developer</div>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <div className="flex items-center space-x-2">
                            {navItems.slice(1, 5).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        activeSection === item.section 
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Contact Button */}
                        <Link
                            href="#contact"
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Backdrop for mobile menu */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </>
    );
}