import express from "express"
import cors from 'cors'
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes"
import taskRoutes from "./routes/task.routes"

dotenv.config()

import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: "http://localhost:3000",
    credentials : true 
}))

app.use(express.json())
app.use(cookieParser())


app.use('/api/auth',authRoutes)
app.use('/api/tasks',taskRoutes)

app.listen(5000,()=>{
    console.log("Server running on port 5000")
})