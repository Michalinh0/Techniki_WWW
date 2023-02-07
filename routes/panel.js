const express = require('express')
const router = express.Router()
const loginMiddleware = require('../middleware/loginMiddleware')
const databaseMiddleware = require('../middleware/databaseMiddleware')

router.use(loginMiddleware)
router.use(databaseMiddleware)

router.get('/', loginMiddleware, function (req, res) {
    req.db.get('SELECT Login FROM Uzytkownicy WHERE Email = ?' , [req.session.user.mail] , function (err, login1) {
      if (err) {
        console.error(err.message);
      }
      else {
        req.db.all("SELECT * FROM Wymiany WHERE Login2 = ? AND Status = 'Pending'", [login1.Login], (err, rows) => {
            if (err) {
              console.error(err.message);
            }
            else {
                res.render('panel' , {login: login1.Login , rows: rows});
            }
          });
    }
    });
  });

router.post('/accept' , (req , res) =>{
    const login1 = req.body.username;
    const idKarty1 = req.body.card;
    const login2 = req.body.username2;
    const idKarty2 = req.body.card2;

    console.log(login1)
    console.log(idKarty1)
    console.log(login2)
    console.log(idKarty2)

    console.log("Entered accept");

    req.db.run("UPDATE Wymiany SET Status = 'Accepted' WHERE Login1 = ? AND IDKarty1 = ? AND Login2 = ? AND IDKarty2 = ?", [login1, idKarty1, login2, idKarty2], (err) => {
        if (err) {
        console.error(err.message);
        }
        else {
        console.log("Update successful");
        }
    });
    let sql = "UPDATE Kolekcja SET Login = ? WHERE IDKarty = ? AND Login = ? AND NumerSeryjny = ( SELECT NumerSeryjny FROM Kolekcja WHERE IDKarty = ? AND Login = ? LIMIT 1 )";
    req.db.run(sql, [login1, idKarty2, login2, idKarty2 , login2], (err) => {
        if (err) {
        console.error(err.message);
        }
        else {
        console.log("Swap1 suc");
        }
    });
    req.db.run(sql, [login2, idKarty1, login1, idKarty1 , login1], (err) => {
        if (err) {
        console.error(err.message);
        }
        else {
        console.log("Swap2 suc");
        }
    });
    res.redirect('/panel')
});

router.post('/decline' , (req , res) =>{
    const login1 = req.body.username;
    const idKarty1 = req.body.card;
    const login2 = req.body.username2;
    const idKarty2 = req.body.card2;

    console.log(login1)
    console.log(idKarty1)
    console.log(login2)
    console.log(idKarty2)

    console.log("Entered decline");

    req.db.run("UPDATE Wymiany SET Status = 'Declined' WHERE Login1 = ? AND IDKarty1 = ? AND Login2 = ? AND IDKarty2 = ?", [login1, idKarty1, login2, idKarty2], (err) => {
        if (err) {
        console.error(err.message);
        }
        else {
        console.log("Status updated successfully");
        }
    });
    res.redirect('/panel')
});

module.exports = router;