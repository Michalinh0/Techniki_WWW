const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./Karty.db')

function databaseMiddleware(req, res, next) {
    req.db = db
    next()
}

module.exports = databaseMiddleware