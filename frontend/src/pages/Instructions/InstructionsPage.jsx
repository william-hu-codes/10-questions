import "./InstructionsPage.css"
import { useNavigate } from "react-router-dom"

export default function InstructionsPage() {
    const navigate = useNavigate()

    function handleClick() {
        navigate("/")
    }
    return (
        <section className="instructions-page-ctr">
            <div className="introduction">
                <h2>HOW TO PLAY</h2>
                <h4>The goal of the game is to diagnose the client with as few guesses and irrelevant questions as possible</h4>
            </div>
            <div className="instructions">
                <ul>
                    <li>
                        You will be presented with a single image depicting a patient's presenting symptoms. 
                        Your task is to diagnose the patient using the provided multiple-choice options.
                    </li>
                    <li>
                        You have up to 10 questions to ask the patient (portrayed by OpenAI). 
                        Choose your questions wisely to narrow down the possibilities and reach an accurate diagnosis.
                    </li>
                    <li>
                        Your initial score is 1000 points for each scenario.
                        Choosing the wrong multiple-choice option deducts 100 points each attempt.
                    </li>
                    <li>
                        Asking pertinent questions won't deduct points.
                        Asking irrelevant questions results in a deduction of 60 points per question.
                    </li>
                    <li>
                        Choosing the wrong multiple-choice option deducts 100 points each attempt.

                    </li>
                    <li>
                        If you're logged in, your lifetime score is tracked and can be reviewed on the profile page.
                        Strive for continuous improvement and challenge yourself to achieve higher scores.
                    </li>
                    <li>
                        Access your profile page to view detailed stats, past scenarios, and your overall performance.
                        Track your progress and witness your diagnostic skills evolve over time.
                    </li>
                </ul>
            </div>
            <button onClick={handleClick}>PLAY</button>
        </section>
    )
}