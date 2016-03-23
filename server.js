var express     = require('express'),
    app         = express(),
    passport    = require('passport'),
    bodyParser  = require('body-parser'),
    passport    = require('passport'),
    session     = require('express-session'),
    flash       = require('connect-flash'),
    mongoose    = require('mongoose');
    
require('dotenv').config();
require('./config/passport')(passport);
                  
mongoose.connect(process.env.MONGOLAB_URI);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
    
app.use(session({ secret: 'mymadeupsecret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require("./app/routes")(app, passport);

app.set('view engine', 'ejs');

app.listen(process.env.PORT, function() {
    console.log('server running...');
});