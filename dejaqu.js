const debug = require('debug')('deja-qu');

const redis = require('redis');

const Message = require('./src/message');

const Queue = require('./src/queue');

const ExpirationObserver = require('./src/expirationObserver');

class DejaQu {
  constructor(namespace = 'dejaqu') {
    this.redisClient = redis.createClient();
    this.redisClient.on('error', (err) => {
      debug(err);
    });
    this.namespace = namespace;
    this.expirationObserver = new ExpirationObserver(redis, this.redisClient);
  }

  // kick off the expiration subscription observer
  start() {
    this.expirationObserver.start();
  }

  // create a queue and add to the queue list
  createQueue(name, userId) {
    return new Queue(this.redisClient, name, userId);
  }
}

module.exports = {
  DejaQu,
  Message,
  Queue,
};
