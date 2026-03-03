import dotenv from "dotenv"
dotenv.config()

import {Request, Response, NextFunction} from 'express'

import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request{
    userId? : number
}

export const authenticate = (req: AuthRequest,res:Response,next : NextFunction)=>{
    try {
        const token = req.cookies?.accessToken

        if(!token){
            return res.status(401).json({message : "not authorized , token needed"})
        }

        console.log("token",token)

        const decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET as string) 


        console.log(decoded)
        console.log(typeof decoded)

        if(typeof decoded === "string"){
            return res.status(401).json({message: "token invalid"})
        }
        
        req.userId = decoded.userId as number 
        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "token expired"})
    }
}