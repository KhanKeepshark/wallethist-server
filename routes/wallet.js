import { Router } from "express";
import walletController from "../controllers/walletController.js";

const router = new Router()

router.post('/', walletController.create)
router.get('/', walletController.getAll)
router.put('/', walletController.update)
router.delete('/:id', walletController.delete)

export default router