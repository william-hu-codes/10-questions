import { Link } from "react-router-dom";
import * as userService from "../../utilities/users-service"
import "./NavBar.css"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";


export default function NavBar ({ user, setUser }) {

    const [activeLink, setActiveLink] = useState("HOME")

    function handleLogOut() {
        userService.logOut()
        setUser(null)
    }

    function handleLinkClick(evt) {
        // console.log(evt)
        setActiveLink(evt.target.outerText)
    }

    return (

        <nav>
            <Link className={`link ${activeLink === "HOME" ? "active-link" : "" }`} to="/" onClick={handleLinkClick} >
                <h4 className="nav-link">HOME</h4>
            </Link>
            <Link className={`link ${activeLink === "INSTRUCTIONS" ? "active-link" : "" }`} to="/instructions" onClick={handleLinkClick} >
                <h4 className="nav-link">INSTRUCTIONS</h4>
            </Link>
            { user ? 
                <>
                    <Link className={`link ${activeLink === `PROFILE: ${user?.name}` ? "active-link" : "" }`} to="/user" onClick={handleLinkClick}>
                      <h4 className="nav-link profile-button">MY STATS</h4>
                    </Link>
                    <Link className={`link ${activeLink === "NEW CASE" ? "active-link" : "" } ${user.admin ? "" : "hidden"}`} to="/cases/new" onClick={handleLinkClick}>
                        <h4 className="nav-link">NEW CASE</h4>
                    </Link>
                    {/* <span><strong>Welcome, {user?.name}</strong> </span> */}
                    <Link className="link logout" to="/" onClick={handleLogOut}>
                        <h4 className="nav-link">LOG OUT</h4>
                    </Link>
                </>
                :
                <Link className={`link login ${activeLink === "login" ? "active-link" : ""}`} to="/login" >
                    <h4 className="nav-link">LOG IN</h4>
                </Link> 
            }

        </nav>
    );
}

