"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link"

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

    const [search,setSearch] = useState("")

    const [filter,setFilter] = useState("all")

    const [page,setPage] = useState(1)
    const [totalPages,setTotalPages] = useState(1)
    const limit = 5

    const getTasks = async()=>{
        setLoading(true)

        try {
            let url = "/api/tasks"

            const params = new URLSearchParams()

            if(search){
                params.append("search",search)
            }

            if(filter !== "all"){
                params.append("status",filter)
            }

            params.append("page",page.toString())
            params.append("limit",limit.toString())

            
            url += `?${params.toString()}`
            


            const data = await api(url)

            console.log("data",data)

            if(data.success === false) {
                toast.error("You need to Login first")
                router.push('/login')
                return;
            }
            
            setTasks(data.tasks)
            setTotalPages(data.totalPages)

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
    },[page])

    useEffect(() => {
        if (search === "") {
        getTasks();
        }
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [search, filter]);

    return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-6 px-3 sm:py-10 sm:px-4">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-4 sm:p-8">

        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Tasks
            </h1>

            <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            Logout
            </button>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            </select>

            <button
            onClick={getTasks}
            className="w-full sm:w-auto bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Apply
            </button>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
            type="text"
            placeholder="Search tasks..."
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>

            <button
            onClick={getTasks}
            className="w-full sm:w-auto bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Search
            </button>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
            type="text"
            placeholder="Enter new task"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}/>

            <button
            onClick={handleCreateTask}
            className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Add
            </button>
        </div>

        
        {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
            <ul className="space-y-4">
                {tasks.map((task) => (
                    <Link key={task.id} href={`/tasks/${task.id}`} className="block">
                    <li
                        className="border border-gray-200 rounded-lg p-4 
                        flex flex-col sm:flex-row sm:justify-between sm:items-center 
                        gap-2 hover:shadow-md hover:bg-gray-50 transition cursor-pointer">
                    <span
                    className={`text-base sm:text-lg ${ task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {task.title}
                    </span>

                <span
                className={`text-sm font-medium ${
                    task.completed
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}>
                    {task.completed ? "Completed" : "Pending"}
                    </span>
                </li>
                </Link>
            ))}
            </ul>
        )}

        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-10 text-center">
            <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300 transition">
            Previous
            </button>

            <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
            </span>

            <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300 transition">
            Next
            </button>
        </div>

        </div>
    </div>
    );

}