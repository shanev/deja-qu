const debug = require('debug')('deja-qu');

const Message = require('./src/message');

const Queue = require('./src/queue');

const ExpirationKey = require('./src/expirationKey');

// Subscribes to Redis keyspace events to delete expired messages from queues
class ExpirationObserver {
  constructor(redis) {
    this.subscriber = redis.createClient();
    this.subscriber.config('SET', 'notify-keyspace-events', 'Ex');
    this.subscriber.on('error', (err) => {
      debug(`Error: ${err}`);
    });
  }

  start() {
    this.subscriber.psubscribe('__keyevent@0__:expired');
    this.subscriber.on('pmessage', (pattern, channel, expiredKey) => {
      const key = ExpirationKey.deserialize(expiredKey);
      const queueName = key.queueName;
      // TODO: iterate through queues and find the right one
      // q.pop();
    });
  }
}

class DejaQu {
  constructor(redis = null, namespace = 'dejaqu') {
    if (redis == null) {
      throw new Error('Initialized without a Redis client.');
    }
    this.redis = redis.createClient();
    this.namespace = namespace;
    this.queues = [];
    this.expirationObserver = new ExpirationObserver(redis);
  }

  // kick off the expiration subscription handler
  start() {
    this.expirationObserver.start();
  }

  // create a queue and add to the queue list
  createQueue(name, userId) {
    const q = new Queue(name, userId);
    this.queues.push(q);
  }
}

module.exports = {
  DejaQu,
  Message,
  Queue,
};
