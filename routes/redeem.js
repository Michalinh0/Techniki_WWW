const express = require('express')
const router = express.Router()
const databaseMiddleware = require('../middleware/databaseMiddleware')
const loginMiddleware = require('../middleware/loginMiddleware')

router.use(loginMiddleware)
router.use(databaseMiddleware)

router.get('/', (req, res) => {
    res.render('redeem')
});

router.post('/', (req, res) => {
    var number = parseInt(req.body.inputNumber)

    function isValidNumber(number, rowsCount) {
        return number.toString().length === 10 && number.toString().startsWith('23') && 0 < number % 100 <= rowsCount;
    }

    req.db.get("SELECT COUNT(*) as count FROM Karty", (err, row) => {
        if (err) {
            console.error(err);
        } else {
            const rowsCount = row.count;
            console.log(rowsCount)
            if (isValidNumber(number, rowsCount)) {
                res.redirect('/log');
            } else {
                res.redirect('/redeem');
            }
        }
    });
});

module.exports = router