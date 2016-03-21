var mongoose    = require('mongoose'),
    User        = require("../models/user"),
    Book        = require("../models/book");

var userController = function(passport) {
    
    this.startLogin = function(req, res) {
        res.render("user/login", { isAuthenticated : req.isAuthenticated(), message: req.flash('loginMessage')} );
    }
    
    this.login = passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login'
    });
    
    this.startSignup = function(req, res) {
        res.render("user/signup", { isAuthenticated : req.isAuthenticated(), message: req.flash('signupMessage') });
    }
    
    this.signup = passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup'
    });
    
    this.logout = function(req, res) {
        req.logout();
        res.redirect("/");
    }
    
    this.showProfile = function(req, res) {
        Book.find({ownerId : req.user._id}, function(err, books) {
           if (err) throw err;
           
           User.findById(req.user._id)
            .populate({
                path: 'requestsSent',
                populate: {
                    path: 'book',
                    model: 'Book'
                }
            })
            .populate({
                path: 'requestsReceived',
                populate: {
                    path: 'book',
                    model: 'Book'
                }
            })
            .exec(function(err, user) {
                
               if (err) throw err;
               
               var trades = getTradesThatAreReady(user);
               
               res.render('user/profile', {isAuthenticated : req.isAuthenticated(), books :books, requestedBooks : user.requestsSent, requestsReceived : user.requestsReceived, trades : trades });
           });
        });
    }
    
    this.showBooks = function(req, res) {
        User.findById(req.params.userId)
            .populate('ownedBooks')
            .exec(function(err, user) {
                if (err) throw err;
                
                res.render('user/userbooks', { isAuthenticated : req.isAuthenticated(), books : user.ownedBooks }); 
            });
    }
    
    var getTradesThatAreReady = function(user) {
        var trades = [];
        
        for (var i = 0; i<user.requestsSent.length; i++) {
            for (var k = 0; k<user.requestsReceived.length; k++) {
                if (user.requestsSent[i].ownerId.toString() === user.requestsReceived[k].requesterId.toString()) {
                    var trade = {
                        usersBook : user.requestsSent[i].book,
                        bookReceived : user.requestsReceived[k].book
                    };
                    trades.push(trade);
                }
            }
        }
        return trades;
    }
}

module.exports = userController;