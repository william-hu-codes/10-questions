import { useEffect, useState } from "react";
import { getCases } from "../../utilities/cases-service";
import Loader from "../../components/Loader/Loader";
import CaseCard from "./CaseCard";
import "./IndexPage.css"

export default function IndexPage ({user}) {
    const [cases, setCases] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function handleRequest() {
        const response = await getCases()
        if (typeof response === "object") {
            setCases(response)
            setIsLoading(false)
            console.log(response)
        } else {
            console.log("error: ", response)
        }
    }

    useEffect(() => {
        handleRequest();
    }, [])

    const casesList = cases?.map((c, idx) => <CaseCard caseStudy={c} idx={idx} key={idx} handleRequest={handleRequest} user={user}/>)

    return isLoading ? (
        <Loader />
    ) : (
        <section className="index-page-ctr">
            <h1>All Cases</h1>
            <div className="index-grid">
                {casesList}
            </div>
        </section>
    );

}
