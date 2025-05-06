import React from 'react';
import './experienceStyle.css';
import { BiSolidHandRight } from "react-icons/bi";

const ExperienceCard = ({ exp }) => {
  return (
    <div className="experience_card">
      <div className="experience_header">
        <div className="experience_title">
          <h2>{exp.role} <span>{exp.role_type}</span></h2>
          <strong>{exp.company} — {exp.location}</strong>
        </div>
        <p className="experience_duration">{exp.duration}</p>
      </div>

      <p className="experience_desc">{exp.description}</p>

      <div className="experience_techstack">
        {exp.techStack.map((tech, i) => (
          <div key={tech.title + i} className="tech_item">
            <img src={tech.icon} alt={tech.title} width={30} height={30} />
            <span>{tech.title}</span>
          </div>
        ))}
      </div>

      <ul className="experience_highlights">
        {exp.highlights.map((point, index) => (
          <li key={point}><BiSolidHandRight /> {point}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExperienceCard;
