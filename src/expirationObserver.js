const debug = require('debug')('deja-qu');

const ExpirationKey = require('./expirationKey');

const Queue = require('./queue');

// Subscribes to Redis keyspace events to delete expired messages from queues
class ExpirationObserver {
  constructor(redis) {
    if (redis == null) {
      throw new Error('Redis is required.');
    }

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    this.subscriber.config('SET', 'notify-keyspace-events', 'Ex');
    this.subscriber.on('error', (err) => {
      debug(`Redis client error: ${err}`);
    });
  }

  // start observing expiring keys
  start() {
    this.subscriber.psubscribe('__keyevent@0__:expired');
    this.subscriber.on('pmessage', (pattern, channel, expiredKey) => {
      const key = ExpirationKey.deserialize(expiredKey);
      const queueName = key.queueName;
      const userId = key.userId;
      const q = new Queue(this.publisher, queueName, userId);
      debug(`Handling expired key: ${expiredKey}`);
      q.pop().then((msg) => {
        debug(`Popped ${msg.id} from ${q.key}`);
      });
    });
  }
}

module.exports = ExpirationObserver;
