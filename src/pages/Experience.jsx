import React from 'react';
import ExperienceCard from '../components/ExperienceCard';

import JAVASCRIPTicon from '../assets/tech/JavaScript.png';
import TYPESCRIPTicon from '../assets/tech/TypeScript.png';
import REACTicon from '../assets/tech/React.png';
import REDUXicon from '../assets/tech/Redux.png';
import EXPRESSicon from '../assets/tech/Express.png';
import MONGODBicon from '../assets/tech/MongoDB.png';
import NODEicon from '../assets/tech/Node.png';
import GITicon from '../assets/tech/Git.png';
import GITHUBicon from '../assets/tech/GitHub.png';
import NPMicon from '../assets/tech/NPM.png';
import JWTicon from '../assets/tech/jwt.png';
import POSTMANicon from '../assets/tech/Postman.png';
import VSCODEicon from '../assets/tech/VSCode.png';

const Experience = () => {
  const experienceData = [
    {
      company: 'Gladhand Technologies Pvt. Ltd.',
      role: 'Full-Stack Developer',
      role_type: 'Intern',
      duration: 'April 2024 - July 2024',
      location: 'Dharamshala',
      description: `learned how to utilize MongoDB, Express, React, and Node.js to construct a full-stack website 
      during a practical internship. developed project-based apps and gained knowledge about how to use secure 
      password management, JWT-based authentication, and RESTful APIs. acquired hands-on experience with 
      Agile approaches, Git version control, software development methods, and cooperative teamwork in a work setting.`,
      techStack: [
        { title: 'JavaScript', icon: JAVASCRIPTicon },
        { title: 'TypeScript', icon: TYPESCRIPTicon },
        { title: 'React', icon: REACTicon },
        { title: 'Redux', icon: REDUXicon },
        { title: 'Node.js', icon: NODEicon },
        { title: 'Express.js', icon: EXPRESSicon },
        { title: 'MongoDB', icon: MONGODBicon },
        { title: 'Git', icon: GITicon },
        { title: 'GitHub', icon: GITHUBicon },
        { title: 'NPM', icon: NPMicon },
        { title: 'JSON Web Token', icon: JWTicon },
        { title: 'Postman', icon: POSTMANicon },
        { title: 'VS Code', icon: VSCODEicon }
      ],
      highlights: [
        'Implemented CI/CD pipeline using GitHub Actions and Docker, reducing deployment time by 60%',
        'Designed a modular component library in React with TypeScript for internal use',
        'Led migration from REST to GraphQL APIs, improving performance by 45%'
      ]
    }
  ];

  return (
    <div className="container">
      <div className="content">
        <div className="content_title">
          <h1>Experience</h1>
          <p>A deep look at my professional background, responsibilities, and technologies used.</p>
        </div>

        <div className="all_experience">
          {experienceData.map((exp, index) => (
            <ExperienceCard key={index} exp={exp} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
