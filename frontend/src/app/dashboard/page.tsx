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
    const [loading,setLoading] = useState<Task[]>([])

}