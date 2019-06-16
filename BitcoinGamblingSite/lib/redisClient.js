const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient({db: 2});

redisClient.on('error', function(er) {
    console.trace('REDIS CLIENT ERROR');
    console.error(er);
});

module.exports = redisClient;