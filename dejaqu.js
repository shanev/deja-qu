const debug = require('debug')('deja-qu');

const redis = require('redis');

const Message = require('./src/message');

const Queue = require('./src/queue');

const ExpirationObserver = require('./src/expirationObserver');

class DejaQu {
  /**
   * Initializes a DejaQu object.
   * Optionally takes in a Redis config (https://github.com/NodeRedis/node_redis#rediscreateclient).
   * Optionally takes in a namespace.
   */
  constructor(config = null, namespace = 'dejaqu') {
    this.redisClient = (config != null) ? redis.createClient(config) : redis.createClient();
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
