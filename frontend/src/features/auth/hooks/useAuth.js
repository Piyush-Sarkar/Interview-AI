import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";


export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        try {
            const data = await login({ email, password })
            if (data?.user) setUser(data.user)
            return data
        } catch (err) {
            console.log(err)
            return null
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        try {
            const data = await register({ username, email, password })
            if (data?.user) setUser(data.user)
            return data
        } catch (err) {
            console.log(err)
            return null
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.log(err)
        }
    }

    return { user, loading, handleRegister, handleLogin, handleLogout }
}