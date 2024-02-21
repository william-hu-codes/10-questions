import { useState } from "react"
import UploadWidget from "../../components/UploadWidget/UploadWidget"
import { useNavigate } from "react-router-dom"
import { createCase } from "../../utilities/cases-service"

import "./CasesNewPage.css"

export default function CasesNewPage({user}) {
    const [formData, setFormData] = useState({
        title: "",
        primaryIllness: "",
        // rob adding 12.7.23:
        initialSymptoms: "",
        // supporting: [],
        // unsupporting: [],
        image: "",
        multipleChoices: [],
        // answer: "",
        description: "",
        // rob adding as of 12.3.23:
        pertinentPositives: [],
        pertinentNegatives: [],
    })
    const [unsupportingForm, setUnsupportingForm] = useState("")
    const [multipleChoicesForm, setMultipleChoicesForm] = useState("")
    const navigate = useNavigate()
    const [supportingForm, setSupportingForm] = useState("")

    // rob adding 12.3.23:
    const [pertinentPositiveForm, setPertinentPositiveForm] = useState(
            {
            pertinentPositive: "",
            unlockKeywords: "",
            unlockContext: "",
        })

    const [pertinentNegativeForm, setPertinentNegativeForm] = useState(
            {
            pertinentNegative: "",
            unlockKeywords: "",
            unlockContext: "",
        })
    
    const [totalKeywords, setTotalKeywords] = useState([])
    const [totalPosKeywords, setTotalPosKeywords] = useState([])
    const [totalNegKeywords, setTotalNegKeywords] = useState([])

    // rob adding 12.3.23:
    function setPertinentPositiveFormData(evt) {
        setPertinentPositiveForm({
            ...pertinentPositiveForm,
            [evt.target.name]: evt.target.value.toLowerCase()
        })
    }

    function setPertinentNegativeFormData(evt) {
        setPertinentNegativeForm({
            ...pertinentNegativeForm,
            [evt.target.name]: evt.target.value.toLowerCase()
        })
    }

    // function setPertinentPositiveFormPertinentPositive(evt) {
    //     setPertinentPositiveForm({
    //         ...pertinentPositiveForm,
    //         pertinentPositive: evt.target.value
    //     })
    // }
    //     function setPertinentPositiveFormUnlockKeywords(evt) {
    //         setPertinentPositiveForm({
    //             ...pertinentPositiveForm,
    //             unlockKeywords: evt.target.value
    //         })
    //     }
    //     function setPertinentPositiveFormUnlockContext(evt) {
    //         setPertinentPositiveForm({
    //             ...pertinentPositiveForm,
    //             unlockContext: evt.target.value
    //         })
    //     }


        // function setPertinentNegativeFormPertinentNegative(evt) {
        //     setPertinentNegativeForm({
        //         ...pertinentNegativeForm,
        //         pertinentNegative: evt.target.value
        //     })
        // }
        //     function setPertinentNegativeFormUnlockKeywords(evt) {
        //         setPertinentNegativeForm({
        //             ...pertinentNegativeForm,
        //             unlockKeywords: evt.target.value
        //         })
        //     }
        //     function setPertinentNegativeFormUnlockContext(evt) {
        //         setPertinentNegativeForm({
        //             ...pertinentNegativeForm,
        //             unlockContext: evt.target.value
        //         })
        //     }


    function handleChange(evt) {
        const newData = {...formData, [evt.target.name]: evt.target.value}
        setFormData(newData)
    }

    async function handleSubmit(evt) {
        evt.preventDefault()
        for (const key in formData){

            const general = ["title", "primaryIllness", "initialSymptoms", "image", "description"]
            if (general.includes(key)) {
                if (!formData[key].length) {
                    return alert(`All required (*) fields along with a case image must be completed.`)
                }
            }
            if (key === "multipleChoices") {
                if (formData[key].length !== 5) {
                    return alert(`Must write 5 multiple choice options.`)
                }
            }
            // const variable = ["pertinentPositives", "pertinentNegatives"]
            // if (variable.includes(key)) {
            //     if (!formData[key].length) {
            //         return alert(`All fields must be completed.`)
            //     }
            // }
            
            // if (!formData[key].length) {
            //     return alert(`All fields must be completed. "${key}" field is invalid`)
            // }
        }
        if (!formData.multipleChoices.includes(formData.primaryIllness)) {
            alert(`Correct diagnosis must be one of the multiple choice options.`)
            const newData = {...formData}
            newData.multipleChoices = []
            return setFormData(newData)
        }
        const finalFormData = {...formData}
        finalFormData.primaryIllness = formData.primaryIllness.toLowerCase()
        finalFormData.initialSymptoms = formData.initialSymptoms.toLowerCase()
        try {
            await createCase(finalFormData)
            navigate("/")
        }catch (error) {
            console.log(error)
            navigate("/")
        }
    }

    // function addSupporting(evt) {
    //     evt.preventDefault()
    //     const newData = {...formData}
    //     newData.supporting.push(supportingForm.toLowerCase())
    //     setFormData(newData)
    //     setSupportingForm("")
    // }

    // function addUnsupporting(evt) {
    //     evt.preventDefault()
    //     const newData = {...formData}
    //     newData.unsupporting.push(unsupportingForm.toLowerCase())
    //     setFormData(newData)
    //     setUnsupportingForm("")
    // }

    // Rob adding 12.3.23:

    // function addPertinentPositive(evt) {
    //     evt.preventDefault()

    //     const allPertPosKeywordsArrays = formData.pertinentPositives.map((item) => (item.pertinentPositiveForm?.unlockKeywords.split(", ")))
    //     console.log("all pert pos keywords: ", allPertPosKeywordsArrays.flat(1))

    //     allPertPosKeywordsArrayFlat = allPertPosKeywordsArrays.flat(1)

    //     totalKeywordsArray = [[allPertPosKeywordsArrayFlat], [allPertNegKeywordsArrayFlat]].flat(1)
    //     console.log("total keywords array: ", totalKeywordsArray)

    //     if ((allPertPosKeywordsArrayFlat.some(item => pertinentPositiveForm.unlockKeywords.includes(item))) || (allPertNegKeywordsArrayFlat.some(item2 => pertinentPositiveForm.unlockKeywords.includes(item2)))) {
    //         console.log("keyword already included!")
    //         alert("Cannot add any keywords that have already been specified for pertient postives or negatives")
    //         return
    //     }

    //     const newData = {...formData}
    //     newData.pertinentPositives.push({pertinentPositiveForm})
    //     setFormData(newData)
    //     setPertinentPositiveForm({
    //         pertinentPositive: "",
    //         unlockKeywords: "",
    //         unlockContext: "",
    //     })
    // }

    function addPertinentPositive(evt) {
        evt.preventDefault()
        let valid = true
        const keywords = pertinentPositiveForm.unlockKeywords.split(", ")
        keywords.forEach(function(keyword) {
            if (totalKeywords.includes(keyword)) {
                alert(`Cannot use same keyword multiple times. Repeated keyword: ${keyword}`)
                valid = false
            }
        })
        if (!valid) return
        const newData = {...formData}
        newData.pertinentPositives.push({pertinentPositiveObject: pertinentPositiveForm})
        setFormData(newData)
        setTotalKeywords([...totalKeywords, ...keywords])
        setTotalPosKeywords([...totalPosKeywords, ...keywords])
        setPertinentPositiveForm({
            pertinentPositive: "",
            unlockKeywords: "",
            unlockContext: "",
        })
    }
    
    function addPertinentNegative(evt) {
        evt.preventDefault()
        let valid = true
        const keywords = pertinentNegativeForm.unlockKeywords.split(", ")
        keywords.forEach(function(keyword) {
            if (totalKeywords.includes(keyword)) {
                alert(`Cannot use same keyword multiple times. Repeated keyword: ${keyword}`)
                valid = false
            }
        })
        if (!valid) return
        const newData = {...formData}
        newData.pertinentNegatives.push({pertinentNegativeObject: pertinentNegativeForm})
        setFormData(newData)
        setTotalKeywords([...totalKeywords, ...keywords])
        setTotalNegKeywords([...totalNegKeywords, ...keywords])
        setPertinentNegativeForm({
            pertinentNegative: "",
            unlockKeywords: "",
            unlockContext: "",
        })
    }

    // function addPertinentNegative(evt) {
    //     evt.preventDefault()
        
    //     const allPertNegKeywordsArrays = formData.pertinentNegatives.map((item) => (item.pertinentNegativeForm?.unlockKeywords.split(", ")))
    //     console.log("all pert neg keywords: ", allPertNegKeywordsArrays.flat(1))

    //     allPertNegKeywordsArrayFlat = allPertNegKeywordsArrays.flat(1)

    //     totalKeywordsArray = [[allPertPosKeywordsArrayFlat], [allPertNegKeywordsArrayFlat]].flat(1)
    //     console.log("total keywords array: ", totalKeywordsArray)
        
    //     if ((allPertPosKeywordsArrayFlat.some(item3 => pertinentNegativeForm.unlockKeywords.includes(item3))) || (allPertNegKeywordsArrayFlat.some(item4 => pertinentNegativeForm.unlockKeywords.includes(item4)))) {
    //         console.log("keyword already included!")
    //         alert("Cannot add any keywords that have already been specified for pertient postives or negatives")
    //         return
    //     }

    //     const newData = {...formData}
    //     newData.pertinentNegatives.push({pertinentNegativeForm})
    //     setFormData(newData)


    //     setPertinentNegativeForm({
    //         pertinentNegative: "",
    //         unlockKeywords: "",
    //         unlockContext: "",
    //     })
    // }

    function addMultipleChoice(evt) {
        evt.preventDefault()
        const newData = {...formData}
        newData.multipleChoices.push(multipleChoicesForm.toLowerCase())
        setFormData(newData)
        setMultipleChoicesForm("")
    }

    return (
        user.admin ? (
            <section className="cases-new-page-ctr">
                <h2>Create a new case</h2>
                <UploadWidget formData={formData} setFormData={setFormData} />
                {formData.image.length ? 
                    <img className="image-preview" src={formData.image} alt="uploaded image"/>
                    :
                    null
                }
                <br />
                <form>
                    <label><strong>Title*</strong></label>
                    <input type="text" className="span-2" name="title" value={formData.title} onChange={handleChange}/>
                    {/* <label>Primary Illness:</label> */}
                    <label><strong>Correct Diagnosis*</strong></label>
                    <input className="span-2" type="text" name="primaryIllness" value={formData.primaryIllness} onChange={handleChange}/>
                    {/* <label>Illness Description:</label> */}

                    {/* adding below 12.7.23 */}
                    <label><strong>Initial Symptoms Given*</strong></label>
                    <input className="span-2" type="text" name="initialSymptoms" value={formData.initialSymptoms} onChange={handleChange}/>
                 
                    <label><strong>Correct Diagnosis Description*</strong></label>
                    <input className="span-2" type="text" name="description" value={formData.description} onChange={handleChange}/>
                </form>

                <br />

<br></br>
                <form>
                    <label><strong>Multiple Choice Options (5)*</strong></label>
                    <div className="stacked">
        
                    <input type="text" name="multipleChoices" value={multipleChoicesForm} onChange={(evt) => setMultipleChoicesForm(evt.target.value)}/>
                    <label className="left-align"><small>One of these must be the "correct diagnosis"</small></label>
                    </div>
                    <button className="move-down" onClick={addMultipleChoice} disabled={formData.multipleChoices.length >=5}>Add Answer Choice</button>
                    <div></div>
                    <div className="multiple-choices">
                        {formData.multipleChoices?.map((s, idx) => <li key={idx}><small>Answer Choice</small> {idx+1}: {s}</li>)}
                    </div>
                </form>

                <br></br>

                {/* <form onSubmit={addSupporting}>
                    <label>Supporting Factors:</label>
                    <input className="supporting" type="text" name="supporting" value={supportingForm} onChange={(evt) => setSupportingForm(evt.target.value)}/>
                    <button type="submit">Add Factor</button>
                    <div></div>
                    <div className="supporting-factors">
                        {formData.supporting?.map((s, idx) => <li key={idx}>{s}</li>)}
                    </div>
                </form>  */}


                {/* Rob adding 12.3.23: */}
                <form onSubmit={addPertinentPositive}>
                    <label><strong>Pertinent Positives</strong></label>
                    <div className="inline">
                      <div className="stacked">
                        <label className="center-title">Specific Clinical Data</label>
                        <input className="pertinent-positive" type="text" name="pertinentPositive" value={pertinentPositiveForm.pertinentPositive} onChange={setPertinentPositiveFormData}/>
                      </div>
                      <div className="spacer"></div>
                      <div className="stacked">
                        <label>Keywords to Unlock</label>
                        <input className="pertinent-positive" type="text" name="unlockKeywords" value={pertinentPositiveForm.unlockKeywords} onChange={setPertinentPositiveFormData}/>
                      </div>

                    {/* commenting out context unlock feature as of 12.8.23 for now */}
                      {/* <div className="stacked">
                        <label>Context to Unlock</label>
                        <input className="pertinent-positive" type="text" name="unlockContext" value={pertinentPositiveForm.unlockContext} onChange={setPertinentPositiveFormUnlockContext}/>
                      </div> */}

                    </div>

                    <button className="move-down" type="submit smaller-button" disabled={formData.pertinentPositives.length >= 5}>Add Pertinent Positive</button>

                    <div></div>
                    <div className="pertinent-positive-text">
                        {(formData.pertinentPositives.length)  ?
                        <>
                         {formData.pertinentPositives.map((item, index) => (
                            <div key={index}>
                            <li><strong>Pertient Positive: </strong>{item.pertinentPositiveObject.pertinentPositive}</li>
                            <ul className="indent"><strong>Keywords: </strong>{item.pertinentPositiveObject.unlockKeywords}</ul>
                            {/* <ul className="indent"><strong>Context: </strong>{item.pertinentPositiveForm?.unlockContext}</ul> */}
                            <div className="small-break"></div>
                            </div>
                        ))}
                        </>
                        :
                        null
                        }
                    </div>
                </form>

 <br></br>

                <form onSubmit={addPertinentNegative}>
                    <label><strong>Pertinent Negatives</strong></label>
                    <div className="inline">
                      <div className="stacked">
                        <label className="center-title">Specific Clinical Data</label>
                        <input className="pertinent-negative" type="text" name="pertinentNegative" value={pertinentNegativeForm.pertinentNegative} onChange={setPertinentNegativeFormData}/>
                      </div>
                      <div className="spacer"></div>
                      <div className="stacked">
                        <label>Keywords to Unlock</label>
                        <input className="pertinent-negative" type="text" name="unlockKeywords" value={pertinentNegativeForm.unlockKeywords} onChange={setPertinentNegativeFormData}/>
                      </div>

                      {/* commenting out context unlock as of 12.8.23 for now */}
                      {/* <div className="stacked">
                        <label>Context to Unlock</label>
                        <input className="pertinent-negative" type="text" name="unlockContext" value={pertinentNegativeForm.unlockContext} onChange={setPertinentNegativeFormUnlockContext}/>
                      </div> */}

                    </div>

                    <button className="move-down" type="submit smaller-button" disabled={formData.pertinentNegatives.length >= 5}>Add Pertinent Negative</button>

                    <div></div>
                    <div className="pertinent-negative-text">
                        {(formData.pertinentNegatives.length)  ?
                        <>
                         {formData.pertinentNegatives.map((item, index) => (
                            <div key={index}>
                            <li><strong>Pertient Negative: </strong>{item.pertinentNegativeObject.pertinentNegative}</li>
                            <ul className="indent"><strong>Keywords: </strong>{item.pertinentNegativeObject.unlockKeywords}</ul>
                            {/* <ul className="indent"><strong>Context: </strong>{item.pertinentNegativeForm?.unlockContext}</ul> */}
                            <div className="small-break"></div>
                            </div>
                        ))}
                        </>
                        :
                        null
                        }
                    </div>
                </form>



            {/* <form>
                    <label>Unsupporting Factors:</label>
                    <input className="unsupporting" type="text" name="unsupporting" value={unsupportingForm} onChange={(evt) => setUnsupportingForm(evt.target.value)}/>
                    <button onClick={addUnsupporting}>Add Factor</button>
                    <div></div>
                    <div className="unsupporting-factors">
                        {formData.unsupporting?.map((s, idx) => <li key={idx}>{s}</li>)}
                    </div>
                </form>  */}

                {/* <form>
                    <label>Answer:</label>
                    <input type="text" name="answer" value={formData.answer} onChange={handleChange} />
                </form> */}

            <br></br>
                    <div></div>
                    <button type="submit" onClick={handleSubmit} className="create-case-button move-down">Create Case</button>

            </section>
        ) : (
            <h3>NOT AUTHORIZED</h3>
        )
    )

}