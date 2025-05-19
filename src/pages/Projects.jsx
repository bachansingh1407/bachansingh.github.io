import React from "react";
import ProjectCard from "../components/ProjectCard";
import doShareCover from "../assets/doshare.png";
import eCommerceCover from "../assets/ecommerce.png";
import blogAppCover from "../assets/blogs.png";
import hrDashboardCover from "../assets/hrproject.png";
import jwtCover from "../assets/authproject.png";

const Projects = () => {
  const projectDetails = [
    {
      title: "DoShare File Sharing and Managing Web Application",
      cover_image: doShareCover,
      description: [
        `DoShare is a secure file-sharing and printing solution aimed at preventing unauthorized access to user files, especially in print shop environments.`,
        `It allows users to upload various file types and share them via unique links that enable printing but restrict downloading.`,
        `The application incorporates role-based authentication for users and admins, ensuring secure access and management.`,
        `Built with a React frontend and a Node.js/Express backend, it utilizes MongoDB for data storage and stores files locally.`,
      ],
      tech_stack: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "TypeScript",
        "JavaScript",
        "CSS",
        "HTML",
      ],
      github_url:
        "https://github.com/bachankapoor/DoShare-File-Sharing-and-managing-web-application",
    },
    {
      title: "E-commerce Platform using MERN Stack",
      cover_image: eCommerceCover,
      description: [
        `This is a feature-rich e-commerce frontend application built with React and modern web technologies to provide a complete shopping experience.`,
        `Users can browse products, apply filters, sort results, and view detailed product information including high-resolution images and specifications.`,
        `The shopping cart supports multiple items with variant handling, persistent state, and a mini-cart preview for quick access.`,
        `Built with React 18 and state managed via Context API and Redux, it emphasizes modularity, scalability, and a seamless user experience.`,
      ],
      tech_stack: [
        "React 18",
        "Redux",
        "Context API",
        "React Router v6",
        "CSS Modules",
        "Sass",
        "Styled Components",
        "JavaScript",
        "react-icons",
        "HTML",
      ],
      github_url: "https://github.com/bachansingh1407/Ecommerce-platform-using-mern-stack",
    },
    {
      title: "JWT-Based Authentication System",
      cover_image: jwtCover, // Replace with actual imported image asset
      description: [
        `This JWT-based authentication system demonstrates secure login and signup workflows using React, Node.js, Express, and MySQL. It provides a clean, full-stack solution for managing user sessions and protecting routes.`,
        `Users can register, log in, and gain access to a protected dashboard. JWT tokens are issued on login and validated to secure access, ensuring only authenticated users reach sensitive parts of the application.`,
        `Backend validation, token issuance, and secure database handling are set up through Express and MySQL, making this project a solid base for any full-stack authentication system.`,
      ],
      tech_stack: [
        "React",
        "React Router",
        "Node.js",
        "Express.js",
        "MySQL",
        "JWT (JSON Web Tokens)"
      ],
      github_url: "https://github.com/bachansingh1407/React-Authentication-using-Jwt"
    },
    {
      title: "HRMS Dashboard – MERN Stack Web Application",
      cover_image: hrDashboardCover, // Replace with actual imported image asset
      description: [
        `This HRMS Dashboard is a full-fledged MERN stack web application designed to manage Human Resource activities. It includes modules for candidate management, employee tracking, attendance recording, and leave management.`,
        `Authentication is secured using JWT, with features like session expiry, form validation, and protected routes. HR personnel can onboard candidates, promote them to employee status, and manage their details.`,
        `The platform integrates complex features like resume upload/download, dynamic filtering, and search capabilities built to match Figma design specifications. Employee and attendance tracking are tightly integrated.`,
        `Future-ready and scalable, the project includes best practices like context-based state management, clean reusable code, responsive design, and full CRUD APIs for every module including candidates, employees, and leaves.`,
      ],
      tech_stack: [
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JWT",
        "Context API",
        "Vanilla CSS"
      ],
      github_url: "https://github.com/bachansingh1407/HR-Dashboard-MERN-stack-project"
    },
    {
      title: "Blogging Application – Full-Stack Blog Platform",
      cover_image: blogAppCover, // Replace with the actual imported image asset
      description: [
        `This full-stack Blogging Application enables users to publish, manage, and explore blogs, built using React on the frontend and Node.js with Express and MySQL on the backend. It’s designed for content creation and secure interaction among users.`,
        `Users can register and authenticate securely using JWT and bcryptjs. Authenticated users can create new blogs, edit existing ones, and delete them. They can also explore blogs written by others and view their profiles.`,
        `The app supports profile management, password updates, and newsletter subscriptions. Blogs are timestamped with Moment.js and users enjoy smooth client-side routing via React Router.`,
        `The backend is structured with clear routes, controllers, and middleware for clean code organization. Multer handles file uploads, and MySQL is used for scalable data persistence. The Context API is used for global state management across the app.`,
      ],
      tech_stack: [
        "React",
        "React Router DOM",
        "Axios",
        "Moment.js",
        "React Icons",
        "Node.js",
        "Express.js",
        "MySQL",
        "JWT",
        "bcryptjs",
        "Multer",
        "Context API"
      ],
      github_url: "https://github.com/bachansingh1407/Blogging-Application-using-React"
    }

  ];

  return (
    <div className="container">
      <div className="content">
        <div className="content_title">
          <h1>Projects</h1>
          <p>
            Explore my latest work—each project reflects my skills in design,
            development, and problem-solving.
          </p>
        </div>

        <div className="all_content">
          {projectDetails.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
