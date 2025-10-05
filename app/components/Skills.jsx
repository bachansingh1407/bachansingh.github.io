import React from 'react';
import Image from 'next/image';

const Skills = () => {
  const skillData = [
    {
      category: "Frontend Development",
      desc: "Creating clean, minimalistic, and attractive interfaces that provide real value and excellent user experience.",
      skills: [
        "Web Applications",
        "Documentation Pages",
        "CMS Content Layout",
        "Dashboard Layout",
      ],
      languages: [
        { title: 'HTML5', icon: '/assets/tech/HTML5.png' },
        { title: 'CSS3', icon: '/assets/tech/CSS3.png' },
        { title: 'JavaScript', icon: '/assets/tech/JavaScript.png' },
        { title: 'TypeScript', icon: '/assets/tech/TypeScript.png' },
        { title: 'React', icon: '/assets/tech/React.png' },
        { title: 'Redux', icon: '/assets/tech/Redux.png' },
        { title: 'Vite', icon: '/assets/tech/Vite.png' },
        { title: 'Tailwind CSS', icon: '/assets/tech/Tailwind.png' },
      ],
      gradient: 'from-purple-500 to-pink-500',
      accentColor: 'purple'
    },
    {
      category: 'Backend Development',
      desc: "Building robust, scalable, and secure systems with clean architecture and developer-friendly APIs.",
      skills: [
        "RESTful APIs",
        "Authentication & Authorization",
        "Database Design & Optimization",
        "Third-party API Integration"
      ],
      languages: [
        { title: 'Node.js', icon: '/assets/tech/Node.png' },
        { title: 'Express.js', icon: '/assets/tech/Express.png' },
        { title: 'MongoDB', icon: '/assets/tech/MongoDB.png' },
        { title: 'Mongoose', icon: '/assets/tech/Mongoose.png' },
        { title: 'MySQL', icon: '/assets/tech/MySQL.png' },
        { title: 'Nodemon', icon: '/assets/tech/Nodemon.png' },
        { title: 'Axios', icon: '/assets/tech/Azios.png' }
      ],
      gradient: 'from-blue-500 to-cyan-500',
      accentColor: 'blue'
    },
    {
      category: "Tools & Technologies",
      desc: "Leveraging modern development tools to enhance productivity and streamline workflows.",
      skills: [
        "Version Control & Collaboration",
        "Package Management",
        "API Testing & Debugging",
        "Authentication Systems",
        "Efficient Code Development"
      ],
      languages: [
        { title: 'Git', icon: '/assets/tech/Git.png' },
        { title: 'GitHub', icon: '/assets/tech/GitHub.png' },
        { title: 'NPM', icon: '/assets/tech/NPM.png' },
        { title: 'JWT', icon: '/assets/tech/jwt.png' },
        { title: 'Postman', icon: '/assets/tech/Postman.png' },
        { title: 'VS Code', icon: '/assets/tech/VSCode.png' }
      ],
      gradient: 'from-green-500 to-emerald-500',
      accentColor: 'green'
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-green-400 text-sm font-medium">Continuously Learning</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Technical <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Skills</span>
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto leading-relaxed">
            Mastering the tools and technologies that bring digital experiences to life - from pixel-perfect interfaces to robust backend systems
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {skillData.map((category, index) => (
            <div key={index} className="group relative">
              {/* Card Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
              
              {/* Main Card */}
              <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 shadow-2xl h-full">
                
                {/* Category Header */}
                <div className="mb-8">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-${category.accentColor}-500/20 text-${category.accentColor}-300 border border-${category.accentColor}-500/30 backdrop-blur-sm`}>
                    {category.category}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{category.category}</h3>
                  <p className="text-gray-300 leading-relaxed">{category.desc}</p>
                </div>

                {/* Skills List */}
                <div className="mb-8">
                  <h4 className="font-semibold text-white mb-4 text-lg flex items-center">
                    <svg className="w-5 h-5 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    What I Build
                  </h4>
                  <ul className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <li key={skillIndex} className="flex items-center text-gray-300 group/item">
                        <div className={`w-2 h-2 bg-${category.accentColor}-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform duration-300`}></div>
                        <span className="group-hover/item:text-white transition-colors duration-300">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies Grid */}
                <div>
                  <h4 className="font-semibold text-white mb-4 text-lg flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Technologies
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {category.languages.map((tech, techIndex) => (
                      <div 
                        key={techIndex}
                        className="flex flex-col items-center p-3 bg-white/5 rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300 group/tech border border-white/5 hover:border-white/10"
                      >
                        <div className="w-10 h-10 mb-2 flex items-center justify-center bg-white/10 rounded-lg p-2 group-hover/tech:scale-110 transition-transform duration-300">
                          <Image
                            src={tech.icon}
                            alt={tech.title}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-300 text-center leading-tight group-hover/tech:text-white">
                          {tech.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Skill Level Indicators */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Proficiency Levels
            </h3>
            <div className="space-y-6">
              {[
                { skill: 'React & Next.js', level: 80, color: 'from-cyan-400 to-blue-500' },
                { skill: 'JavaScript/TypeScript', level: 76, color: 'from-yellow-400 to-orange-500' },
                { skill: 'Node.js & Express', level: 70, color: 'from-green-400 to-emerald-500' },
                { skill: 'Authentication & Authorization', level: 75, color: 'from-purple-400 to-pink-500' },
                { skill: 'API Integration', level: 78, color: 'from-red-400 to-pink-500' }
              ].map((item, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span className="group-hover:text-white transition-colors duration-300">{item.skill}</span>
                    <span className="group-hover:text-cyan-300 transition-colors duration-300">{item.level}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                      style={{ width: `${item.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Focus */}
          <div className="bg-slate-900/80  backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Currently Learning
            </h3>
            <div className="space-y-4">
              {[
                { topic: 'Advanced React Patterns', status: 'In Progress' },
                { topic: 'Microservices Architecture', status: 'Exploring' },
                { topic: 'Cloud Deployment', status: 'Learning' },
                // { topic: 'GraphQL & Apollo', status: 'Next Up' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group">
                  <span className="text-gray-300 group-hover:text-white">{item.topic}</span>
                  <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-cyan-500">8+</div>
                  <div className="text-xs text-white">Technologies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">5+</div>
                  <div className="text-xs text-white">Projects</div>
                </div>
                {/* <div>
                  <div className="text-2xl font-bold text-green-400">2+</div>
                  <div className="text-xs text-gray-400">Years</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="text-center">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Build Something Amazing?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              With this comprehensive skill set, I'm equipped to handle projects from concept to deployment. 
              Let's collaborate on something extraordinary!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Start a Project
              </button>
              <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                View My Work
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Skills;