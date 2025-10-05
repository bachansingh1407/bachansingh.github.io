import Image from "next/image";

export default function About() {
    return (
        <div className="min-h-screen py-20 px-4 relative overflow-hidden">
        
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col items-center gap-12 lg:gap-16 lg:flex-row">
                    {/* Developer's Image */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                            
                            {/* Main Image */}
                            <div className="relative">
                                <Image
                                    src="/bachan.jpg"
                                    width={320}
                                    height={320}
                                    className="rounded-3xl object-cover shadow-2xl border-4 border-slate-800 group-hover:scale-105 transition-transform duration-500"
                                    alt="Portrait of Bachan Singh - Frontend Developer"
                                    priority
                                />
                                
                                {/* Status Indicator */}
                                {/* <div className="absolute -bottom-3 -right-3">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                        <span className="text-green-400 text-sm font-medium">Available</span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Developer's Information */}
                    <div className="flex-1 text-center lg:text-left">
                        {/* Header */}
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[purple]/5 backdrop-blur-sm border border-white/10 mb-6">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-sm font-medium">About Me</span>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                            Bachan <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Singh</span>
                        </h1>
                        
                        <h2 className="text-2xl lg:text-3xl text-black-300 mb-8 font-medium">
                            Frontend Developer & <span className="text-red-500">Full-Stack</span> Enthusiast
                        </h2>

                        {/* Content */}
                        <div className="flex flex-col gap-6 text-lg leading-relaxed text-black mb-8">
                            <p>
                                I'm a passionate <span className="text-red-500 font-semibold">Frontend Developer</span> currently crafting digital experiences at <span className="text-purple-600 font-semibold">Almuqeet Systems</span>. I specialize in building powerful web applications using <span className="text-blue-600">React.js</span> and <span className="text-blue-600">Next.js</span>, transforming complex requirements into engaging visual experiences that users love.
                            </p>

                            <p>
                                My expertise extends to creating intuitive, accessible designs with smooth animations and pixel-perfect responsiveness. I believe in writing code that's not just functional but <span className="text-green-600">elegant and maintainable</span>, ensuring the best possible user experience across all devices.
                            </p>

                            <p>
                                Currently expanding into <span className="text-orange-600">full-stack development</span>, I'm diving deep into <span className="text-green-600">Node.js</span>, building robust APIs, managing database operations, and implementing secure authentication systems. I enjoy architecting the business logic that powers seamless user experiences—creating the brain behind the beautiful interface.
                            </p>
                        </div>

                        {/* Skills Tags */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-blue-500 mb-4 flex items-center justify-center lg:justify-start">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                Core Technologies
                            </h3>
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                {[
                                    'React.js', 'Next.js', 'TypeScript', 'Node.js', 
                                    'MongoDB', 'Express.js', 'Tailwind CSS', 'Git & GitHub'
                                ].map((skill) => (
                                    <span 
                                        key={skill}
                                        className="px-4 py-2 bg-[red]/5 backdrop-blur-sm text-purple-500 rounded-xl text-sm font-medium border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 hover:scale-105"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Call to Action */}
                        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group">
                                <span>Get In Touch</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                            <button className="px-8 py-3 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                View My Work
                            </button>
                        </div> */}
                    </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
                    {[
                        { number: '2+', label: 'Years Experience', color: 'text-purple-400' },
                        { number: '15+', label: 'Projects Completed', color: 'text-cyan-400' },
                        { number: '10+', label: 'Technologies', color: 'text-green-400' },
                        { number: '100%', label: 'Client Focus', color: 'text-orange-400' }
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
            </div>
        </div>
    );
}