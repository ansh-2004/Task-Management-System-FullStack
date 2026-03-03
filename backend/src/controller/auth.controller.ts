import {Request,Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../prisma/client"
import { generateAccessToken,generateRefrestToken } from "../utils/generateTokens"
import { AuthRequest } from "../middleware/auth.middleware"

export const register = async (req: Request, res:Response)=>{
    try {
        const {email,password} = req.body 

        console.log(email)

        if(!email || !password){
            return res.status(400).json({success : false,message : "Please enter your emal and password"})
        }

        const userExist = await prisma.user.findUnique({where : {email}})

        if(userExist){
            return res.status(400).json({success : false,message : "User already exist"})
        }

        const hash = await bcrypt.hash(password,10)

        const user = await prisma.user.create({
            data : {
                email,
                password: hash
            }
        })

        console.log(user)

        res.status(201).json({success : true, message : "User created successfully"})

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
            return res.status(400).json({success : false,message : "Please enter your emal and password"})
        }

        const user = await prisma.user.findUnique({where : {email}})
        console.log(user)

        if(!user){
            return res.status(400).json({success : false,message : "You need to register first"})
        }

        const isValid = await bcrypt.compare(password,user.password)

        if(!isValid){
            return res.status(400).json({success : false,message: "Incorrect Password "})
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

        res.cookie("accessToken",accessToken,{
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.cookie("refreshToken",refreshToken,{
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        res.status(200).json({success : true,message: "Login Successful"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Server error"})
    }
}

export const refreshToken = async (req: Request, res: Response)=>{
    try {
        console.log("refresh token controller")
        
        const refreshToken = req.cookies.refreshToken
        
        console.log('refresh token',refreshToken)

        if(!refreshToken){
            res.status(401).json({success : false,message: "Refresh token needed"})
        }

        const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET as string) as {userId: number}

        console.log("decoded",decoded)

        const user = await prisma.user.findUnique({where : {
            id : decoded.userId
        }})

        
        console.log(user)

        if(!user || user.refreshToken != refreshToken){
            return res.status(403).json({success : false,message : "refresh token invalid"})
        }

        const newAccessToken = generateAccessToken(user.id)

        res.cookie("accessToken",newAccessToken,{
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        
        res.status(200).json({success : true,message : "Access token refreshed"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Server error"})
    }
}

export const logout = async (req:AuthRequest, res:Response) =>{
    try {
        

        await prisma.user.update({
            where : {
                id : req.userId!
            },
            data : {
                refreshToken : null
            }
        })

        res.clearCookie("accessToken",{
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.status(200).json({success : true,message : "Logged out"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Server error"})
    }
}