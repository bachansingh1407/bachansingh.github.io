import React from 'react'
import HTMLicon from '../assets/tech/HTML5.png';
import CSSicon from '../assets/tech/CSS3.png';
import JAVASCRIPTicon from '../assets/tech/JavaScript.png';
import TYPESCRIPTicon from '../assets/tech/TypeScript.png';
import REACTicon from '../assets/tech/React.png';
import VITEicon from '../assets/tech/Vite.png';
import TAILWINDicon from '../assets/tech/Tailwind.png';
import REDUXicon from '../assets/tech/Redux.png';

import EXPRESSicon from '../assets/tech/Express.png';
import MONGODBicon from '../assets/tech/MongoDB.png';
import MONGOOSEicon from '../assets/tech/Mongoose.png';
import MYSQLicon from '../assets/tech/MySQL.png';
import NODEicon from '../assets/tech/Node.png';
import NODEMONicon from '../assets/tech/Nodemon.png';
import AXIOSicon from '../assets/tech/Azios.png';

import GITicon from '../assets/tech/Git.png';
import GITHUBicon from '../assets/tech/GitHub.png';
import NPMicon from '../assets/tech/NPM.png';
import JWTicon from '../assets/tech/jwt.png';
import POSTMANicon from '../assets/tech/Postman.png';
import VSCODEicon from '../assets/tech/VSCode.png';
import SkillSection from '../components/SkillSection';

const Skills = () => {
  const skillData = [
    {
      skillInfo: [
        {
          category: "Front-End Development",
          desc: "I love creating something that is clean and minimalistic, attractive and has value, and of course, easy to use.I really enjoy creating websites with rich UI components, including",
          skills: [
            "Web application",
            "Documentation pages",
            "CMS contents layout",
            "Dashboard layout",
          ],
          languages: [
            { title: 'HTML5', icon: HTMLicon },
            { title: 'CSS3', icon: CSSicon },
            { title: 'JavaScript', icon: JAVASCRIPTicon },
            { title: 'TypeScript', icon: TYPESCRIPTicon },
            { title: 'React', icon: REACTicon },
            { title: 'Redux', icon: REDUXicon },
            { title: 'Vite', icon: VITEicon },
            { title: 'Tailwind CSS', icon: TAILWINDicon },
          ]
        },
        {
          category: 'Back-End Development',
          desc: "I love building systems that are robust, scalable, secure, and efficient—always with clean architecture and developer-friendly APIs in mind. I truly enjoy working on:",
          skills: [
            "RESTful APIs",
            "Authentication & Authorization systems",
            "Microservices architecture",
            "Database design and optimization (SQL, MongoDB)",
            "Integrations with third-party APIs and services"
          ],
          languages: [
            { title: 'Node.js', icon: NODEicon },
            { title: 'Express.js', icon: EXPRESSicon },
            { title: 'MongoDB', icon: MONGODBicon },
            { title: 'Mongoose', icon: MONGOOSEicon },
            { title: 'MySQL', icon: MYSQLicon },
            { title: 'Nodemon', icon: NODEMONicon },
            { title: 'Axios', icon: AXIOSicon }
          ]
        },
        {
          category: "Softwares and Tools",
          desc: "I regularly work with developer tools that enhance productivity, streamline workflows, and support efficient development and deployment.",
          skills: [
            "Version control and collaboration using Git and GitHub",
            "Package management with NPM",
            "API testing and debugging with Postman",
            "Authentication using JSON Web Token (JWT)",
            "Writing and debugging code efficiently with VS Code"
          ],
          languages: [
            { title: 'Git', icon: GITicon },
            { title: 'GitHub', icon: GITHUBicon },
            { title: 'NPM', icon: NPMicon },
            { title: 'JSON Web Token', icon: JWTicon },
            { title: 'Postman', icon: POSTMANicon },
            { title: 'VS Code', icon: VSCODEicon }
          ]
        }
      ]
    }
  ]
  return (

    <div className="container">
      <div className="content">
        <div className="content_title">
          <h1>Skills and Tools</h1>
          <p> A look at all the programming languages, libraries, and tools I've worked with.</p>
        </div>

        <div className="all_skills">
          {skillData.map((section, index) => (
              <SkillSection
                key={index}
                skillInfo={section.skillInfo}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Skills