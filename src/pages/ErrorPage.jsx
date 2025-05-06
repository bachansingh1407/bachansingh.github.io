import React from 'react'
import { Link } from 'react-router-dom'
import './errorpage.css'
import { GoArrowRight } from "react-icons/go";

const ErrorPage = () => {
  return (
    <div className='error_container'>
      <div className="error_content">
        <h1>Error 404</h1>
        <strong>Oops! The page you're looking for doesn't exist.</strong>
        <p>It might have been removed, renamed, or did not exist in the first place.</p>
        <Link to="/" className="error_link">
          Go back to home page&nbsp; <GoArrowRight />
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage;
