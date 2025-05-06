import React from 'react';
import PropTypes from 'prop-types';
import SkillIcon from './SkillIcon';
import { BiSolidHandRight } from "react-icons/bi";
import './skillStyle.css'
import { FaHashtag } from "react-icons/fa";


const SkillCategory = ({ category, desc, skills, languages }) => {
  return (
    <div className="skills_category">
      <h2><span><FaHashtag /></span> {category}</h2>
      <p className='skills_desc'>{desc}</p>
      <ul>
        {skills.map((item, id) => (
          <li key={id}><BiSolidHandRight /> {item}</li>
        ))}
      </ul>
      <div className="skills_icons">
        {languages.map((lang) => (
          <SkillIcon key={lang.title} lang={lang} />
        ))}
      </div>
    </div>
  );
};

SkillCategory.propTypes = {
  category: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  languages: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  })).isRequired
};

export default React.memo(SkillCategory);