import Link from "next/link";
import Image from "next/image";

export default function Main() {
    const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Bachan_Singh_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
    return (
        <div className="min-h-screen flex items-center justify-center px-40">
            {/* User Info */}
            <div className="relative z-10 max-w-6xl mx-auto w-full">

                <div className="grid grid-cols-1 gap-12 items-center">


                    <div className="text-left space-y-8">
                        
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">Hi, I'm {" "}
                        <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Bachan Singh
                        </span>
                    </h1>

                    <div>
                        <h2 className="text-2xl md:text-3xl text-red-500 font-medium">
                            Frontend Developer
                        </h2>
                        <p className="text-lg text-gray-800 max-w-md">
                            Crafting digital experiences that users love.
                            Specializing in modern web technologies and full-stack solutions.
                        </p>
                    </div>

                    {/* Current Role */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span>Currently at <span className="text-red-500 font-semibold">Almuqeet Systems</span></span>
                        </div>
                        {/* <div className="w-px h-4 bg-gray-600"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Open to collaborations</span>
                    </div> */}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                         <a 
                            href="/Bachan_Singh_Resume.pdf" // Make sure this path matches your resume file in public folder
                            download="Bachan_Singh_Resume.pdf"
                            className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden text-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                Download Resume
                                <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                        </a>
                    </div>
                    
                    </div>
                </div>
            </div>

            {/* Right Side Image Section */}
            <div className="relative flex justify-center lg:justify-end">
                <div className="relative group">
                    {/* Outer Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>

                    {/* Main Image Container */}
                    <div className="relative bg-slate-800 rounded-2xl p-2 border border-white/10 shadow-2xl">
                        <Image
                            src="/bachan.jpg"
                            alt="Bachan Singh - Frontend Developer"
                            width={400}
                            height={400}
                            className="rounded-2xl object-cover w-full max-w-sm group-hover:scale-105 transition-transform duration-500"
                            priority
                        />
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-bounce delay-1000"></div>

                    {/* Tech Stack Badge */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 shadow-lg">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <span>Next.js • Node.js</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}