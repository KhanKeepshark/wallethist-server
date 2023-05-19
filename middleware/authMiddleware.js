import ApiError from "../error/apiError.js"
import tokenService from "../service/tokenService.js"

export default function(req, res, next) {
    if (req.method === "OPTIONS"){
        next()
    }
    try{
        const token = req.headers.authorization.split(' ')[1]
        if (!token){
            return next(ApiError.badReq(401, 'NOT AUTHORIZED'))
        }
        const decoded = tokenService.validateAccessToken(token)
        if (!decoded){
            return next(ApiError.badReq(401, 'NOT AUTHORIZED'))
        }
        req.user = decoded
        next()
    } catch(e){
        return next(ApiError.badReq(401, 'NOT AUTHORIZED'))
    }
}