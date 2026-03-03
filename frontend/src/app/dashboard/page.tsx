"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface Task {
    id: number;
    title : string,
    completed: boolean
}

export default function Dashboard(){
    const router = useRouter()

    const [tasks,setTasks] = useState<Task[]>([])
    const [loading,setLoading] = useState(true)

    const [newTitle,setNewTitle] = useState("")

    const getTasks = async()=>{
        setLoading(true)

        try {
            const data = await api('/api/tasks')
            console.log("data",data)
            if(data.success === false) {
                toast.error("You need to Login first")
                router.push('/login')
                return;
            }
            
            setTasks(data.tasks)

        } catch (error) {
            toast.error("Failed to get your tasks")
        }finally{
            setLoading(false)
        }
    }

    const handleCreateTask = async()=>{
        if(!newTitle.trim()){
            toast.error("Title is required")
            return;
        }

        try {
            const data = await api('/api/tasks',"POST",{
                title : newTitle
            })

            toast.success("Task Created")
            setNewTitle("")

            getTasks()

        } catch (error) {
            toast.error("Failed to create task")
        }
    }

    const handleToggle = async(id: number)=>{
        try {
            await api(`/api/tasks/${id}/toggle`,"PATCH")
            toast.success("Task updated")

            getTasks()
        } catch (error) {
            toast.error("Failed to update task")
        }
    }

    const handleDelete = async(id: number)=>{
        try {
            await api(`/api/tasks/${id}`,"DELETE")
            toast.success("Task Deleted")

            getTasks()

        } catch (error) {
            toast.error("Failed to delete task")
        }
    }

    const handleLogout = async()=>{
        try {
            await api('/api/auth/logout',"POST")
            toast.success("Logged out successfuly")

            setTimeout(()=>{
                router.push("/login")
            },800)
        } catch (error) {
            toast.error("Failed to logout")
        }
    }
    useEffect(()=>{
        getTasks()
    },[])

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Tasks</h1>

                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
                    Logout
                </button>
            </div>
            <div className="flex gap-2 mb-6">
                <input
                type = "Text"
                placeholder="Enter new task"
                className="flex-1 border p-2 rounded"
                value={newTitle}
                onChange={(e)=>setNewTitle(e.target.value)}>

                </input>

                <button onClick={handleCreateTask} className="bg-blue-600-text-white px-4 rounded hover:bg-blue-700">
                Add
                </button>
            
            </div>
            
            {loading ? (
                <p>Loading</p>
            ) : tasks.length === 0 ? (
                <p>No Tasks found</p>
            ): (
                
                <ul className="space-y-3">
                    {tasks.map((task)=>(
                        <li key={task.id} className="bg-white p4 rounded shadow flex justify-between items-center">
                            <div className="flex items-center gap-4">
                            <span className={task.completed ? "line-through text-gray-500" : ""}>
                                {task.title}
                            </span>

                            <button onClick={()=> handleToggle(task.id)} className="text-blue-600 text-sm hover:underline">
                                Toggle
                            </button>

                            <button onClick={()=> handleDelete(task.id)} className="text-red-600-sm hover:underline">
                                Delete
                            </button>
                            </div>

                            <span className= {task.completed ? "text-green-600 text-sm" : "text-yellow-600 text-sm"}>
                                {task.completed ? "Completed" : "Pending"}
                            </span>
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

}