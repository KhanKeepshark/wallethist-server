import { Wallet } from "../models/models.js"

class WalletController {

    async create(req, res) {
        const {name, BudgetId} = req.body
        const data = await Wallet.create({name, BudgetId})
        return res.json(data)
    }

    async getAll(req, res) {
        const {BudgetId} = req.query
        const data = await Wallet.findAll({where: {BudgetId}})
        
        return res.json(data)
    }

    async update(req, res) {
        const {id, name} = req.body
        const data = await Wallet.update({ name: name}, { where : {
            id: id
        }})
        return res.json(data)
    }

    async delete(req, res) {
        const {id} = req.params
        const data = await Wallet.findByPk(id)
        data.destroy()
        return res.json(data)
    }
}

export default new WalletController