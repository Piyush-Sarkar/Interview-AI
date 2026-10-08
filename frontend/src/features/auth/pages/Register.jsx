import React, { useState } from "react"
import { useNavigate, Link} from "react-router"
import { useAuth } from "../hooks/useAuth";

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { user, handleRegister } = useAuth()
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    React.useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [ user, navigate ])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const data = await handleRegister({username, email, password})
            if (data?.user) {
                navigate("/")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
      <main>
        <div className="form-container">
          <h1>Register</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input 
                onChange={(e) => { setUsername( e.target.value )}}
                type="text" id="username" name="username"     placeholder="Enter username"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                onChange={(e)=> { setEmail( e.target.value )}}
                type="email" id="email" name="email" placeholder="Enter email address"
              />
            </div>          
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                onChange={(e)=> { setPassword( e.target.value )}}
                type="password" id="password"          name="password" placeholder="Enter password"
              />
            </div>
            <button disabled={isSubmitting} className="button primary-button">
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          <p>Already have an Account? <Link to={"/login"} >Login</Link></p>

        </div>
      </main>
    );
};

export default Register;