import { useState, useEffect } from "react";
import { getCase } from "../../utilities/cases-service";
import Loader from "../../components/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedin, FaLink } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { IoMailSharp } from "react-icons/io5";
import { MdCheck } from "react-icons/md";
import { sendResponse } from "../../utilities/cases-service";
import { getUser } from "../../utilities/users-service";

import "./CasesShowPage.css"
import OpenAI from "./OpenAI";

export default function CasesShowPage({user, setUser}) {

    const [isLoading, setIsLoading] = useState(true);
    const [caseStudy, setCaseStudy] = useState(null);
    const navigate = useNavigate()
    const {caseId} = useParams()
    // const [showResults, setShowResults] = useState(false)
    const caseIdx = user?.completedCases?.responses?.findIndex((r) => r.caseId === caseId)
    //caseIdx won't exist unless user exists AND user has completed case
    const [choice, setChoice] = useState(user?.completedCases?.responses[caseIdx]?.response ? user?.completedCases?.responses[caseIdx]?.response : window.localStorage.getItem(`case-${caseId}-choice`))
    // const [questionsUsed, setQuestionsUsed] = useState(user?.completedCases?.responses[caseIdx]?.logOpenAi?.length ? user?.completedCases?.responses[caseIdx]?.logOpenAi?.length : window.localStorage.getItem(`case-${caseId}-questionsUsed`) || 0)
    const [questionsUsed, setQuestionsUsed] = useState(user?.completedCases?.responses[caseIdx]?.logOpenAI ? user?.completedCases?.responses[caseIdx]?.logOpenAI?.length : window.localStorage.getItem(`case-${caseId}-questionsUsed`) || 0)
    const [interactions, setInteractions] = useState(user?.completedCases?.responses[caseIdx]?.logOpenAI?.length ? user?.completedCases?.responses[caseIdx]?.logOpenAI : JSON.parse(window.localStorage.getItem(`case-${caseId}-interactions`)) || [])
    const correct = choice?.toLowerCase() === caseStudy?.primaryIllness?.toLowerCase()
    const [priorResponses, setPriorResponses] = useState(JSON.parse(window.localStorage.getItem(`case-${caseId}-priorResponses`)) || [])
    const [score, setScore] = useState(user?.completedCases?.responses[caseIdx] ? user?.completedCases?.responses[caseIdx]?.score : JSON.parse(window.localStorage.getItem(`case-${caseId}-score`)) || 1000)
    // console.log(caseId)
    const [scoreMessage, setScoreMessage] = useState("")

    console.log(caseIdx)
    // console.log(user.completedCases.responses)
    console.log(interactions)

    async function handleRequest() {
        try {
            const response = await getCase(caseId);
            if (response._id) {
              setCaseStudy(response);
              setIsLoading(false);
            } else {
              navigate('/')
            }
        }catch(err) {
            console.log(err)
        }
    }
    
    useEffect(() => {
        handleRequest();
      }, []);

    async function handleResponse(evt) {
        try {
            if (correct) return
            // if (choice) return
            const selection = evt.target.outerText
            // if(!user) {
                window.localStorage.setItem(`case-${caseId}-choice`, selection)
            // }
            setChoice(selection)


            if (priorResponses?.includes(selection)) return
            // console.log(selection)
            // console.log(typeof selection)
            // console.log(caseStudy.primaryIllness)
            // console.log(caseId)
            if (selection?.toLowerCase() === caseStudy?.primaryIllness?.toLowerCase()) {
                console.log("correct - sending response to backend")
                const newArray = [...priorResponses, selection]
                window.localStorage.setItem(`case-${caseId}-priorResponses`, JSON.stringify(newArray))
                setPriorResponses(newArray)
                const response = await sendResponse(caseId, {selection, questionsUsed, interactions, score, priorResponses: newArray})
                console.log(response)
                setCaseStudy(response.caseStudy)
                // setChoice(selection)
                if (user) {
                    // setUser(response.user)
                    window.localStorage.setItem(`token`, response.token)
                    setUser(await getUser())
                }
                // } else {
                    window.localStorage.setItem(`case-${caseId}-choice`, selection)
                // }
            }else {
                const newArray = [...priorResponses, selection]
                // if (!user) {
                    window.localStorage.setItem(`case-${caseId}-priorResponses`, JSON.stringify(newArray))
                    window.localStorage.setItem(`case-${caseId}-score`, score - 100)
                // }
                setPriorResponses(newArray)
                setScore(score - 100)
                setScoreMessage(<h4 key={Math.random()} className="fading-text"><span className="red-text">-100 pts</span> <span className="grey-text">(incorrect answer!)</span></h4>)
            }
        }catch(err) {
            console.log(err)
        }
    }

    // function calculatePercent(index) {
    //     const total = caseStudy?.responses?.correct + caseStudy?.responses?.incorrect
    //     const percent = caseStudy?.responses?.count[index] / total * 100
    //     return percent
    // }

    console.log(choice)
    console.log(priorResponses)
    console.log("user", user)
    
    return isLoading ? (
        <Loader />
    ) : (
        <section className="cases-show-page-ctr">
            <h1>{caseStudy?.title}</h1>
            <hr />
            <div className="info-bar">
                <h4>{new Date(caseStudy?.createdAt).toDateString()}</h4>
                <div className="share-case">
                    <FaFacebookF className="share-icon" />
                    <FaTwitter className="share-icon" />
                    <FaLinkedin className="share-icon" />
                    <IoMailSharp className="share-icon" />
                    <FaLink className="share-icon" />
                    <HiDownload className="share-icon"/>
                </div>
            </div>
            <hr className="lightgrey" />
            <div className="case-show-grid">
                <div>
                    <img src={caseStudy?.image} alt="case study image"/>
                </div>
                <div className="about-case">
                    <OpenAI caseStudy={caseStudy} questionsUsed={questionsUsed} setQuestionsUsed={setQuestionsUsed} interactions={interactions} setInteractions={setInteractions} user={user} score={score} setScore={setScore} scoreMessage={scoreMessage} setScoreMessage={setScoreMessage} correct={correct}/>
                    <hr className="lightgrey" />
                    {correct ? 
                    <div className="answered">
                        <ol className="choices-ctr">
                            {caseStudy?.multipleChoices?.map((s, idx) => <li onClick={handleResponse} className={`mc-li ${s.toLowerCase() === caseStudy?.primaryIllness?.toLowerCase() ? "correct-choice" : "incorrect-choice"} ${s.toLowerCase() === choice?.toLowerCase() ? "chosen" : ""}`} key={idx}>{s} </li>)}
                            {/* percentages calculator below removed */}
                            {/* <span className="percentage">({Math.round(calculatePercent(idx)*100)/100}%)</span> */}
                        </ol>
                        <div className="score">
                            {choice.toLowerCase() === caseStudy?.primaryIllness?.toLowerCase() ? <h3>Correct!</h3> : <h3>Incorrect!</h3>}
                            <p className="description">{caseStudy?.description}</p>
                            <h3>You scored {score} points!</h3>
                        </div>
                    </div>
                    :
                    <div className="unanswered">
                        <h4>Select your diagnosis:</h4>
                        <ol className="choices-ctr">
                            {caseStudy?.multipleChoices?.map((s, idx) => <li disabled onClick={handleResponse} className={`mc-li ${priorResponses?.includes(s) ? "wrong" : ""}`} key={idx}>{s}</li>)}
                        </ol>
                        <hr />
                        <div className="score">
                            <h3>Your current score: {score}</h3>
                        </div>
                        <div>{scoreMessage} </div>
                    </div>
                    }
                </div>
            </div>
        </section>
    )
}