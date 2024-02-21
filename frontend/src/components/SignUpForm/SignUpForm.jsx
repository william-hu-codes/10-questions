import { signUp } from '../../utilities/users-service'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import "./SignUpForm.css"


export default function SignUpForm({setUser}) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    error: ''
  })
  const [error, setError] = useState("")
  const disable = formData.password !== formData.confirm;
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(evt) {
    const newData = {...formData, [evt.target.name]: evt.target.value}
    setFormData(newData)
  };

  async function handleSubmit(evt) {
    evt.preventDefault()
    try {
      setIsLoading(true)
      const {name, email, password} = formData
      const finalData = {name, email, password}

      const user = await signUp(finalData);
      setUser(user)
      setIsLoading(false)
      navigate("/")
    } catch {
      setError('Sign Up Failed - Try Again')
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2>Create Your Account</h2>
      <div>
        <form className='sign-up-form' autoComplete="off" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          <label>Confirm:</label>
          <input type="password" name="confirm" value={formData.confirm} onChange={handleChange} required />
          <div></div>
          <button type="submit" disabled={disable || isLoading}>SIGN UP</button>
          <div></div>
          {isLoading ? <Loader /> : null}
        </form>
      </div>
      <p>&nbsp;{error}</p>
    </div>
  );
}

