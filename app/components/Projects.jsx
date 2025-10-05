import React from "react";
import Image from "next/image";

const Projects = () => {
  const projectDetails = [
    {
      title: "DoShare - Secure File Sharing",
      cover_image: "/assets/doshare.png",
      description: "A secure file-sharing platform with role-based authentication and print-only access control for print shop environments.",
      tech_stack: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "TypeScript",
      ],
      github_url: "https://github.com/bachankapoor/DoShare-File-Sharing-and-managing-web-application",
      live_url: "#",
      gradient: "from-purple-500 to-pink-500",
      accentColor: "purple"
    },
    {
      title: "E-commerce Platform",
      cover_image: "/assets/ecommerce.png",
      description: "Full-featured shopping platform with product filtering, cart management, and secure checkout using modern React patterns.",
      tech_stack: [
        "React 18",
        "Redux",
        "Node.js",
        "MongoDB",
        "Styled Components",
      ],
      github_url: "https://github.com/bachansingh1407/Ecommerce-platform-using-mern-stack",
      live_url: "#",
      gradient: "from-blue-500 to-cyan-500",
      accentColor: "blue"
    },
    {
      title: "HRMS Dashboard",
      cover_image: "/assets/hrproject.png",
      description: "Comprehensive HR management system with employee tracking, attendance, and secure role-based access control.",
      tech_stack: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "JWT",
      ],
      github_url: "https://github.com/bachansingh1407/HR-Dashboard-MERN-stack-project",
      live_url: "#",
      gradient: "from-green-500 to-emerald-500",
      accentColor: "green"
    },
    {
      title: "Blog Platform",
      cover_image: "/assets/blogs.png",
      description: "Full-stack blogging platform with user authentication, content management, and real-time blog operations.",
      tech_stack: [
        "React",
        "Node.js",
        "MySQL",
        "JWT",
        "Multer",
      ],
      github_url: "https://github.com/bachansingh1407/Blogging-Application-using-React",
      live_url: "#",
      gradient: "from-orange-500 to-red-500",
      accentColor: "orange"
    },
    {
      title: "Auth System",
      cover_image: "/assets/authproject.png",
      description: "Secure JWT-based authentication system with protected routes and session management for full-stack applications.",
      tech_stack: [
        "React",
        "Node.js",
        "Express",
        "MySQL",
        "JWT",
      ],
      github_url: "https://github.com/bachansingh1407/React-Authentication-using-Jwt",
      live_url: "#",
      gradient: "from-indigo-500 to-purple-500",
      accentColor: "indigo"
    },
    // {
    //   title: "Portfolio Website",
    //   cover_image: "/assets/portfolio.png", // You can add this image
    //   description: "Modern, responsive portfolio website showcasing my skills and projects with stunning animations and dark theme.",
    //   tech_stack: [
    //     "Next.js",
    //     "React",
    //     "Tailwind CSS",
    //     "TypeScript",
    //     "Framer Motion",
    //   ],
    //   github_url: "https://github.com/bachansingh1407/your-portfolio-repo", // Update with your repo
    //   live_url: "#",
    //   gradient: "from-cyan-500 to-blue-500",
    //   accentColor: "cyan"
    // }
  ];

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          {/* <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-green-400 text-sm font-medium">Active Projects</span>
          </div> */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Featured <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transforming ideas into functional, beautiful digital experiences. Each project represents a unique challenge and learning opportunity.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {projectDetails.map((project, index) => (
            <div key={index} className="group relative">
              {/* Card Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>

              {/* Main Card */}
              <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 shadow-2xl overflow-hidden h-full flex flex-col">

                {/* Project Image */}
                <div className="h-48 overflow-hidden relative">
                  <Image
                    src={project.cover_image}
                    alt={project.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent`}></div>
                  {/* Tech Stack Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg border border-white/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg border border-white/20">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-center py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 group/btn"
                    >
                      <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      Code
                    </a>

                    {project.live_url && project.live_url !== "#" && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 bg-gradient-to-r ${project.gradient} text-white text-center py-2 px-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group/btn`}
                      >
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Statistics */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { number: '6+', label: 'Projects Completed', color: 'text-purple-400' },
            { number: '5k+', label: 'Lines of Code', color: 'text-cyan-400' },
            { number: '15+', label: 'Technologies Used', color: 'text-green-400' },
            { number: '100%', label: 'Client Satisfaction', color: 'text-orange-400' }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm font-medium group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div> */}

        {/* Call to Action */}
        {/* <div className="text-center">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              Let's collaborate to bring your vision to life with cutting-edge technology and exceptional user experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group">
                <span>Start a Project</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                View GitHub
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Projects;