const debug = require('debug')('deja-qu');
const redis = require('redis');
const ExpirationKey = require('./expiration-key');
const Queue = require('./queue');

// Subscribes to Redis keyspace events to delete expired messages from queues
class ExpirationObserver {
  constructor(config = null) {
    this.publisher = (config != null) ? redis.createClient(config) : redis.createClient();
    this.publisher.client('SETNAME', 'dejaqu-publisher');
    this.subscriber = (config != null) ? redis.createClient(config) : redis.createClient();
    this.subscriber.config('SET', 'notify-keyspace-events', 'Ex');
    this.subscriber.client('SETNAME', 'dejaqu-subscriber');
    this.expiredPattern = '__keyevent@0__:expired';
  }

  // start observing expiring keys
  start() {
    this.subscriber.psubscribe(this.expiredPattern);
    this.subscriber.on('pmessage', (pattern, channel, expiredKey) => {
      const key = ExpirationKey.deserialize(expiredKey);
      const namespace = key.namespace;
      const queueName = key.queueName;
      const userId = key.userId;
      const q = new Queue(this.publisher, namespace, queueName, userId);
      debug(`[ExpirationObserver] Handling expired key: ${expiredKey}`);
      q.pop().then((msg) => {
        debug(`[ExpirationObserver] Popped ${msg.id} from ${q.key}`);
      });
    });
  }

  stop() {
    this.subscriber.punsubscribe(this.expiredPattern);
    this.subscriber.quit();
    this.publisher.quit();
  }
}

module.exports = ExpirationObserver;
