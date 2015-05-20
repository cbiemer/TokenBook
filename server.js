;(function initServer() {
    'use strict';

    var express = require('express');
    var http = require('http');
    var path = require('path');
    var passport = require('passport');
    var bodyParser = require('body-parser');
    var session = require('express-session');

    var https = require('https');
    var fs = require('fs');
    var ejs = require('ejs');

    var TwitterStrategy = require('passport-twitter').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GitHubStrategy = require('passport-github').Strategy;
    var GoogleStrategy =    require('passport-google-oauth').OAuth2Strategy;
    var ForceDotComStrategy = require('passport-forcedotcom').Strategy;

    var Configuration = require('./config');
    var MongoDB = require('./mongodb');
    var out = require('./out');

    var app = express();

    // all environments
    app.set('port', process.env.PORT || Configuration.server.port);
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'views')));

    app.engine('.html', ejs.renderFile);
    app.set('view engine', 'ejs');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(passport.initialize());
    app.use(session({
        secret: 'colanRulez'
    }));

    app.set('trust proxy', 1) // trust first proxy

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new FacebookStrategy({
            clientID: Configuration.facebook.appID,
            clientSecret: Configuration.facebook.appSecret,
            consumerKey: Configuration.facebook.appID,
            consumerSecret: Configuration.facebook.appSecret,
            callbackURL: Configuration.facebook.callBack
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                out.printDev(profile);
                return done(null, profile);
            });
        }
    ));

    app.get(Configuration.facebook.express.auth, passport.authenticate(Configuration.facebook.name));

    app.get(Configuration.facebook.express.callBack, 
        passport.authenticate(Configuration.facebook.name, { 
        	successRedirect: Configuration.server.states.success,
            failureRedirect: Configuration.server.states.error
        })
    );

    app.get(Configuration.server.states.success, function(req, res){
        res.send(Configuration.server.res.success);
    });

    app.get(Configuration.server.states.error, function(req, res){
        res.send(Configuration.server.res.error);
    });

    app.get(Configuration.server.states.general, function(req, res){
        res.render(Configuration.server.views.auth);
    });

    //GOOGLE
    passport.use(new GoogleStrategy({
        clientID: Configuration.google.appID,
        clientSecret: Configuration.google.appSecret,
        callbackURL: Configuration.google.callBack,
        scope: Configuration.google.scope
        },
         function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                out.printDev(profile);
                return done(null, profile);
            });
        }
    ));


    // Redirect the user to Google for authentication.    When complete, Google
    // will redirect the user back to the application at
    //         /auth/google/return
    app.get(Configuration.google.express.auth, passport.authenticate(Configuration.google.name));

    // Google will redirect the user to this URL after authentication.    Finish
    // the process by verifying the assertion.    If valid, the user will be
    // logged in.    Otherwise, authentication has failed.
    app.get(Configuration.google.express.callBack, 
        passport.authenticate(Configuration.google.name, { 
        	successRedirect: Configuration.server.states.success,
            failureRedirect: Configuration.server.states.error 
        })
    );

    //GITHUB
    passport.use(new GitHubStrategy({
            clientID: Configuration.github.appID,
            clientSecret: Configuration.github.appSecret,
            callbackURL: Configuration.github.callBack
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                out.printDev(profile);
                return done(null, profile);
            });
        }
    ));


    // Use the TwitterStrategy within Passport.
    //     Strategies in passport require a `verify` function, which accept
    //     credentials (in this case, a token, tokenSecret, and Twitter profile), and
    //     invoke a callback with a user object.
    passport.use(new TwitterStrategy({
            clientID: Configuration.twitter.appID,
            clientSecret: Configuration.twitter.appSecret,
            consumerKey: Configuration.twitter.appID,
            consumerSecret: Configuration.twitter.appSecret,
            callbackURL: Configuration.twitter.callBack
        },
        function(token, tokenSecret, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                out.printDev(profile);
                // To keep the example simple, the user's Twitter profile is returned to
                // represent the logged-in user.    In a typical application, you would want
                // to associate the Twitter account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));
    // GET /auth/twitter
    //     Use passport.authenticate() as route middleware to authenticate the
    //     request.    The first step in Twitter authentication will involve redirecting
    //     the user to twitter.com.    After authorization, the Twitter will redirect
    //     the user back to this application at /auth/twitter/callback
    app.get(Configuration.twitter.express.auth,
        passport.authenticate(Configuration.twitter.name),
        function(req, res){
            // The request will be redirected to Twitter for authentication, so this
            // function will not be called.
        });

    // GET /auth/twitter/callback
    //     Use passport.authenticate() as route middleware to authenticate the
    //     request.    If authentication fails, the user will be redirected back to the
    //     login page.    Otherwise, the primary route function function will be called,
    //     which, in this example, will redirect the user to the home page.
    app.get(Configuration.twitter.express.callBack,
        passport.authenticate(Configuration.twitter.name, {
            successRedirect: Configuration.server.states.success,
            failureRedirect: Configuration.server.states.error
        })
    );

    app.get(Configuration.github.express.auth, passport.authenticate(Configuration.github.name));

    app.get(Configuration.github.express.callBack, 
        passport.authenticate(Configuration.github.name, {
            successRedirect: Configuration.server.states.success,
            failureRedirect: Configuration.server.states.error
        })
    );

    passport.use(new ForceDotComStrategy({
            clientID: Configuration.forcedotcom.appID,
            clientSecret: Configuration.forcedotcom.appSecret,
            scope: Configuration.forcedotcom.scope,
            callbackURL: Configuration.forcedotcom.callBack
        }, function verify(token, refreshToken, profile, done) {
            out.printDev(profile);
            return done(null, profile);
    	}
    ));

    app.get(Configuration.forcedotcom.express.auth, passport.authenticate(Configuration.forcedotcom.name));
    // this should match the callbackURL parameter above: 
    app.get(Configuration.forcedotcom.express.callBack,
        passport.authenticate(Configuration.forcedotcom.name, { 
        	successRedirect: Configuration.server.states.success, 
        	failureRedirect: Configuration.server.states.error
        }),
        function(req, res){
        //    res.render("index",checkSession(req));
        }
    );

    var sslOptions = {
        key: fs.readFileSync(Configuration.server.ssl.key),
        csr: fs.readFileSync(Configuration.server.ssl.csr),
        ca: fs.readFileSync(Configuration.server.ssl.csr),
        requestCert: Configuration.server.ssl.requestCert,
        rejectUnauthorized: Configuration.server.ssl.rejectUnauthorized
    };

    http.createServer(app).listen(app.get('port'), function() {
        out.print('Express server listening on port ', app.get('port'));
    });
    var secureServer = https.createServer(sslOptions, app).listen(Configuration.server.ssl.port, function() {
        out.print('Secure Express server listening on port', Configuration.server.ssl.port);
    });
}());