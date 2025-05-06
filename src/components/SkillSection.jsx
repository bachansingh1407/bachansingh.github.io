import React from 'react';
import PropTypes from 'prop-types';
import SkillCategory from './SkillCategory';
import './skillStyle.css'

const SkillSection = ({ skillInfo }) => {
  return (
    <div className="skill_section">
      {skillInfo.map((info) => (
        <SkillCategory
          key={info.category}
          category={info.category}
          desc={info.desc}
          skills={info.skills}
          languages={info.languages}
        />
      ))}
    </div>
  );
};

SkillSection.propTypes = {
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  skillInfo: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    languages: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })).isRequired
  })).isRequired
};

export default React.memo(SkillSection);