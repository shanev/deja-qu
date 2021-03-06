const redis = require('redis');
const Message = require('./src/message');
const Queue = require('./src/queue');
const ExpirationObserver = require('./src/expiration-observer');

class DejaQu {
  /**
   * Initializes a DejaQu object.
   * Optionally takes in a Redis config (https://github.com/NodeRedis/node_redis#rediscreateclient).
   * Optionally takes in a namespace.
   */
  constructor(config = null, namespace = 'dejaqu') {
    this.redisClient = (config != null) ? redis.createClient(config) : redis.createClient();
    this.redisClient.client('SETNAME', namespace);
    this.namespace = namespace;
    this.expirationObserver = new ExpirationObserver(config);
  }

  // kick off the expiration subscription observer
  start() {
    this.expirationObserver.start();
  }

  stop() {
    this.expirationObserver.stop();
  }

  // get a queue
  getQueue(name, userId) {
    return new Queue(this.redisClient, this.namespace, name, userId);
  }
}

module.exports = { DejaQu, Message };
