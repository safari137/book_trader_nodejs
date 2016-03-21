var express         = require('express'),
    User            = require('./models/user'),
    userController  = require('./controllers/userController'),
    bookController  = require('./controllers/bookController');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}
    
function routes(app, passport) {
    userController = new userController(passport),
    bookController = new bookController();
    
    app.route("/") 
        .get(bookController.getBooks)
        .post(bookController.addBook);
    
    app.route("/profile")
        .get(userController.showProfile);
        
    app.route("/user/:userId/books")
        .get(userController.showBooks);
        
    app.route("/newbook")
        .get(function(req, res) {
           res.render('newbook', { isAuthenticated: req.isAuthenticated }); 
        });
    
    app.route("/login")
        .get(userController.startLogin)
        .post(userController.login);
        
    app.route("/signup")
        .get(userController.startSignup)
        .post(userController.signup);
        
    app.route("/api/request/:bookId") 
        .get(bookController.request);
        
    app.route("/api/trade/")
        .get(bookController.makeTrade);
}

module.exports = routes;