import axios from 'axios';
import {useCallback, useEffect, useState, type ReactNode} from 'react';
import { AppContext, type AppContextType, type User } from './AppContextType';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function AppProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    // Axios instance with auth header
    const api = axios.create({
        baseURL: BACKEND_URL,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    })

    // Update axios headers when token changes
    api.interceptors.request.use((config)=>{
        const token = localStorage.getItem("token")
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    })

    const loadUser = useCallback(async ()=>{
        if(!token){
            setLoading(false);
            return;
        }
        try{
            const {data} = await api.get('/api/auth/user')
            if(data.success){
                setUser(data.user)
            }
        }catch(error){
            // Handle error silently - just clear auth state
            console.error('Failed to load user:', error);
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        }
        setLoading(false);
    }, [token, api])

    useEffect(() => {
        loadUser();
    }, [loadUser])

    const login = async (email: string, password: string) => {
        try{
            const res = await api.post('/api/auth/login', {email, password})
            if(res.data.success){
                setToken(res.data.token)
                setUser(res.data.user)
                localStorage.setItem("token", res.data.token)
                return {success: true}
            }
            return {success: false, message: res.data.message}
        }catch(error: Error | unknown){
            const message = error instanceof Error ? error.message : "Login failed"
            return {success: false, message}
        }
    }

    const register = async (name: string, email: string, password: string) => {
        try{
            const res = await api.post('/api/auth/register', {name, email, password})
            if(res.data.success){
                setToken(res.data.token)
                setUser(res.data.user)
                localStorage.setItem("token", res.data.token)
                return {success: true}
            }
            return {success: false, message: res.data.message}
        }catch(error: Error | unknown){
            const message = error instanceof Error ? error.message : "Registration failed"
            return {success: false, message}
        }
    }

    const logout = () =>{
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    }

    const value: AppContextType = {user, token, loading, api, login, register, logout}

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}