const debug = require('debug')('deja-qu');

const redis = require('redis');

const ExpirationKey = require('./expirationKey');

const Queue = require('./queue');

// Subscribes to Redis keyspace events to delete expired messages from queues
class ExpirationObserver {
  constructor(config = null) {
    this.publisher = (config != null) ? redis.createClient(config) : redis.createClient();
    this.subscriber = (config != null) ? redis.createClient(config) : redis.createClient();
    this.subscriber.config('SET', 'notify-keyspace-events', 'Ex');
  }

  // start observing expiring keys
  start() {
    this.subscriber.psubscribe('__keyevent@0__:expired');
    this.subscriber.on('pmessage', (pattern, channel, expiredKey) => {
      const key = ExpirationKey.deserialize(expiredKey);
      const namespace = key.namespace;
      const queueName = key.queueName;
      const userId = key.userId;
      const q = new Queue(this.publisher, namespace, queueName, userId);
      debug(`Handling expired key: ${expiredKey}`);
      q.pop().then((msg) => {
        debug(`Popped ${msg.id} from ${q.key}`);
      });
    });
  }
}

module.exports = ExpirationObserver;
