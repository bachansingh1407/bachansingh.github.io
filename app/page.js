"use client"
import Link from "next/link";
import Header from "./components/Header";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaCode, FaAngleUp, } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  const socialLinks = [
    {
      icon: <FaGithub className="text-lg" />,
      text: "GitHub",
      url: "https://github.com/bachansingh1407",
      color: "hover:bg-gray-900 hover:border-gray-900",
      label: "Visit my GitHub profile"
    },
    {
      icon: <FaLinkedin className="text-lg" />,
      text: "LinkedIn",
      url: "https://linkedin.com/in/bachan-singh",
      color: "hover:bg-blue-600 hover:border-blue-600",
      label: "Connect on LinkedIn"
    },
    {
      icon: <FaEnvelope className="text-lg" />,
      text: "Email",
      url: "mailto:bachansingh1407@gmail.com",
      color: "hover:bg-red-500 hover:border-red-500",
      label: "Send me an email"
    }
  ];

  return (
    <div className="min-h-screen font-poppins">
      <Header />

      {/* Hero Section */}
      <section className="sm:bg-gray-100 sm:border sm:border-gray-200 mx-4 rounded-lg overflow-hidden">
        <div className="max-w-7xl mx-auto py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="text-left space-y-8">

              {/* Main Heading */}
              <div className="space-y-6 text-center sm:text-start">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Frontend Engineer
                  <span className="block text-blue-600 mt-2">crafting clean, scalable</span>
                  web experiences.
                  {/* Frontend Developer
                  <span className="block text-blue-600 mt-2">Crafting Digital</span>
                  <span className="block text-gray-900">Experiences</span> */}
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  I build interfaces that feel effortless—focused on clarity, performance,
                  accessibility, and long‑term maintainability.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 border-2 border-blue-600"
                >
                  <span>Contact Me</span>
                  <FiArrowUpRight className="transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="#projects"
                  className="inline-flex items-center bg-white justify-center gap-3 border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-700 hover:text-gray-900 transition-all duration-300"
                >
                  <FaCode />
                  <span>My Work</span>
                </Link>
              </div>

              {/* Social Links - Improved */}
              <div className="pt-6 text-center sm:text-start">
                <p className="text-gray-500 text-sm mb-4">Connect with me</p>
                <div className="flex items-center gap-4 sm:justify-start justify-center">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`group cursor-pointer flex items-center justify-center w-12 h-12 border-2 border-gray-300 rounded-lg text-gray-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${social.color} hover:text-white`}
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Visual Element */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl p-8 border border-blue-100">
                {/* Animated background elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>

                <div className="relative z-10 space-y-6">
                  {/* Code-like elements */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>

                    <div className="space-y-2 text-left font-mono text-sm">
                      jsx
                      <div className="space-y-2 text-left font-mono text-sm">
                        <div className="text-gray-700">
                          <span className="text-purple-500">const</span>{" "}
                          <span className="text-blue-600">developer</span> = {"{"}
                        </div>
                        <div className="text-gray-700 ml-4">
                          <span className="text-green-600">name</span>:
                          <span className="text-orange-400"> 'Bachan Singh'</span>,
                        </div>
                        <div className="text-gray-700 ml-4">
                          <span className="text-green-600">role</span>:
                          <span className="text-orange-400"> 'Frontend Developer'</span>,
                        </div>
                        <div className="text-gray-700 ml-4">
                          <span className="text-green-600">company</span>:
                          <span className="text-orange-400"> 'Almuqeet Systems'</span>,
                        </div>
                        <div className="text-gray-700 ml-4">
                          <span className="text-green-600">focus</span>:
                          <span className="text-orange-400"> 'React & Next.js'</span>,
                        </div>
                        <div className="text-gray-700 ml-4">
                          <span className="text-green-600">skills</span>: {"["}
                          <span className="text-cyan-500"> 'React'</span>,
                          <span className="text-cyan-500"> 'Next.js'</span>,
                          <span className="text-cyan-500"> 'TypeScript'</span>,
                          <span className="text-cyan-500"> 'Tailwind'</span>
                          <span className="text-gray-700"> {"]"}</span>,
                        </div>
                        <div className="text-gray-700">{"};"}</div>
                      </div>


                      {/* Additional function */}
                      <div className="mt-4 text-gray-700">
                        <span className="text-purple-500">function</span>{" "}
                        <span className="text-blue-600">latestProject</span>() {"{"}
                      </div>

                      <div className="text-gray-700 ml-4">
                        <span className="text-purple-500">return</span>{" "}
                        <span className="text-cyan-500">{"<"}</span>
                        <span className="text-red-400">WorkflowApp</span>{" "}
                        <span className="text-green-600">performance</span>=
                        <span className="text-orange-400">{"{true}"}</span>{" "}
                        <span className="text-green-600">responsive</span>=
                        <span className="text-orange-400">{"{true}"}</span>
                        <span className="text-cyan-500"> {"/>"}</span>
                      </div>

                      <div className="text-gray-700">{"}"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}