import {Router} from "express"
const router = Router()

import {login,logout,refreshToken,register} from "../controller/auth.controller"
import { authenticate } from "../middleware/auth.middleware"
router.post('/register',register)
router.post('/login',login)

router.post('/refresh',refreshToken)

router.post('/logout',authenticate,logout)

export default router;