import { Router } from "express";
import userRouter from "./user.js"
import recordRouter from "./record.js"
import budgetRouter from "./budget.js"
import walletRouter from "./wallet.js"
import categoryRouter from "./category.js"

const router = new Router()

router.use('/user', userRouter)
router.use('/budget', budgetRouter)
router.use('/record', recordRouter)
router.use('/wallet', walletRouter)
router.use('/category', categoryRouter)

export default router