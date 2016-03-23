var User = require('./app/models/user'),
    Book = require('./app/models/book');
    
function seedDB() {    
    
    User.remove({}, function(err) {
        if (err) throw err;
        
        console.log('removed all users');
        seedAll();
    });
    
    Book.remove({}, function(err) {
        if (err) throw err;
        
        console.log('removed all books');
        seedAll();
    });
    
    var users = [
            {
                email : 'test',
                password : 'test'
            },
            {
                email : 'user',
                password : 'user'
            },
            {
                email : 'borrow',
                password : 'borrow'
            }
        ];
        
    var book1 = 
            {
                title : 'Clean Code',
                imageUrl : 'http://books.google.com/books/content?id=dwSfGQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'  
            };
            
    var book2 = 
            {
                title: 'The Lion,The Witch And The Wardrobe',
                imageUrl : 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSJ0bCCmHEIw-htm_1djHi4YwZ5X3_vtA9RgjeYTBHuG_NgQ8l8'
            };
            
    var book3 = 
            {
                title : 'Head First Java',
                imageUrl : 'http://books.google.com/books/content?id=uIVJiAPlBq0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
            }
    
    var removed = 0;        
    function seedAll() {
        removed++;
        if (removed != 2)
            return;
        
        console.log('adding users and books');
        
        createUsersAndbooks();
    }
     
    function createUsersAndbooks() {       
        User.create(users[0], function(err, newUser) {
           if (err) throw err;
           
           Book.create(book1, function(err, newBook) {
              if (err) throw err;
              
              newBook.ownerId = newUser._id;
              newUser.ownedBooks.push(newBook);
              newBook.save();
              newUser.save();
              
              User.create(users[2], function(err, newUser2) {
                   if (err) throw err;
                   
                   Book.create(book3, function(err, newBook2) {
                      if (err) throw err;
                      
                      newBook2.ownerId = newUser2._id;
                      newUser2.ownedBooks.push(newBook2);
                      
                      newUser.requestsReceived.push({book: newBook, requesterId: newUser2._id });
                      newUser2.requestsSent.push({book: newBook, ownerId: newUser._id});
                      
                      newUser2.requestsReceived.push({book: newBook2, requesterId: newUser._id});
                      newUser.requestsSent.push({book: newBook2, ownerId: newUser2._id});
                      
                      newBook2.save();
                      newUser2.save();
                      newUser.save();
                   });
                });
           });
        });
    }
}

module.exports = seedDB;
    