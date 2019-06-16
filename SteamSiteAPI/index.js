const site = require('./imports');

const app = site.express();
const express_middleware = require('./lib/express');

express_middleware.load_express_usings(app);

let appServer = app.listen(site.config.site.port, () => {
    console.log('API is listening on port ' + site.config.site.port);
    site.helper.setPrices();
});

site.io(appServer);