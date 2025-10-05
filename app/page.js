import Image from "next/image";
import Main from "./components/Main";
import About from "./components/About";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Skills from "./components/Skills";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <div className="app font-montserrat">
      {/* Main/Hero Section - Full viewport height */}
      <section id="home">
        <Main />
      </section>
      
      {/* About Section */}
      <section id="about" className="scroll-mt-20">
        <About />
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="scroll-mt-20">
        <Skills />
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20">
        <Projects />
      </section>
      
      {/* Experience Section */}
      <section id="experience" className="scroll-mt-20">
        <Experience />
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20">
        <Contact />
      </section>

      {/* Navigation Dots - Fixed on the right */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((section, index) => (
          <a
            key={section}
            href={`#${section}`}
            className="group flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-cyan-400 transition-all duration-300 group-hover:scale-150"></div>
            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 font-medium">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 Bachan Singh. All rights reserved.
            </div>
            <div className="flex gap-6">
              {[
                { name: "GitHub", url: "https://github.com/bachansingh1407" },
                { name: "LinkedIn", url: "https://linkedin.com/in/bachan-singh" },
                { name: "Email", url: "mailto:bachansingh1407@gmail.com" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
          {/* <div className="mt-4 text-gray-500 text-xs">
            Built with Next.js, Tailwind CSS, and ❤️
          </div> */}
        </div>
      </footer>
    </div>
  );
}