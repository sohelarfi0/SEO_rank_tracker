import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { register } from 'node:module';
import {createContext, use, useContext, useState, type ReactNode} from 'react';



interface User{
    id: string;
    name: string;
    email: string;
    plan: string;
    analysisCount?: number;
}

interface AppContextType {
    user: User | null ;
    token: string | null;
    loading: boolean;
    api: AxiosInstance ;
    login: (email: string, passwaord: string)=> Promise<{success: boolean;
        message?: string}>;
    register: (name: string, email: string, passwaord: string)=> Promise<{success: boolean;
        message?: string}>;
    logout: ()=> void;


    
    }


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";



const AppContext = createContext<AppContextType | undefined>(undefined);


export function AppProvider({children}: {children: ReactNode}){

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);


    // Axios instance with auth header
    const api= axios.create({
        baseURL: BACKEND_URL;

    })

    // Update axios headers when token changes

    api.interceptors.request.use((config)=>{
        const token = localStorage.getItem("token")

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;

    })

    const loadUser = async ()=>{

    }


    const login = async () => {

    }

    const register = async () => {}


    const logout = async () =>{

    }


    const value = {user, token, loading, api, login, register, logout}



    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}



export  function useApp(){
    const context = useContext(AppContext)
    if(!context) throw new Error("useApp must be used within AppProvider");
    return context;
}