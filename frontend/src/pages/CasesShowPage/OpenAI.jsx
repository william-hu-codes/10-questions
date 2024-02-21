import { useState } from "react"
import Loader from "../../components/Loader/Loader"
import { chatOpenAI } from "../../utilities/cases-service"
import { useParams } from "react-router-dom"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./CasesShowPage.css"

export default function OpenAI({caseStudy, questionsUsed, setQuestionsUsed, setInteractions, interactions, user, score, setScore, setScoreMessage, scoreMessage, correct}) {

    const [formData, setFormData] = useState("")
    const [disabled, setDisabled] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    const { caseId } = useParams()
    const [interactionIdx, setInteractionIdx] = useState(interactions ? interactions?.length -1 : null)
    const disableQuestion = questionsUsed >= 10 ? true : disabled ? true : correct ? true : false 

    async function handleSubmit(evt) {
        try {
            evt.preventDefault()
            // if (!user) {
                window.localStorage.setItem(`case-${caseId}-questionsUsed`, questionsUsed + 1)
            // }
            setQuestionsUsed(questionsUsed + 1)
            setDisabled(true)
            setShowLoader(true)
            const response = await chatOpenAI(caseId, {question: formData, interactions})
            const newInteraction = {question: formData, response: response.response}
            window.localStorage.setItem(`case-${caseId}-interactions`, JSON.stringify([... interactions, newInteraction]))
            setInteractions([... interactions, newInteraction])
            // below is interactions.length rather than interactions.length -1 to get the last index of interactions array because the above setInteractions() operation is async...
            setInteractionIdx(interactions.length)
            setDisabled(false)
            setShowLoader(false)
            setFormData("")
            if (response.irrelevantQuestion) {
                window.localStorage.setItem(`case-${caseId}-score`, (score - 60))
                setScore(score - 60)
                setScoreMessage(<h4 key={Math.random()} className="fading-text"><span className="red-text">-60 pts</span> <small className="grey-text">(question used)</small></h4>)
            } else {
                setScoreMessage(<h4 key={Math.random()} className="fading-text"><span className="green-text">No loss of points</span> <small className="grey-text">(pertinent question asked!)</small></h4>)
            }
        }catch(err) {
            console.log(err)
        }
    }

    function handleLeftArrowClick(evt) {
        if (interactionIdx > 0) {
            setInteractionIdx(interactionIdx - 1)
        }
    }

    function handleRightArrowClick(evt) {
        if (interactionIdx < interactions.length - 1) {
            setInteractionIdx(interactionIdx + 1)
        }
    }

    // console.log(window.localStorage.getItem(`case-${caseId}-interactions`))

    return (
        <section className="open-ai-ctr">
            <h4 className="open-ai-intro">Ask the patient a question</h4>
            <form onSubmit={handleSubmit} className="open-ai-form">
                <label>Questions remaining: {10 - questionsUsed}</label>
                <input type="text" value={formData} id="left-arrow" onChange={(evt) => setFormData(evt.target.value)}/>
                <button type="submit" disabled={disableQuestion}>Ask</button>
            </form>
            <br />
            {showLoader ? <Loader /> : null}
            {interactions?.length ? 
                <div className="interactions">
                    <div className="flex-ctr-ctr-col">
                        <h4 className="interaction-text">{interactions[interactionIdx]?.question}</h4>
                        <p className="interaction-text">{interactions[interactionIdx]?.response}</p>
                    </div>
                    <div className="arrows-ctr">
                        <FaArrowLeft className="arrow-icon" onClick={handleLeftArrowClick} disabled={interactionIdx === 0}/>
                        <p>{interactionIdx + 1}/{interactions.length}</p>
                        <FaArrowRight className="arrow-icon" onClick={handleRightArrowClick} disabled={interactionIdx === interactions.length-1}/> 
                    </div>
                </div>
                :
                null
            }
        </section>
    )
}