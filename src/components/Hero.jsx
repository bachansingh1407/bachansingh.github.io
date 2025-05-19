import React, { useState } from 'react';
import './hero.css';
import MyResume from '../assets/resume/bachansingh.pdf';
import myPhoto from '../assets/bachan.jpg';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Hero = () => {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadResume = async () => {
        try {
            setDownloading(true);

            // Simulate a delay or async fetch for realism
            const response = await fetch(MyResume);
            if (!response.ok) {
                throw new Error('Resume download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'Bachan_Singh_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Something went wrong while downloading the resume.');
            console.error(error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <section className="hero_container">
            <div className="hero_content">
                <h1 className="hero_title">
                    Full Stack <span className="highlight">Developer</span>
                </h1>

                <p className="hero_description">
                    Hi, I'm <strong>Bachan Singh</strong>. I specialize in building responsive, user-friendly websites and web apps.
                    From concept to deployment, I turn ideas into interactive digital experiences. Clean code,
                    modern design, and performance are at the heart of my work. Let’s collaborate and bring your vision to life.
                </p>

                <div className="hero_buttons">
                    <button
                        onClick={handleDownloadResume}
                        disabled={downloading}
                        className={`resume_btn ${downloading ? 'loading' : ''}`}
                        aria-label="Download Resume"
                    >
                        {downloading ? 'Downloading...' : 'Download Resume'}
                    </button>
                </div>

                <div className="social_links">
                    <a
                        href="https://github.com/bachansingh1407"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit GitHub profile"
                        className="contact__link"
                    >
                        <FaGithub /> <span>GitHub</span>
                    </a>

                    <a
                        href="mailto:bachansingh1407@gmail.com"
                        aria-label="Send an Email"
                        className="contact__link"
                    >
                        <MdEmail /> <span>Email</span>
                    </a>

                    <a
                        href="https://www.linkedin.com/in/bachansingh"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit LinkedIn profile"
                        className="contact__link"
                    >
                        <FaLinkedin /> <span>LinkedIn</span>
                    </a>
                </div>
            </div>

            <div className="hero_image">
                <img src={myPhoto} alt="Bachan Singh" className="profile_img" />
            </div>
        </section>
    );
};

export default Hero;
