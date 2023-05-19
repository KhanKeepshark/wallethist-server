import { Category } from "../models/models.js"

class CategoryController {

    async create(req, res) {
        const {name, BudgetId} = req.body
        const data = await Category.create({name, BudgetId})
        return res.json(data)
    }

    async getAll(req, res) {
        const {BudgetId} = req.query
        const data = await Category.findAll({where: {BudgetId}})
        return res.json(data)
    }

    async update(req, res) {
        const {id, name} = req.body
        const data = await Category.update({ name: name}, { where : {
            id: id
        }})
        return res.json(data)
    }

    async delete(req, res) {
        const {id} = req.params
        const data = await Category.findByPk(id)
        data.destroy()
        return res.json(data)
    }
}

export default new CategoryController