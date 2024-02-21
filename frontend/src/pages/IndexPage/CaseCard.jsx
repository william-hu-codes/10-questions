import { Link } from "react-router-dom";
import { deleteCase } from "../../utilities/cases-service"


export default function CaseCard({caseStudy, idx, handleRequest, user}) {

    async function handleDelete() {
        try {
            // const deleteResponse = await deleteCase(caseStudy._id)
            await deleteCase(caseStudy._id)
            // if (deleteResponse._id) {
            await handleRequest()
        } catch(err) {
                console.log(err)
        }
    }

    // console.log(user)

    return (
        <div className="case-card">
            <Link className="link flex" to={`/cases/${caseStudy._id}`}>
                <div>
                    <img src={caseStudy.image} alt="case study image" width={300} />
                    <div>
                        <h4>{caseStudy.title ? caseStudy.title : "Untitled"}</h4>
                        <p>Date posted: {new Date(caseStudy.createdAt).toDateString()}</p>
                    </div>
                </div>
            </Link>
            {user?.admin ? <button className="delete" onClick={handleDelete}>Remove</button> : null }
        </div>
    )
}