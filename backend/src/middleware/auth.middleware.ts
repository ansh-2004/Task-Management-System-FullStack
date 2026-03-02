import {Request, Response, NextFunction} from 'express'

import jwt from 'jsonwebtoken'

interface AuthRequest extends Request{
    userId? : number
}

export const authenticate = (req: AuthRequest,res:Response,next : NextFunction)=>{
    try {
        const header = req.headers.authorization

        if(!header){
            return res.status(401).json({message : "token needed"})
        }

        console.log("header",header)

        const token = header.split(" ")[1]

        if(!token) {
            return res.status(401).json({message : "Token missing"})

        }
        const decoded = jwt.verify(token,process.env.JWT_REFRESH_SECRET as string) 


        console.log(decoded)
        console.log(typeof decoded)

        if(typeof decoded === "string"){
            return res.status(401).json({message: "token invalid"})
        }
        
        req.userId = decoded.userId as number 
        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Server error"})
    }
}