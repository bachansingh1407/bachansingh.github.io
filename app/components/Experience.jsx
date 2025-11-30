import { FaCheck } from "react-icons/fa";
import { HiOutlineCode } from "react-icons/hi";
export default function Experience() {
    const experiences = [
        {
            id: 1,
            company: "Almuqeet Systems",
            position: "Frontend Developer",
            duration: "June 2025 - Present",
            location: "Mohali, Chandigarh",
            description: "Building modern, responsive web applications using React.js and Next.js. Creating seamless user experiences, implementing robust state management, and optimizing application performance.",
            achievements: [
                "Developing responsive web applications with modern React patterns",
                "Implementing state management and optimizing component performance",
                "Collaborating with UX/UI designers for pixel-perfect implementations",
                "Building reusable component libraries"
            ],
            tech: ["React", "Next.js","Redux", "Tailwind CSS", "API Integration", "Authentication & Authorization", "Bootstrap", "JSON Web Token", "Git"],
            type: "Full-time",
            status: "current"
        },
        {
            id: 2,
            company: "Gladhand Technologies",
            position: "Full-Stack Developer",
            duration: "April 2024 - July 2024",
            location: "Dharamshala, Himachal Pradesh",
            description: "Gained hands-on experience in building full-stack applications using the MERN stack. Implemented secure authentication, RESTful APIs, and database management.",
            achievements: [
                "Built full-stack applications with secure JWT authentication",
                "Developed RESTful APIs and implemented database operations",
                "Practiced Agile methodologies and Git version control",
                "Collaborated in team environment on real-world projects"
            ],
            tech: ["React", "Node.js", "MongoDB", "Express.js", "JWT"],
            type: "Intern",
            status: "past"
        }
    ];

    return (
        <section id="experience" className="py-16 bg-gray-100 border border-gray-200 m-4 rounded-md">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl capitalize font-bold text-gray-900 mb-4">
                        Professional <span className="text-blue-600">Experience</span>
                    </h2>
                    <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-purple-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        My journey through the world of web development, from learning fundamentals to building production applications
                    </p>
                </div>

                {/* Experience Timeline */}
                <div className="max-w-7xl mx-auto space-y-8">
                    {experiences.map((exp, index) => (
                        <div key={exp.id} className="relative">
                            {/* Timeline line */}
                            {index !== experiences.length - 1 && (
                                <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-white -z-10"></div>
                            )}

                            <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="expeience_icon w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                {exp.company.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${exp.status === 'current'
                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                                                        }`}>
                                                        {exp.status === 'current' ? 'Current' : 'Previous'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-500">
                                                    <span className="flex items-center space-x-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{exp.duration}</span>
                                                    </span>
                                                    <span className="flex items-center space-x-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{exp.location}</span>
                                                    </span>
                                                    <span className="flex items-center space-x-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{exp.type}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {exp.description}
                                    </p>

                                    {/* Achievements */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center space-x-2">

                                            <FaCheck className="text-green-500 text-sm" />
                                            <span>Key Responsibilities</span>
                                        </h4>
                                        <ul className="space-y-2">
                                            {exp.achievements.map((achievement, idx) => (
                                                <li key={idx} className="flex items-start space-x-3 text-gray-600">
                                                    <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mt-2 shrink-0"></div>
                                                    <span className="text-sm">{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Technologies */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center space-x-2">
                                            <HiOutlineCode className="text-blue-600 text-xl" />
                                            <span>Technologies Used</span>
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {exp.tech.map((technology, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                                                >
                                                    {technology}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}