var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    city : String,
    state : String,
    ownedBooks : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }
    ],
    borrowedBooks : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }
    ],
    requestsSent : [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        },
        ownerId :  mongoose.Schema.Types.ObjectId
    }],
    requestsReceived : [ {
        book : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        },
        requesterId :  mongoose.Schema.Types.ObjectId
    }]
});

module.exports = mongoose.model("User", userSchema);