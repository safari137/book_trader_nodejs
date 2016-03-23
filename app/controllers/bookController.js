var Book        = require('../models/book'),
    User        = require('../models/user'),
    mongoose    = require('mongoose'),
    books       = require('google-books-search');

var bookController = function() {
    this.getBooks = function(req, res) {
        Book.find({}, function(err, books) {
            if (err) throw err;
            
            var id = (req.user) ? req.user._id : null;
            
            res.render('index', { books : books, userId : id,  isAuthenticated : req.isAuthenticated() });
        });
    }
    
    this.addBook = function(req, res) {
        req.body.book.ownerId = req.user._id;
        
        getBookInfo(req.body.book.title, function(err, results) {
           if (err) throw err;
           
           req.body.book.imageUrl = results[0].thumbnail;
           Book.create(req.body.book, function(err, newBook) {
                if (err) throw err;
                
                req.user.ownedBooks.push(newBook);
                req.user.save();
                res.redirect("/profile");
            });
        });
    }
    
    var getBookInfo = function(title, callback) {
        books.search(title, function(error, results) {
            if (error) {
                console.log(error);
                callback(error, null);
            }
            callback(null, results)        
        });
    }
    
    this.cancelRequest = function(req, res) {
        var bookId = req.params.bookId;
        
        removeBookRequests(bookId);
        
        res.end();
    }
    
    var removeBookRequests = function(bookId) {
        User.find({}, function(err, users) {
            if (err) throw err;
            
            users.forEach(function(user) {
                user.requestsReceived = user.requestsReceived.filter(function(value) {
                    return (value.book.toString() !== bookId.toString()) 
                });
                user.requestsSent = user.requestsSent.filter(function(value) {
                    return (value.book.toString() !== bookId.toString()) 
                });
                user.save();
            }); 
        });
    }
    
    this.removeBook= function(req, res) {
        Book.remove({_id : req.body._id}, function(err) {
            if (err) throw err;
            removeBookRequests(req.body._id);
            res.end();
        });
    }
    
    this.request = function(req, res) {
        var bookId = req.params.bookId;
        if (bookId[0] === ' ') {
            bookId = bookId.substring(1);
        }
        
        if (!hasBeenRequested(req.user, bookId))
            createRequest(bookId, req.user);
        res.redirect('/profile');
    }
    
    var hasBeenRequested = function(user, bookId) {
        var requests = user.requestsSent.filter(function(value) {
            return (value.book.toString() === bookId.toString());
        });
        
        var alreadyRequested = (requests.length > 0);
        
        return alreadyRequested;
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
        var bookReceived = req.query.bookReceived,
            bookGiven = req.query.bookGiven;
        
        if (!tradeIsAllowed(req.user, bookGiven, bookReceived)) {
            res.redirect('/profile');
            return;
        }
            
        Book.findById(bookReceived, function(err, foundBook1) {
           if (err) throw err;
           
           Book.findById(bookGiven, function(err, foundBook2) {
               if (err) throw err;
               
              updateBorrowedBooks(req.user, foundBook1, foundBook1.ownerId, foundBook2);
               
              removeRequests(foundBook1.ownerId, bookGiven, bookReceived);
              
              var temp = bookReceived;
              bookReceived = bookGiven;
              bookGiven = temp;
              
              removeRequests(foundBook2.ownerId, bookGiven, bookReceived);
              
              foundBook1.borrowerId = foundBook2.ownerId;
              foundBook2.borrowerId = foundBook1.ownerId;
              
              foundBook1.save();
              foundBook2.save();
           });
        });
        res.redirect('/profile');
    }
    
    
    var updateBorrowedBooks = function(user1Obj, book1Obj, user2Id, book2Obj) {
        user1Obj.borrowedBooks.push(book1Obj);
        user1Obj.save();
        
        User.findById(user2Id, function(err, user) {
                  if (err) throw err;
                  
                  user.borrowedBooks.push(book2Obj);
                  user.save();
        });
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
    
    var tradeIsAllowed = function(user, bookToGive, bookToGet) {
        var receivedPass = false,
            sentPass     = false;
            
        if (!user)
            return false;
            
        for(var i = 0; i<user.requestsReceived.length; i++) {
            if (user.requestsReceived[i].book.toString() === bookToGive.toString()) {
                receivedPass = true;
                break;
            }
        }
        
        if (!receivedPass) return false;
        
        for (i = 0; i<user.requestsSent.length; i++) {
            if (user.requestsSent[i].book.toString() === bookToGet.toString()) {
                sentPass = true;
                break;
            }
        }
        
        return sentPass;
    }
    
    this.returnTradedBook = function(req, res) {
        var bookId = req.params.bookId;
        
        removeBorrowedBookFromUser(req.user, bookId);
        
        removeBorrowerIdFromBook(bookId);
    }
    
    var removeBorrowerIdFromBook = function(bookId) {
        Book.findById(bookId, function(err, book) {
           if (err) throw err;
           
           book.borrowerId = undefined;
           book.save();
        });
    }
    
    var removeBorrowedBookFromUser = function(user, bookId) {
        user.borrowedBooks = user.borrowedBooks.filter(function(value) {
            return (value.toString() !== bookId.toString());
        });
        
        user.save();
    }
}

module.exports = bookController;