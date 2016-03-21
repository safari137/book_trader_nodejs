var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    title : String,
    ownerId : mongoose.Schema.Types.ObjectId,
    borrowerId : mongoose.Schema.Types.ObjectId,
    imageUrl: String
});

module.exports = mongoose.model("Book", bookSchema);