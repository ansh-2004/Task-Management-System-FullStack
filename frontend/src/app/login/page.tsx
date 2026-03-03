"use client";

import { useState } from "react"
import {useRouter} from "next/navigation"
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function Login(){
    const router = useRouter()
    const[email,setEmail] = useState("")
    const [password,setPassword] = useState("")


    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault()
        
        

        if(!email || !password){
            toast.error("Please fill all the fields")
            return;
        }

        try {
            const data = await api("/api/auth/login","POST",{
                email,
                password
            })

            console.log(data)

            if(data.success === true){
                toast.success("Login successful")
                setTimeout(()=>{
                    router.push("/dashboard")
                },800)
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Server error")
        }
    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    

                    <input
                    type = "email"
                    placeholder="Enter your email"
                    className="w-full border p-2 rounded"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    />

                    <input
                    type = "password"
                    placeholder="Enter your password"
                    className="w-full border p-2 rounded"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    />

                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"> Login </button>
                    
                </form>

                <p className="text-sm mt-4 text-center">
                    Don't have an account?{" "}
                    <span className="text-blue-600 cursor-pointer" onClick={()=>router.push("/register")}>
                        Register
                    </span>
                </p>
            </div>
        </div>
    )
}