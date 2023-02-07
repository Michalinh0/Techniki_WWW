const express = require('express')
const router = express.Router()
const databaseMiddleware = require('../middleware/databaseMiddleware')
const loginMiddleware = require('../middleware/loginMiddleware')

router.use(loginMiddleware)
router.use(databaseMiddleware)

router.get('/', loginMiddleware, (req, res) => {
    res.render('redeem')
});

router.post('/', async (req, res) => {
    var number = parseInt(req.body.inputNumber);
    var login;


    try {
        const lsql = "SELECT Login from Uzytkownicy where Email = ?";
        const rows = await new Promise((resolve, reject) => {
            req.db.get(lsql, [req.session.user.mail], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        login = rows.Login;
    } catch (err) {
        console.error(err);
    }


    async function isValidNumber(number, rowsCount) {
        try {
            const rows = await new Promise((resolve, reject) => {
                req.db.get(`SELECT NumerSeryjny FROM Kolekcja WHERE NumerSeryjny = ${number}`, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            return number.toString().length === 10 && number.toString().startsWith('23') && 0 < number % 100 <= rowsCount && rows == undefined;
        } catch (err) {
            console.error(err);
        }
    }

    try {
        const row = await new Promise((resolve, reject) => {
            req.db.get("SELECT COUNT(*) as count FROM Karty", (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        const rowsCount = row.count;
        if (await isValidNumber(number, rowsCount)) {
            const sql = "INSERT INTO Kolekcja Values ( ? , ? , ? )";
            await new Promise((resolve, reject) => {
                req.db.run(sql, [number, number % 100, login], function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            res.redirect('/redeem');
        } else {
            res.redirect('/redeem');
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = router