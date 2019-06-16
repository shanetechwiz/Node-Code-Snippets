const site = require('../imports');

module.exports.load_express_usings = (app) => {

	app.use(site.body_parser.urlencoded({ extended: false }));
	app.use(site.body_parser.json());
	app.use(site.cors());

	site.passport.middleware(app);

	const sessionMiddleware = site.session({
	    secret: site.config.site.session_secret,
	    name: site.config.site.session_name,
	    resave: true,
	    saveUninitialized: true,
	    cookie: { maxAge: site.config.site.cookie_max_age }
	});

	app.use(sessionMiddleware);

	app.use((req, res, next) => {
	    if(req.headers['cf-connecting-ip'] && req.headers['cf-connecting-ip'].split(', ').length) {
	        let first = req.headers['cf-connecting-ip'].split(', ');
	        req.user_ip = first[0];
	    } else {
	        req.user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	    }

	    next();
	});

	app.use('/', site.routes.main(site.passport));
	//app.use('/', site.routes.);
}