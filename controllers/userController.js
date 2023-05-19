import ApiError from "../error/apiError.js"
import { Budget, User } from "../models/models.js"
import bcrypt from "bcrypt"
import { validationResult } from "express-validator"
import TokenService from "../service/tokenService.js"
import * as uuid from "uuid"
import path from 'path'
import fs from 'fs'

class UserController {
    async registration(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(ApiError.badReq(400, errors))
        }
        const {name, password, role} = req.body
        const candidate = await User.findOne({where: {name}})
        if (candidate){
            return next(ApiError.badReq(400, 'EMAIL ALREADY EXIST'))
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await User.create({name, role, password: hashPassword, img: 'user.png'})
        const budget = await Budget.create({name: 'MyBudget', limit: 100000, UserId: user.id})
        const tokens = TokenService.generateTokens(user.id, user.name, user.role)
        await TokenService.saveToken(user.id, tokens.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json({...tokens, user: {userId: user.id, username: user.name, userEmail: user.email}, budget: budget})
    }

    async login(req, res, next) {
        const {name, password} = req.body
        const user = await User.findOne({where: {name}})
        if (!user) {
            return next(ApiError.badReq(400, 'USER DOES NOT EXIST'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badReq(400, 'WRONG PASSWORD'))
        }
        const budgetParams = {UserId: user.id}
        user.lastBudget ? budgetParams.id = user.lastBudget : null
        const budget = await Budget.findOne({where: budgetParams})
        const tokens = TokenService.generateTokens(user.id, user.name, user.role)
        await TokenService.saveToken(user.id, tokens.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json({...tokens, user: {userId: user.id, username: user.name, userEmail: user.email, img: user.img}, budget: budget})
    }

    async logout(req, res, next) {
        const {refreshToken} = req.cookies
        res.clearCookie('refreshToken')
        const token = await TokenService.removeToken(refreshToken)
        return next(ApiError.badReq(200, 'token deleted'))
    }

    async refresh(req, res, next) {
        const {refreshToken} = req.cookies
        if (!refreshToken) {
            return next(ApiError.badReq(401, 'NOT AUTHORIZED'))
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const findToken = await TokenService.findRefreshToken(refreshToken)
        if (!userData || !findToken) {
            return next(ApiError.badReq(401, 'NOT AUTHORIZED'))
        }
        const user = await User.findOne({where: {id: userData.id}})
        const budgetParams = {UserId: user.id}
        user.lastBudget ? budgetParams.id = user.lastBudget : null
        const budget = await Budget.findOne({where: budgetParams})
        const tokens = TokenService.generateTokens(user.id, user.name, user.role)
        await TokenService.saveToken(user.id, tokens.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json({...tokens, user: {userId: user.id, username: user.name, userEmail: user.email, img: user.img}, budget: budget})
    }

    async getUsers(req, res) {
        const {id} = req.query
        console.log(id)
        const user = await User.findOne({where: {id}})
        return res.json({userId: user.id, username: user.name, userEmail: user.email, img: user.img})
    }

    async updateUser(req, res, next) {
        const {id, lastBudget, name, email, password, oldPassword} = req.body
        const user = await User.findOne({where: {id}})
        const userParams = {name, lastBudget, email}
        if(req.files){
            const {img} = req.files
            if (user.img != 'user.png') {
                fs.unlink('./static/' + user.img, (err) => {
                    if (err) throw err
                })
            }
            let filename = uuid.v4() + '.png'
            img.mv(path.resolve('./static', filename))
            userParams.img = filename
        }
        console.log(req.files)
        if (oldPassword) {
            let comparePassword = bcrypt.compareSync(oldPassword, user.password)
            if (!comparePassword) {
                return next(ApiError.badReq(400, 'WRONG PASSWORD'))
            }
            const hashPassword = await bcrypt.hash(password, 3)
            userParams.password = hashPassword
        }
        const data = await User.update(userParams, { where : {
            id: id
        }})
        return res.json(data)
    }

}

export default new UserController