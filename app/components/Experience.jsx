import React from 'react';
import Image from 'next/image';

const Experience = () => {
  const experienceData = [
    {
      company: 'Almuqeet Systems',
      role: 'Frontend Developer',
      role_type: 'Full-time',
      duration: 'June, 2025 - Present',
      location: 'Mohali, Chandigarh',
      description: `Building modern, responsive web applications using React.js and Next.js. Creating seamless user experiences, implementing robust state management, and optimizing application performance.`,
      techStack: [
        { title: 'React', icon: '/assets/tech/React.png' },
        { title: 'Next.js', icon: '/assets/tech/Nextjs.png' },
        { title: 'TypeScript', icon: '/assets/tech/TypeScript.png' },
        { title: 'Tailwind CSS', icon: '/assets/tech/Tailwind.png' },
        { title: 'Git', icon: '/assets/tech/Git.png' },
      ],
      highlights: [
        'Developing responsive web applications with modern React patterns',
        'Implementing state management and optimizing component performance',
        'Collaborating with UX/UI designers for pixel-perfect implementations',
        'Building reusable component libraries'
      ],
      status: 'current',
      achievements: ['Improved performance by 40%', 'Led 3 major features', 'Mentored 2 junior developers']
    },
    {
      company: 'Gladhand Technologies',
      role: 'Full-Stack Developer',
      role_type: 'Intern',
      duration: 'April 2024 - July 2024',
      location: 'Dharamshala, Himachal Pradesh',
      description: `Gained hands-on experience in building full-stack applications using the MERN stack. Implemented secure authentication, RESTful APIs, and database management.`,
      techStack: [
        { title: 'React', icon: '/assets/tech/React.png' },
        { title: 'Node.js', icon: '/assets/tech/Node.png' },
        { title: 'MongoDB', icon: '/assets/tech/MongoDB.png' },
        { title: 'Express.js', icon: '/assets/tech/Express.png' },
        { title: 'JWT', icon: '/assets/tech/jwt.png' },
      ],
      highlights: [
        'Built full-stack applications with secure JWT authentication',
        'Developed RESTful APIs and implemented database operations',
        'Practiced Agile methodologies and Git version control',
        'Collaborated in team environment on real-world projects'
      ],
      status: 'past',
      achievements: ['Delivered 4 projects on time', 'Reduced API response time by 30%', 'Implemented CI/CD pipeline']
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 text-sm font-medium">Career Journey</span>
        </div> */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Professional <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">Experience</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          My journey through the world of web development, from learning fundamentals to building production applications
        </p>
      </div>

      {/* Experience Cards */}
      <div className="max-w-4xl mx-auto space-y-8">
        {experienceData.map((exp, index) => (
          <div key={index} className="group relative">
            {/* Main Card */}
            <div className="relative bg-slate-900/80 backdrop-blur-lg rounded-3xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden">
              
              {/* Status Ribbon */}
              <div className={`absolute top-6 -right-2 px-4 py-1 rounded-l-lg text-xs font-semibold z-10 ${
                exp.status === 'current' 
                  ? 'bg-green-500/20 text-green-400 border-r border-green-500/30' 
                  : 'bg-blue-500/20 text-blue-400 border-r border-blue-500/30'
              }`}>
                {exp.status === 'current' ? 'Current Role' : 'Previous Role'}
              </div>

              <div className="p-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Company Logo Placeholder */}
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {exp.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                        <p className="text-cyan-300 font-semibold">{exp.company}</p>
                      </div>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {exp.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {exp.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {exp.role_type}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-6">
                  {exp.description}
                </p>

                {/* Highlights & Achievements */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div> */}
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {exp.techStack.map((tech, techIndex) => (
                      <div 
                        key={techIndex}
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group/tech border border-white/5 hover:border-cyan-500/20"
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <Image
                            src={tech.icon}
                            alt={tech.title}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover group-hover/tech:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-sm text-gray-300 group-hover/tech:text-white">
                          {tech.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gradient Border Bottom */}
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Career Progress */}
      {/* <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-slate-800/30 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Career Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '2', label: 'Companies', icon: '🏢' },
              { number: '6+', label: 'Projects', icon: '🚀' },
              { number: '15+', label: 'Technologies', icon: '🛠️' },
              { number: '100%', label: 'Satisfaction', icon: '⭐' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Experience;