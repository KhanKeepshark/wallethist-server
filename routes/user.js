import { Router } from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { registerValidation } from "../middleware/authValidation.js";

const router = new Router()

router.post('/registration', registerValidation, userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/getusers', userController.getUsers)
router.put('/update', userController.updateUser)

export default router