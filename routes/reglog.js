const express = require('express')
const router = express.Router()
const databaseMiddleware = require('../middleware/databaseMiddleware')

router.use(databaseMiddleware)

router.get('/' , (req , res) =>{
    res.render('reglog')
});

router.post('/reg' , (req , res) =>{
    res.redirect('/log')
});

router.post('/log' , (req , res) =>{
    var mail = req.body.Email
    var password = req.body.Password
    console.log(mail)
    console.log(password)
    let sql = `SELECT * FROM Uzytkownicy WHERE email = ? AND Haslo = ?`;
    req.db.get(sql, [mail, password], (err, row) => {
    if (err) {
      console.error(err.message);
    }
    if (row) {
      req.session.user = {
        mail: mail
      };
      res.redirect('/log');
    } else {
      res.redirect('/');
    }
});
});

module.exports = router