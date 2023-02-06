const express = require('express')
const router = express.Router()
const databaseMiddleware = require('../middleware/databaseMiddleware')

router.use(databaseMiddleware)

router.get('/' , (req , res) =>{
    res.render('reglog')
});

router.post('/reg' , (req , res) =>{
  var mail = req.body.Email
  var login = req.body.Login
  var password = req.body.Password
  var password2 = req.body.PasswordRepeat

  if (password !== password2) {
    return res.redirect('/reglog?error=passwords-do-not-match');
    }

  let checkLoginAndEmailSQL = `SELECT COUNT(*) as count FROM Uzytkownicy WHERE email = ? OR login = ?`;
    req.db.get(checkLoginAndEmailSQL, [mail, login], (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      if (row.count > 0) {
        return res.redirect('/reglog?error=registration-failed');
      }
    });

  let isql = 'Insert into Uzytkownicy Values (? , ? , ? , 1)';
  req.db.run(isql, [mail, login, password], function(err) {
    if (err) {
      console.error(err.message);
      return;
    }
    req.session.user = {
      mail: mail
    };
    res.redirect('/log');
  });

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
      console.log("Assigned session")
      res.redirect('/log');
    } else {
      res.redirect('/reglog?error=combination-not-found');
    }
});
});

module.exports = router