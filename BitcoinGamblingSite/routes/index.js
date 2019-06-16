const express = require('express');
const Router = new express.Router();
const config = require('../config');
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});
const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.socketAuthSecret);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/401');
}

function setSocketAuthToken(req, res, next) {
    if(req.isAuthenticated()) {
        req.user.socketAuthToken = cryptr.encrypt(req.user.email);
    }
    next();
}

Router.get('/', csrfProtection, setSocketAuthToken, async (req, res) => {
    res.render('', {
        title: '',
        user: req.user,
        id: '',
        csrfToken: req.csrfToken()
    });
});

Router.post('/play', ensureAuthenticated, controller.play);

Router.get('/bets', async (req, res) => {
    try {
        let response = await controller.getBets();
        return res.json(response);
    }
    catch(ex) {
        console.error('An error occurred while retrieving bets', ex);
        return res.json({ success: false, message: '' });
    }
});

Router.get('/history', async (req, res) => {
    try {
        let response = await controller.getBetHistory();
        return res.json(response);
    }
    catch(ex) {
        console.error('An error occurred while retrieving bet history', ex);
        return res.json({ success: false, message: '' });
    }
});

module.exports = Router;