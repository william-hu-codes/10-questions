
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";

export default function AuthPage ({ setUser }) {
    const [showSignUp, setShowSignUp] = useState(false)
    
    function handleAuthClick() {
        setShowSignUp(!showSignUp)
    }

return (

    <main>
        {/* <h1>AuthPage</h1> */}
        {showSignUp ?
        <SignUpForm setUser={setUser} />
        :
        <LoginForm setUser={setUser} />
        }
        {showSignUp ? 
        <p>Already a user?</p>
        :
        <p>Don't have an account yet?</p>
        }
        <button onClick={handleAuthClick}>{ showSignUp ? "LOG IN" : "SIGN UP" }</button>
    </main>

);
}