import {Router} from "express"
const router = Router()

import { authenticate } from "../middleware/auth.middleware"

import { createTask,deleteTask,getTasks,toggleTask,updateTask ,getTaskById} from "../controller/task.controller"

router.post('/',authenticate,createTask)
router.get('/',authenticate,getTasks)
router.get('/:id',authenticate,getTaskById)
router.patch('/:id',authenticate,updateTask)
router.delete('/:id',authenticate,deleteTask)
router.patch('/:id/toggle',authenticate,toggleTask)

export default router