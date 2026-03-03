"use client";

import { useState } from "react"
import {useRouter} from "next/navigation"
import { api } from "@/lib/api";

export default function Register(){
    const router = useRouter()

    const [name,setName] = useState("")
    const[email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const [error,setError] = useState("")
    const[success,setSuccess] = useState("") 

    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault()
        setError("")
        setSuccess("")

        if(!name || !email || !password){
            setError("Please fill all the fields")
            return;
        }

        try {
            const data = await api("/api/auth/register","POST",{
                name,
                email,
                password
            })
        } catch (error) {
            
        }
    }
}