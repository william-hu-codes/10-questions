import "./Banner.css"
import { useNavigate } from "react-router-dom"

export default function Banner() {
    const navigate = useNavigate()
    function handleClick() {
        navigate("/")
    }
    return (
      <section className="banner-ctr">
        <h1 className="banner-text" onClick={handleClick}>
            10 Questions
        </h1>
      </section>
    )
}