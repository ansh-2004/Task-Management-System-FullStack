import {Request,Response} from "express"
import prisma from "../prisma/client"

import {AuthRequest} from '../middleware/auth.middleware'

export const createTask = async (req: AuthRequest, res: Response)=>{
    try {
        const {title} = req.body 

        console.log("title",title)

        if(!title || title.trim() === ""){
            return res.status(400).json({success : false, message : "Please enter your task"})
        }

        const task = await prisma.task.create({
            data : {
                title,
                userId: req.userId!
            },
        })

         res.status(201).json({success : true,task})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error"})
    }
}

export const getTasks = async(req: AuthRequest,res: Response)=>{
    try {
        const page = Number(req.query.page) || 1 
        const limit = Number(req.query.limit) || 5 

        const status = req.query.status as string 
        const search = req.query.search as string 

        const skip = (page -1) * limit 

        const whereClause : any = {
            userId: req.userId!,
        }

        if(status){
            whereClause.completed = status === "completed"
        }

        if(search){
            whereClause.title = {
                contains: search,
                mode : "insensitive"
            }
        }

        console.log(whereClause)

        const tasks = await prisma.task.findMany({
            where: whereClause,
            skip,
            take : limit,
            orderBy: {createdAt: "desc"}
        })


        console.log("tasks",tasks)

         res.status(200).json({success : true,tasks})


    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error"})
    }
}

export const getTaskById = async(req:AuthRequest,res: Response)=>{
    try {
        const id = Number(req.params.id)
        const task = await prisma.task.findFirst({
            where:{
                id: id,
                userId: req.userId!
            }
        })

        if(!task){
            return res.status(404).json({success : false,message: "Task not found"})
        }

        return res.status(200).json({success : true,task})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error"})
    }
}

export const updateTask = async (req: AuthRequest, res: Response)=>{
    try {
        const id = Number(req.params.id)
        const {title} = req.body 

        if(!title || title.trim() === "") {
            return res.status(400).json({success : false,message : "Please enter your updated task"}) 
        }
        console.log(title)

        const task = await prisma.task.updateMany({
            where:{
                id,
                userId: req.userId!
            },
            data: {title}
        })

         res.status(200).json({success : true,task})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error"})
    }
}

export const deleteTask = async(req: AuthRequest,res:Response)=>{
    try {
        const id = Number(req.params.id)

        await prisma.task.deleteMany({
            where:{
                id,
                userId: req.userId!
            }
        })

        res.status(200).json({success : true,message: "Task deleted"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error"})
    }
}


export const toggleTask = async (req: AuthRequest, res: Response)=>{
    try {
        const id = Number(req.params.id)

        const task = await prisma.task.findFirst({
            where:{
                id,
                userId: req.userId!
            }
        })

        if(!task){
            return res.status(404).json({success : false,message: "Task not found"})
        }

        const updated = await prisma.task.update({
            where : {id},
            data: {
                completed: !task.completed
            }
        })

         res.status(200).json({success : true,updated})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error"})
    }
}