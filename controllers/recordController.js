import {Record} from '../models/models.js'
import { Op, Sequelize } from 'sequelize'

class RecordController {

    async create(req, res) {
        const {wallet, money, category, description, date, BudgetId} = req.body
        const record = await Record.create({wallet, money, category, description, date, BudgetId})
        return res.json(record)
    }

    async createCsv(req, res) {
        const csvList = req.body
        console.log('work')
        await csvList[1].map(e => {
            const {wallet, money, category, description, date} = e 
            const record =  Record.create({wallet, money, category, description, date, BudgetId: csvList[0].budget})
        })
        return res.json(csvList)
    }

    async getAll(req, res) {
        const {id, wallet, money, category, description, date, page, timeSettings, budgetId} = req.query
        const ParamsList = {id, wallet, money, category, description, date, budgetId}
        Object.keys(ParamsList).forEach(e => {
            if (ParamsList[e] == null) {
                delete ParamsList[e]
            }
        })
        if (page) {
            const record = await Record.findAll({where:ParamsList, order: [['date', 'DESC']], offset: page*10-10, limit: 10})
            const count = await Record.findAll({where:ParamsList})
            return res.json({record, count: count.length})
        } 
        if (timeSettings) {
            const record = await Record.findAll({where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), timeSettings[4]),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), timeSettings.slice(0, 4)),
                ],
                budgetId
            }, order: [['date', 'ASC']]
            })
            return res.json(record)
        }
        const record = await Record.findAll({where: {budgetId}, order: [['date', 'DESC']]})
        return res.json(record)
        
    }

    async update(req, res) {

    }

    async delete(req, res) {
        const {id} = req.params
        const record = await Record.findOne({
            where: {id}
        })
        record.destroy()
        return res.status(200).send({message: `record ${id} deleted`})
    }

}

export default new RecordController