const express = require('express')
const router = express.Router()
const loginMiddleware = require('../middleware/loginMiddleware')
const databaseMiddleware = require('../middleware/databaseMiddleware')

router.use(loginMiddleware)
router.use(databaseMiddleware)

router.get('/' , loginMiddleware, (req , res) =>{
    let sql = "SELECT Karty.IDKarty, Karty.Nazwa, Karty.NazwaPliku, COALESCE(COUNT(Kolekcja.IDKarty), 0) as count FROM Karty LEFT JOIN (SELECT IDKarty FROM Kolekcja WHERE Login = (SELECT Login FROM Uzytkownicy WHERE Email = ?)) Kolekcja ON Kolekcja.IDKarty = Karty.IDKarty GROUP BY Karty.IDKarty;"
    req.db.all(sql , [req.session.user.mail] , (err , data) =>{
        if(err) {
            console.error(err)
        }
        else {
            for(var i = 0; i < data.length; i++) {
                console.log (data[i]);
              }
            res.render('collection' , {data: data})
        }
    });
});

module.exports = router