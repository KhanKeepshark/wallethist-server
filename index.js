
import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import {sequelize} from './database/db.js'
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandlingMiddleware.js'
import cors from 'cors'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path'


const PORT = process.env.PORT || 3000
const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.resolve('./static')))
app.use(fileUpload({}))
app.use('/', routes)
app.use(errorHandler)


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()