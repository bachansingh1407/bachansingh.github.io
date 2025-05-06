import React from 'react'
import './hero.css'
import MyResume from '../assets/resume/bachansingh.pdf';
import myPhoto from '../assets/bachan.jpg'
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";

const Hero = () => {
    const handleDownloadResume = () => {
        const link = document.createElement('a');
        link.href = MyResume;
        link.download = 'Bachan_Singh_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='hero_container'>
            <div className="hero_content">

                <h1>full stack <span>developer</span></h1>
                <p>Hi, I'm Bachan Singh, specialize in building responsive, user-friendly websites and web apps.
                    From concept to deployment, I turn ideas into interactive digital experiences.
                    Clean code, modern design, and performance are at the heart of my work.
                    Let's collaborate and bring your vision to life.
                </p>
                <button
                    onClick={handleDownloadResume}
                    aria-label="Download Resume"
                >
                    Resume
                </button>
            </div>
            <div className="hero_image">
                <img src={myPhoto} alt='Bachan Singh' />
            </div>
            <div className="social_links">
                {/* GitHub link */}
                <a href="https://github.com/bachansingh1407" target="_blank" rel="noopener noreferrer" className="contact__link">
                <FaGithub /> <span>Github</span>
                </a>
                
                {/* Email link */}
                <a href="mailto:bachansingh1407@gmail.com" className="contact__link">
                <MdEmail /> <span>Email</span>
                 
                </a>
                
                {/* LinkedIn link */}
                <a href="https://www.linkedin.com/in/bachansingh" target="_blank" rel="noopener noreferrer" className="contact__link">
                <FaLinkedin /> <span>LinkedIn</span>
                </a>
            </div>
        </div>
    )
}

export default Hero