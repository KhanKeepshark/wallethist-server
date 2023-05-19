import { Budget } from "../models/models.js"

class BudgetController {

    async create(req, res) {
        const {name, UserId, limit} = req.body
        const data = await Budget.create({name, UserId, limit})
        return res.json(data)
    }

    async getAll(req, res) {
        const {UserId} = req.query
        const data = await Budget.findAll({where: {UserId}})
        return res.json(data)
    }

    async update(req, res) {
        const {id, name, limit} = req.body
        const data = await Budget.update({ name: name, limit: limit }, { where : {
            id: id
        }})
        return res.json(data)
    }

    async delete(req, res) {
        const {id} = req.params
        const data = await Budget.findByPk(id)
        data.destroy()
        return res.json(data)
    }
}

export default new BudgetController