import { checkToken } from "../../utilities/users-service";
import "./UserShowPage.css"

export default function UserShowPage ({user, setUser}) {
    console.log(user)
    return (
    <div className="user-show-page-ctr">
        <h1>{user?.name}</h1>
        <div className="stats">
            <h4>Total Score:</h4>
            <p>{user?.totalScore}</p>
            <h4>Completed Cases:</h4>
            {/* <p>{Object.keys(user.completedCases).length}</p> */}
            {/* <h4>Correct Responses:</h4> */}
            <p>{user?.completedCases.correct}</p>
            {/* <h4>Incorrect Responses:</h4>
            <p>{user.completedCases.incorrect}</p> */}
            <h4>Diagnosing Since:</h4>
            <p>{new Date(user?.createdAt)?.toDateString()}</p>
        </div>
        {/* <button onClick={handleCheckToken}> Check when my login expires</button> */}
    </div>
    );
    
    }