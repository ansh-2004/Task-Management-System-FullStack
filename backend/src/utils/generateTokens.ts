import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"

export const generateAccessToken = (userId: number)=>{
    return jwt.sign({userId},process.env.JWT_ACCESS_SECRET as string, {expiresIn: "15m"})
}

export const generateRefrestToken = (userId: number)=>{
    return jwt.sign({userId},process.env.JWT_REFRESH_SECRET as string, {expiresIn: "10d"})
}