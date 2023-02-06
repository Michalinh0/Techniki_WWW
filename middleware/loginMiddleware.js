const loginMiddleware = (req, res, next) => {
    console.log(req.session.user)
    if (!req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = loginMiddleware;