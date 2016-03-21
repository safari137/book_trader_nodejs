var LocalStrategy   = require('passport-local').Strategy,
    User            = require('../app/models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // SIGN UP
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err)
                    return done(err);
    
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } 
                User.create({email: email, password: password}, function(err, newuser) {
                    if (err) throw err;
                    
                    newuser.save(function(err) {
                        if (err) throw err;
                        
                        return done(null, newuser);
                    });
                });
            });    
        });
    }));
    
    
    // LOGIN
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) { 
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err) return done(err, null, req.flash('loginMessage', 'Encountered an error'));

            if (!user)
                return done(null, false, req.flash('loginMessage', 'Incorrect Email or Password')); 

            if (user.password !== password)
                return done(null, false, req.flash('loginMessage', 'Incorrect Email or Password')); 
            
            return done(null, user);
        });
    }));
};