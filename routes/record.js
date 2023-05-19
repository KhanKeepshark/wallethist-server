import { Router } from "express";
import recordController  from "../controllers/recordController.js"

const router = new Router()

router.post('/', recordController.create)
router.post('/csv', recordController.createCsv)
router.get('/', recordController.getAll)
router.delete('/:id', recordController.delete)

export default router