
import React from 'react';
import PropTypes from 'prop-types';
import './skillStyle.css'

const SkillIcon = ({ lang }) => {
  return (
    <div className="icon_card">
      <img 
        src={lang.icon} 
        alt={lang.title} 
        width={40} 
        height={40}
        loading="lazy"
      />
      <p>{lang.title}</p>
    </div>
  );
};

SkillIcon.propTypes = {
  lang: PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }).isRequired
};

export default React.memo(SkillIcon);