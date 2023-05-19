import { Router } from "express";
import categoryController from "../controllers/categoryController.js";

const router = new Router()

router.post('/', categoryController.create)
router.get('/', categoryController.getAll)
router.put('/', categoryController.update)
router.delete('/:id', categoryController.delete)

export default router