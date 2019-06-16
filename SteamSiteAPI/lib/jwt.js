const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
	// Generates a JWT to use as an authentication cookie
	generateJWT: (data) => {
	    let token = jwt.sign(data, config.jwt.secret, {
	        expiresIn: "5d",
	        issuer: 'site'
	    });

	    return token;
	},

	validateSession: (req, res, next) => {
		let token = req.body.token;
	    jwt.verify(token, config.jwt.secret, {issuer: 'site'}, (err, data) => {
	        if(err) {
	            res.clearCookie('sitesession');
	            return res.redirect('/login');
	        } else {
	            req.apedata = data;
	            next();
	        }
	  });
	},

	ensureSessionData: (req, res, next) => {
	    jwt.verify(req.cookies.sitesession, config.jwt.secret, {issuer: 'site'}, (err, data) => {
	        if(err) {
	            res.clearCookie('sitesession');// clear their cookie if it may be invalid
	        } else {
	            req.apedata = data;
	            return next();
	        }

	        return next();
	    });
	}
}