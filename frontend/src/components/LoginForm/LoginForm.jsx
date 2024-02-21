import { useState } from 'react';
import * as usersService from "../../utilities/users-service"
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import "./LoginForm.css"

export default function LoginForm({ setUser }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    // Prevent form from being submitted to the server
    evt.preventDefault();
    try {
      setIsLoading(true)
      // The promise returned by the signUp service method 
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await usersService.login(credentials);
      console.log(user)
      setUser(user);
      setIsLoading(false)
      navigate("/")
    } catch {
      console.log("error logging in")
      setError('Log In Failed - Try Again');
      setIsLoading(false)
      navigate("/")
    }
  }

  return (
    <div>
      <h2>Log In</h2>
      <div className="login-ctr">
        <form autoComplete="off" onSubmit={handleSubmit} className="login-form">
          <label>Email:</label>
          <input type="text" name="email" value={credentials.email} onChange={handleChange} required />
          <label>Password:</label>
          <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
          <div></div>
          <button type="submit" disabled={isLoading}>LOG IN</button>
          <div></div>
          {isLoading ? <Loader /> : null}
        </form>
      </div>
      <p className="error-message">&nbsp;{error}</p>
    </div>
  );
}