import { Router } from "express";
import budgetController from "../controllers/budgetController.js";

const router = new Router()

router.post('/', budgetController.create)
router.get('/', budgetController.getAll)
router.put('/', budgetController.update)
router.delete('/:id', budgetController.delete)

export default router