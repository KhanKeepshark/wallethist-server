import { Token } from "../models/models.js"
import jwt from "jsonwebtoken"

class TokenService {
    generateTokens(id, name, role){
        const accessToken = jwt.sign(
            {id, name, role}, 
            process.env.ACCESS_SECRET,
            {expiresIn: '30m'}
            )
        const refreshToken = jwt.sign(
            {id, name, role}, 
            process.env.REFRESH_SECRET,
            {expiresIn: '10h'}
            )
        return {accessToken, refreshToken}    
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({where: {UserId: userId}})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await Token.create({UserId: userId, refreshToken})
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.findOne({where: {refreshToken}})
        await tokenData.destroy()
        return tokenData
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_SECRET)
            return userData
        } catch(e) {
            return null
        }
        
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_SECRET)
            return userData
        } catch(e) {
            return null
        }
    }

    async findRefreshToken(refreshToken) {
        const tokenData = await Token.findOne({where: {refreshToken}})
        return tokenData
    }
}

export default new TokenService