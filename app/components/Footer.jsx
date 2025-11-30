import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";

export default function Footer() {
    const socialLinks = [
        {
            name: "LinkedIn",
            url: "https://linkedin.com/in/bachan-singh",
            icon: <FaLinkedinIn className="text-xl" />,
        },
        {
            name: "GitHub", 
            url: "https://github.com/bachansingh1407",
            icon: <FaGithub className="text-xl" />,
        },
        {
            name: "Email",
            url: "mailto:bachansingh1407@gmail.com", 
            icon: <TbMailFilled className="text-xl" />,
        }
    ];

    return (
        <footer className="w-full bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row-reverse justify-between items-center gap-5 py-6 px-6">
                
                {/* Copyright */}
                <p className="text-gray-600 text-sm mb-4 md:mb-0">
                    © {new Date().getFullYear()} Bachan Singh. All rights reserved.
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-6">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.url}
                            target={social.name !== "Email" ? "_blank" : "_self"}
                            rel={social.name !== "Email" ? "noopener noreferrer" : ""}
                            className="text-gray-500 hover:text-gray-800 transition-colors duration-300"
                            aria-label={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}