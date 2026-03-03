"use client";

import { useEffect, useState } from "react";
import { useRouter,useParams } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function TaskDetail(){
    interface Task {
        id: number;
        title: string;
        completed: boolean;
        createdAt: string;
    }

    const {id} = useParams()
    const router = useRouter()

    const [task,setTask] = useState<Task | null>(null);
    const [title,setTitle] = useState("")
    const [loading,setLoading] = useState(true)

    const [status,setStatus] = useState("")
    
    const getTask = async()=>{
        setLoading(true)
        try {
            const data = await api(`/api/tasks/${id}`)

            if(data.success){
                setTask(data.task)
                setTitle(data.task.title)
                setStatus(data.task.completed ? "Completed" : "Pending")
            }

        } catch (error) {
            toast.error("Failed to get task")
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getTask()
    },[])

    const handleUpdate = async()=>{
        try {
            const data = await api(`/api/tasks/${id}`,"PATCH",{
                title,
                completed : task?.completed
            })
            if(data.success){
                toast.success("Task updated")
                router.push('/dashboard')
            }
        } catch (error) {
            toast.error("Failed to update task ")
        }
    }

    const handleToggle = async()=>{
        try {
            await api(`/api/tasks/${id}/toggle`,"PATCH")
            setStatus(task?.completed ? "Completed" : "Pending")
            toast.success("Task updated")

        } catch (error) {
            toast.error("Failed to update task")
        }
    }

    const handleDelete = async()=>{
        try {
            await api(`/api/tasks/${id}`,"DELETE")
            toast.success("Task Deleted")
            router.push('/dashboard')
            

        } catch (error) {
            toast.error("Failed to delete task")
        }
    }

    if(loading) return <p className="p-6">Loading...</p>

   const formattedDate = task
  ? new Date(task.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  : "";

    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-3 py-6 sm:px-4 sm:py-10">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-5 sm:p-8 space-y-6">

        
        <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Task Details
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Update or manage your task below
            </p>
        </div>

       
        <div>
            <label className="text-sm font-medium text-gray-600">
            Task Title
            </label>
            <input
            className="mt-1 border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
        </div>

       
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="text-sm text-gray-600">Status</span>

            <span
                className={`text-sm font-semibold px-3 py-1 rounded-full text-center ${
                task?.completed
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
            >
                {task?.completed ? "Completed" : "Pending"}
            </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 gap-1">
            <span>Created On</span>
            <span>{formattedDate}</span>
            </div>
        </div>

       
        <div className="flex flex-col gap-3 pt-4">

            <button
            onClick={handleUpdate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
            Save Changes
            </button>

            <button
            onClick={handleToggle}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-medium"
            >
            {task?.completed ? "Mark as Pending" : "Mark as Completed"}
            </button>

            <button
            onClick={handleDelete}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-medium"
            >
            Delete Task
            </button>

            <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
            Back to Dashboard
            </button>

        </div>

        </div>
    </div>
    );
}



