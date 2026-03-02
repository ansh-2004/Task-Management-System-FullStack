import {Request,Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../prisma/client"
import { generateAccessToken,generateRefrestToken } from "../utils/generateTokens"

export const register = async (req: Request, res:Response)=>{
    try {
        const {email,password} = req.body 

        console.log(email)

        if(!email || !password){
            return res.status(400).json({message : "Please enter your emal and password"})
        }

        const userExist = await prisma.user.findUnique({where : {email}})

        if(userExist){
            return res.status(400).json({message : "User already exist"})
        }

        const hash = await bcrypt.hash(password,10)

        const user = await prisma.user.create({
            data : {
                email,
                password: hash
            }
        })

        console.log(user)

        res.status(201).json({message : "User created successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Server error"})
    }
}

export const login = async(req: Request, res: Response)=>{
    try {
        const {email,password} = req.body 

        console.log(email)

        if(!email || !password){
            return res.status(400).json({message : "Please enter your emal and password"})
        }

        const user = await prisma.user.findUnique({where : {email}})
        console.log(user)

        if(!user){
            return res.status(400).json({message : "You need to register first"})
        }

        const isValid = await bcrypt.compare(password,user.password)

        if(!isValid){
            return res.status(400).json({message: "Incorrect Password "})
        }

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefrestToken(user.id)

        await prisma.user.update({
            where : {
                id : user.id
            },
            data:{
                refreshToken
            },
        })

        res.status(200).json({accessToken,refreshToken})

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Server error"})
    }
}

export const refreshToken = async (req: Request, res: Response)=>{
    try {
        const {refreshToken} = req.body 

        if(!refreshToken){
            res.status(401).json({message: "Refresh token needed"})
        }

        const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET as string) as {userId: number}

        console.log("decoded",decoded)

        const user = await prisma.user.findUnique({where : {
            id : decoded.userId
        }})

        
        console.log(user)

        if(!user || user.refreshToken != refreshToken){
            return res.status(403).json({message : "refresh token invalid"})
        }

        const newAccessToken = generateAccessToken(user.id)

        res.json({accessToken : newAccessToken})

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Server error"})
    }
}

export const logout = async (req:Request, res:Response) =>{
    try {
        const {userId} = req.body

        await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                refreshToken : null
            }
        })

        res.status(200).json({message : "Logged out"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Server error"})
    }
}