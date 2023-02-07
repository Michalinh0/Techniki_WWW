const express = require('express')
const router = express.Router()
const loginMiddleware = require('../middleware/loginMiddleware')
const databaseMiddleware = require('../middleware/databaseMiddleware')

router.use(loginMiddleware)
router.use(databaseMiddleware)

router.get('/', loginMiddleware, function (req, res) {
    req.db.all('SELECT Nazwa , IDKarty FROM Karty', function (err, rows) {
      if (err) {
        console.error(err.message);
      }
      res.render('exchange', { options: rows });
    });
  });

  router.get('/search',loginMiddleware, function (req, res) {
    var card = req.query.selectedOption;
    let sql = "SELECT Login FROM Kolekcja WHERE IDKarty = ? GROUP BY Login, IDKarty HAVING COUNT(IDKarty) >= 2;";
    req.db.all(sql, [card] , function (err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.render('search', { users: rows, selectedOption: card });
      }
    });
  });

router.get('/offer',loginMiddleware , function (req, res) {
  var username = req.query.username;
  var card = req.query.card;
  let sql = "SELECT IDKarty, COUNT(IDKarty) as count FROM Kolekcja WHERE Login = ( SELECT Login FROM Uzytkownicy WHERE Email = ? ) GROUP BY IDKarty";
  req.db.all(sql , [req.session.user.mail] , function (err, rows) {
    if (err) {
      console.error(err.message);
    }
    else {
      res.render('offer' , {options: rows , username: username , card: card})
    }
  })
});

router.post('/', function(req, res) {
  var username2 = req.body.username;
  var card2 = req.body.card;
  var card = req.body.selectedOption;
  let sql = "INSERT INTO Wymiany (Login1, IDKarty1, Login2, IDKarty2, Status) VALUES ((SELECT Login FROM Uzytkownicy WHERE Email = ?), ?, ?, ?, 'Pending')";
  req.db.run(sql, [req.session.user.mail, card , username2 , card2], function(err) {
    if (err) {
      console.error(err.message);
      return;
    }
    res.redirect('/exchange');
  });
});


module.exports = router