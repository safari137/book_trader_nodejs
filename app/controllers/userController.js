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
    
    this.settings = function(req, res) {
        var user = { city : req.user.city, state : req.user.state };
        
        res.render("user/updateProfile", {isAuthenticated : req.isAuthenticated(), user : user, message: req.flash('message') });
    }
    
    this.updateSettings = function(req, res) {
        if (req.body.user.hasOwnProperty('oldPassword')) {
            if (req.body.user.oldPassword === req.user.password && req.body.user.newPassword.length >= 3) {
                req.user.password = req.body.user.newPassword;
                req.user.save();
            } else {
                req.flash('message', "Either you're old password is incorrect or your new password is less than 3 characters.")
                res.redirect('/user/settings');
                return;
            }
        } else {
            req.user.city = req.body.user.city;
            req.user.state = req.body.user.state;
            req.user.save();
        }
        res.redirect('/profile');
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
            .populate('borrowedBooks')
            .exec(function(err, user) {
                
               if (err) throw err;
               
               var trades = getTradesThatAreReady(user);
               
               res.render('user/profile', {isAuthenticated : req.isAuthenticated(), books :books, requestedBooks : user.requestsSent, requestsReceived : user.requestsReceived, 
                    trades : trades, borrowedBooks: user.borrowedBooks });
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
                        bookReceived : user.requestsSent[i].book,
                        usersBook : user.requestsReceived[k].book
                    }; 
                    trades.push(trade);
                }
            }
        }
        return trades;
    }
}

module.exports = userController;