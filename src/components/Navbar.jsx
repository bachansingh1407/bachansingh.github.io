import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCopy } from "react-icons/rx";
import toast from 'react-hot-toast';
import './navbar.css'
import { RxCross2 } from "react-icons/rx";

const Logo = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("https://bachansingh.netlify.app/")
            .then(() => {
                setCopied(true);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    useEffect(() => {
        if (copied) {
            toast.success('Profile Link Copied');
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    return (
        <div className='logo'>
            <Link to="/">Bachan Singh</Link>
            <button onClick={handleCopy} title="Copy Profile URL">
                <RxCopy />
            </button>
        </div>
    );
};

const Menu = () => {
    return (
        <ul className="menu_list">
            <li><Link to="/experience">Experience</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/skills">Skills</Link></li>
        </ul>
    );
};

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <div className='navbar_container'>
                <Logo />
                <div className="menu">
                    <Link to='/contact'>Contact</Link>
                    <button onClick={() => setShowMenu(!showMenu)} title="Toggle Menu">
                        {!showMenu ? <RxHamburgerMenu /> : <RxCross2 />}
                    </button>
                    {showMenu && <Menu />}
                </div>
            </div>
        </>
    );
};

export default Navbar;
