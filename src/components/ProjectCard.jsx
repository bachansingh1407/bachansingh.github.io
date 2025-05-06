import React from 'react';
import './projectcard.css'
import { FiExternalLink } from "react-icons/fi";
import { BiSolidHandRight } from "react-icons/bi";

const ProjectCard = ({ title, cover_image, description, tech_stack, github_url }) => {
  return (
    <div className="project-card_container">
      <div className="card_image">
        <img src={cover_image} alt={title} className="project-image" loading="lazy" />
      </div>

      <div className="project-card_details">
        <h2 className="project-title">{title}</h2>

        <div className="project-description">
          {description.map((desc, index) => (
            <p key={index}><BiSolidHandRight /> {desc}</p>
          ))}
        </div>

        <div className="tech-stack">
          {tech_stack.map((tech, index) => (
            <span className="tech-chip" key={index}>
              {tech}
            </span>
          ))}
        </div>

        <a
          href={github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          aria-label={`View ${title} source code on GitHub`}
        >
          <span><FiExternalLink /></span> View on GitHub
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
