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
            return res.status(401).json({success : false,message : "not authorized , token needed"})
        }

        console.log("token",token)

        const decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET as string) 


        console.log(decoded)
        console.log(typeof decoded)

        if(typeof decoded === "string"){
            return res.status(401).json({success : false,message: "token invalid"})
        }
        
        req.userId = decoded.userId as number 
        next()

    } catch (error: any) {
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
            success: false,
            message: "token expired",
            });
        }

        return res.status(401).json({
            success: false,
            message: "invalid token",
        });
    }
}