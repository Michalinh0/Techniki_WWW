const express = require('express')
const router = express.Router()
const loginMiddleware = require('../middleware/loginMiddleware')
const databaseMiddleware = require('../middleware/databaseMiddleware')

router.use(loginMiddleware)
router.use(databaseMiddleware)

router.get('/', function (req, res) {
    req.db.all('SELECT Nazwa FROM Karty', function (err, rows) {
      if (err) {
        console.error(err.message);
      }
      console.log(rows)
      res.render('exchange', { options: rows });
    });
  });

router.get('/search', function (req,res) {
    var card = req.body.selectedOption
    let sql = "SELECT Login FROM Kolekcja GROUP BY Login, IDKarty HAVING COUNT(IDKarty) >= 2;"
    req.db.all(sql , function (err, rows) {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log(rows)
            res.render('search' , {users: rows , selectedOption: card})
        }
    })
});

module.exports = router