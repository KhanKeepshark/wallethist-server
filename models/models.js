import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'

const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    name: {type: DataTypes.STRING,  allowNull: false},
    password: {type: DataTypes.STRING,  allowNull: false},
    lastBudget: {type: DataTypes.INTEGER},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    img: {type: DataTypes.STRING},
})

const Budget = sequelize.define('Budget', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING,  allowNull: false},
    limit: {type: DataTypes.INTEGER,  allowNull: false}
})

const Category = sequelize.define('Category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING,  allowNull: false}
})

const Wallet = sequelize.define('Wallet', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING,  allowNull: false}
})

const Record = sequelize.define('Record', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    wallet: {type: DataTypes.STRING,  allowNull: false},
    money: {type: DataTypes.INTEGER,  allowNull: false},
    category: {type: DataTypes.STRING,  allowNull: false},
    description: {type: DataTypes.STRING},
    date: {type: DataTypes.DATEONLY,  allowNull: false}
})

const Token = sequelize.define('Token', {
    refreshToken: {type: DataTypes.STRING, allowNull: false},
})

User.hasMany(Budget)
Budget.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)

Budget.hasMany(Category)
Category.belongsTo(Budget)

Budget.hasMany(Wallet)
Wallet.belongsTo(Budget)

Budget.hasMany(Record)
Record.belongsTo(Budget)

export {User, Record, Budget, Token, Wallet, Category}
