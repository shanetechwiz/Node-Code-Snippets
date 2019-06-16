const request = require('request');
const config = require('../config.js');
const then_redis = require('then-redis');

module.exports = {
    connection: then_redis.createClient(config.redis),
    subscriber: then_redis.createClient(config.redis),
    init: () => {
        this.subscriber.subscribe('site-');
        
        this.subscriber.on('message',  (channel, message) => {
            let json = JSON.parse(message);

            if(channel == 'site-') {
                if(json.source == 'api') {
                    return;
                }
            }
        });
    },
    publish: (channel, data) => {
        if(!data.source) {
            data.source = 'api';
        }

        this.connection.publish(channel, JSON.stringify(data));
    }
}