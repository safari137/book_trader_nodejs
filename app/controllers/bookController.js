var Book        = require('../models/book'),
    User        = require('../models/user'),
    mongoose    = require('mongoose');

var bookController = function() {
    this.getBooks = function(req, res) {
        Book.find({}, function(err, books) {
            if (err) throw err;
            
            var id = (req.user) ? req.user._id : null;
            
            res.render('index', { books : books, userId : id,  isAuthenticated : req.isAuthenticated() });
        });
    }
    
    this.addBook = function(req, res) {
        Book.create(req.body.book, function(err, newBook) {
            if (err) throw err;
            
            res.redirect("/");
        });
    }
    
    this.request = function(req, res) {
        var bookId = req.params.bookId;
        if (bookId[0] === ' ') {
            bookId = bookId.substring(1);
        }
        
        createRequest(bookId, req.user);
    }
    
    var createRequest = function(bookId, fromUser) {
        Book.findById(bookId, function(err, book) {
           if (err) throw err;
           
           User.findById(book.ownerId, function(err, user) {
              if (err) throw err;
              
              var bookObj = { book : book, requesterId : fromUser._id };
              
              user.requestsReceived.push(bookObj);
              user.save();
                 
              bookObj = { book : book, ownerId : user._id }     
              fromUser.requestsSent.push(bookObj);
              fromUser.save();
           });
        });
    } 
    
    this.makeTrade = function(req, res) {
        var book1 = req.query.book1,
            book2 = req.query.book2;
            
        Book.findById(book1, function(err, foundBook1) {
           if (err) throw err;
           
           Book.findById(book2, function(err, foundBook2) {
               if (err) throw err;
               
              removeRequests(foundBook1.ownerId, book2, book1);
              removeRequests(foundBook2.ownerId, book1, book2);
              foundBook1.borrowerId = foundBook2.ownerId;
              foundBook2.borrowerId = foundBook1.ownerId;
              foundBook1.save();
              foundBook2.save();
           });
        });
        res.end();
    }
    var removeRequests = function(userId, sentBookId, receivedBookId) {
          User.findByIdAndUpdate(userId, { '$pull': {  requestsSent: { book: sentBookId }}}, function(err, data) {
                  if (err) throw err;
                  
                  data.save();
          });
          
          User.findByIdAndUpdate(userId, { '$pull': {  requestsReceived: { book: receivedBookId }}}, function(err, data) {
                  if (err) throw err;
                  
                  data.save();
          });
    }
}

module.exports = bookController;