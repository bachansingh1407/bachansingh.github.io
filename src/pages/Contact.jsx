import React from 'react';
import './contactStyle.css';
import GITHUBicon from '../assets/icons/GitHub.png';
import EMAILicon from '../assets/icons/gmail.png';
import LINKEDINicon from '../assets/icons/LinkedIn.png';

const Contact = () => {
  return (
    <div className="container">
      <div className="content">
        <div className="content_title">
          <h1>Find me online</h1>
          <p>
            I'd love to hear from you! Whether you have a question or just want to say hi, feel free to drop a message.
          </p>
        </div>

        <div className="contact_content">
          <div className="contact_links">
            <a
              href="https://github.com/bachansingh1407"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={GITHUBicon} alt="GitHub" />
              GitHub
            </a>

            <a href="mailto:bachansingh1407@gmail.com" >
              <img src={EMAILicon} alt="Email" />
              Email
            </a>

            <a
              href="https://www.linkedin.com/in/bachansingh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={LINKEDINicon} alt="LinkedIn" />
              LinkedIn
            </a>
          </div>

          <div className="methods_email">
            <strong>Email me directly</strong>
            <em>bachansingh1407@gmail.com</em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
