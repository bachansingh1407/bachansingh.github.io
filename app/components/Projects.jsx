import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaArrowRight } from "react-icons/fa6";

export default function Projects() {
    const projects = [
        {
            id: 1,
            title: "Personal Workflow Application",
            description: "A full-stack application for those who wants to track and make changes in thier life , here you can track ideas, notes, tasks and you progress and meetings also.",
            image: "/projects/pworkflow.png",
            tags: ["Next.js", "Node.js", "MongoDB", "Express"],
            githubLink: "https://github.com/bachansingh1407/Workflow-portfolio-application",
            featured: true
        },
        {
            id: 2,
            title: "DoShare - Secure File Sharing",
            description: "A secure file-sharing platform with role-based authentication and print-only access control for print shop environments.",
            image: "/projects/doshare.png",
            tags: [
                "React",
                "Node.js",
                "Express",
                "MongoDB",
                "TypeScript",
            ],
            githubLink: "https://github.com/bachankapoor1407/DoShare-File-Sharing-and-managing-web-application",
            featured: true
        },
        {
            id: 3,
            title: "E-commerce Platform",
            description: "Full-featured shopping platform with product filtering, cart management, and secure checkout using modern React patterns.",
            image:  "/projects/ecommerce.png",
            tags: [
                "React 18",
                "Redux",
                "Node.js",
                "MongoDB",
                "Styled Components",
            ],
            githubLink: "https://github.com/bachansingh1407/Ecommerce-platform-using-mern-stack",
            featured: false
        },
        {
            id: 4,
            title: "HR Management Systems",
            description: "Comprehensive HR management system with employee tracking, attendance, and secure role-based access control.",
            image:  "/projects/hrproject.png",
            tags: [
                "React",
                "Node.js",
                "Express",
                "MongoDB",
                "JWT",
            ],
            githubLink: "https://github.com/bachansingh1407/HR-Dashboard-MERN-stack-project",
            featured: false
        },
        {
            id: 5,
            title: "Blogging Application",
            description: "Full-stack blogging platform with user authentication, content management, and real-time blog operations.",
            image: "/projects/blogs.png",
            tags: [
                "React",
                "Node.js",
                "MySQL",
                "JWT",
                "Multer",
            ],
            githubLink: "https://github.com/bachansingh1407/Blogging-Application-using-React",
            featured: false
        },
    ];

    return (
        <section id="projects" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 capitalize mb-4">
                         My <span className="text-blue-600">Projects</span>
                    </h2>
                    
                    <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-purple-600 mx-auto mb-4"></div>
                    <p className="text-md text-gray-600 max-w-2xl mx-auto">
                        Here are some of my recent works that showcase my skills and creativity
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="group bg-white border border-gray-200 rounded-xl px-4 py-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                                <div className="h-40 bg-linear-to-br from-green-400 to-blue-500 rounded-lg mb-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors">
                                    
                                     <Image 
                                        src={project.image} 
                                        alt={project.title}
                                        fill
                                        className="object-cover object-top border border-gray-200"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                                    
                                    </div>
                                </div>

                                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                    {project.title}
                                </h4>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {project.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-gray-700 text-sm font-medium hover:text-black transition-colors"
                                >
                                    <FaGithub className="text-lg" />
                                    View Code
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explore More Button */}
                <div className="text-center">
                    <Link
                        href="https://github.com/bachansingh1407"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:shadow-lg group"
                    >
                        <span>Explore More Projects</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </section>
    );
}