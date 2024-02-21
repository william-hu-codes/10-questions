import "./Footer.css"
import { TbCookieOff } from "react-icons/tb";

export default function Footer() {
    function clearCache(evt) {
        console.log("clearing cache")
        Object.keys(localStorage)
        .filter(x =>
           x.startsWith('case'))
        .forEach(x => 
           localStorage.removeItem(x))
    }
    return (
        <footer>
            <p>10Questions © 2023</p>
            <p>|</p>
            <p>Made with ❤️ in 🇨🇦🇺🇸</p>
            <p>|</p>
            <a href="mailto:support@ten-questions.com" target="_blank">
                Contact Us
            </a>
            <p>|</p>
            <div className="tooltip-wrap">
                <TbCookieOff className="cookie-icon" onClick={clearCache}/>
                <div className="tooltip-content">
                    <p>Clear Cookies</p>
                </div>
            </div>
        </footer>
    )
}