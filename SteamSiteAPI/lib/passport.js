const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const jwt = require('./jwt');
const config = require('../config');
const ENUMS = require('./enums');
const db = require('./mongo');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new SteamStrategy(
    {
        returnURL: config.site.api_host + '/auth/steam/return',
        realm: config.site.api_host,
        apiKey: config.site.steam_api_key
    },
    (identifier, profile, done) => {
        profile.identifier = identifier;
        return done(null, profile);
    }
));

module.exports.middleware = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports.routes = (router) => {
    router.get('/login', passport.authenticate('steam'), (req, res)  =>{ 
        
    });

    router.get('/logout', (req, res, next) => {
        req.logout();
        res.cookie('sitesession', null, {maxAge: -1, domain: '.site.com', httpOnly: true});
        res.clearCookie('sitesession');
        return res.redirect(config.site.main_host);
    });

    router.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/login' }), (req, res) => {
        let sess = req.session.passport.user._json;        

        let cookieValue = jwt.generateJWT(sess);
        res.cookie('sitesession', cookieValue, { maxAge: 1000 * 60 * 60 * 24 * 5, domain: '.site.com', httpOnly: true });

    });
};