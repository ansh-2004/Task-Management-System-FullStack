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

    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6">

        
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-5">

            <div>
            <label className="text-sm font-medium text-gray-600">
                Email
            </label>
            <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div>
            <label className="text-sm font-medium text-gray-600">
                Password
            </label>
            <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">
            Login
            </button>

        </form>

        
        <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <span
            className="text-blue-600 hover:underline cursor-pointer font-medium"
            onClick={() => router.push("/register")}>
            Register
            </span>
        </p>

        </div>
    </div>
);
}