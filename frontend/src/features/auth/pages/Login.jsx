import React, { useState } from "react"
import "../auth.form.scss"
import { useNavigate, Link } from "react-router"
import { useAuth } from "../hooks/useAuth"


const Login = () => {

    const { user, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
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
            const data = await handleLogin({ email, password })
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
                <h1>Login</h1>
                
                <form onSubmit={handleSubmit}> 
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e) => { setEmail( e.target.value )}}
                            type="email" id="email" name="email" placeholder="Enter email address"/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value )}}
                            type="password" id="password" name="password" placeholder="Enter password"/>
                    </div>

                    <button disabled={isSubmitting} className="button primary-button">
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p>Don't have an Account? <Link to={"/register"} >Register</Link></p>
            </div>
        </main>
    )
}

export default Login