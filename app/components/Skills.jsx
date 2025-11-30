import { FaReact, FaNodeJs, FaGitAlt, FaGithub } from "react-icons/fa";
import { SiNextdotjs, SiJavascript, SiTypescript, SiTailwindcss, SiMongodb, SiRedux, SiExpress, SiAxios, SiJsonwebtokens, SiPostman, SiVercel, SiNetlify, SiFigma, SiAdobephotoshop } from "react-icons/si";
import { GrMysql } from "react-icons/gr";
import { VscVscode } from "react-icons/vsc";

export default function Skills() {
  const skills = [
    { icon: <FaReact className="text-4xl" />, name: "React", color: "text-blue-500" },
    { icon: <SiNextdotjs className="text-4xl" />, name: "Next.js", color: "text-gray-900" },
    // { icon: <TbBrandReactNative className="text-4xl" />, name: "React Native", color: "text-blue-400" },
    { icon: <SiJavascript className="text-4xl" />, name: "JavaScript", color: "text-yellow-500" },
    { icon: <SiTypescript className="text-4xl" />, name: "TypeScript", color: "text-blue-600" },
    { icon: <SiTailwindcss className="text-4xl" />, name: "Tailwind CSS", color: "text-cyan-500" },
    { icon: <FaNodeJs className="text-4xl" />, name: "Node.js", color: "text-green-600" },
    { icon: <SiExpress className="text-4xl" />, name: "Express.js", color: "text-gray-700" },
    { icon: <SiMongodb className="text-4xl" />, name: "MongoDB", color: "text-green-500" },
    { icon: <GrMysql className="text-4xl" />, name: "MySQL", color: "text-blue-700" },
    { icon: <SiRedux className="text-4xl" />, name: "Redux", color: "text-purple-600" },
    { icon: <SiAxios className="text-4xl" />, name: "Axios", color: "text-blue-500" },
    { icon: <SiJsonwebtokens className="text-4xl" />, name: "JWT", color: "text-pink-500" },
    { icon: <FaGitAlt className="text-4xl" />, name: "Git", color: "text-orange-600" },
    { icon: <FaGithub className="text-4xl" />, name: "GitHub", color: "text-gray-900" },
    { icon: <SiPostman className="text-4xl" />, name: "Postman", color: "text-orange-500" },
    { icon: <VscVscode className="text-4xl" />, name: "VS Code", color: "text-blue-600" },
    // { icon: <SiVercel className="text-4xl" />, name: "Vercel", color: "text-gray-900" },
    // { icon: <SiNetlify className="text-4xl" />, name: "Netlify", color: "text-teal-500" },
    // { icon: <SiFigma className="text-4xl" />, name: "Figma", color: "text-purple-500" },
    // { icon: <SiAdobephotoshop className="text-4xl" />, name: "Photoshop", color: "text-blue-500" },
  ];

  return (
    <section id="skills" className="py-16 bg-gray-100 border border-gray-200 m-4 rounded-md">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            Skills & Technologies
          </h2> */}

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 capitalize mb-4">
            Skills & <span className="text-blue-600">Technologies</span>
          </h2>

          <div className="w-40 h-1 bg-linear-to-r from-blue-500 to-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 group cursor-pointer"
            >
              <div className={`${skill.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {skill.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center group-hover:text-gray-900 transition-colors">
                {skill.name}
              </span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
            <p className="text-sm text-gray-600">React, Next.js, JavaScript, TypeScript</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
            <p className="text-sm text-gray-600">Node.js, Express, MongoDB, MySQL</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Tools</h3>
            <p className="text-sm text-gray-600">Git, VS Code, Postman</p>
          </div>
          {/* <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Deployment</h3>
            <p className="text-sm text-gray-600">Vercel, Netlify, GitHub</p>
          </div> */}
        </div>
      </div>
    </section>
  );
}