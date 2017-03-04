const debug = require('debug')('dejaqu');

class DejaQu {
  constructor(redis = null, namespace = 'dejaqu') {
    if (redis == null) {
      throw new Error('Initialized without a Redis client.');
    }
    this.redis = redis.createClient();
    this.namespace = namespace;
    this.queues = [];
    this.expirationHanlder = new ExpirationHanlder(redis);
  }

  // kick off the expiration subscription handler
  start() {
    this.expirationHandler.start();
  }

  // create a queue and add to the queue list
  createQueue(name, userId) {
    const q = new Queue(redis, name, userId);
    this.queues.push(q);
  }
}

class Message {
  static deserialize(messageString) {
    return JSON.parse(messageString);
  }

  constructor(body, userId = null, refId = null, expiry = null) {
    if (body == null) {
      throw new Error('A message body is required.');
    }

    if (userId == null) {
      throw new Error('A userId is required.');
    }

    this.body = body;
    this.userId = userId;
    this.refId = refId;
    this.expiry = expiry;
  }

  serialize() {
    JSON.stringify(this);
  }
}

// sets up a FIFO queue
class Queue {
	constructor(redis, name = 'timeline', userId) {
    if (redis == null) {
      throw new Error('Redis is required. Duh.');
    }

    if (userId == null) {
      throw new Error('A userId is required.');
    }
    this.redis = redis;
    this.key = `user:${userId}:${name}`;
  }

	push(message) {
    return new Promise((resolve) => {
      const serializedMessage = message.serialize();
      if (message.expiry == null) {
        // push message to queue and don't publish an expire event
        this.redis.rpush(key, serializedMessage, () => { 
          debug(`Pushed message ${message.id} to ${key}`);
          return resolve();
        });
      } else {
        // push message to queue and publish an expire event
        const expirationKey = new ExpirationKey(name, userId, message).serialize();
        this.redis.multi()
          .rpush(key, serializedMessage)
          .set(expirationKey, null, 'EX', message.expiry)
          .exec(() => {
            debug(`Pushed message ${message.id} to ${key}`);
            return resolve();
          });
      }
    });
  }

  // get messages in a certain range from the top of the list, i.e: 0..5
  // returns a Promise with the messages
	get(start = 0, stop = 5) {
    return new Promise((resolve) => {
      this.redis.lrange(key, start, stop, (err, res) => {
        debug(`Retrieving messages ${start}..${stop} from ${key}`);
        return resolve(res);
      });
    });
  }

  // delete the top message in the queue
  // returns a Promise with the deleted message
	pop() {
    return new Promise((resolve) => {
      this.redis.lpop(key, (err, res) => {
        debug(`Deleted top message in ${key}`);
        return resolve(res);
      });
    });
  }
}

class ExpirationKey {
  static deserialize(expiredKey) {
    const tokens = expiredKey.split(':');
    const userId = token[2];
    const queueName = token[3];
    const messageId = token[4];
    return new ExpirationKey(queueName, userId, messageId);
  }

  constructor(queueName, userId, message) {
    this.queueName = queueName;
    this.userId = userId;
    this.message = message;
  }

  serialize() {
    return `expires:user:${this.userId}:${this.queueName}:${this.message.id}`;
  }
}

// Subscribes to Redis keyspace events to delete expired messages from queues
class ExpirationHandler {
  constructor(redis) {
    this.subscriber = redis.createClient();
    this.subscriber.config('SET', 'notify-keyspace-events', 'Ex');
    this.subscriber.on('error', (err) => {
      debug('Error ' + err);
    });
  }

  start() {
    this.subscriber.psubscribe('__keyevent@0__:expired');
    this.subscriber.on('pmessage', (pattern, channel, expiredKey) => {
      const expirationKey = ExpirationKey.unpack(expiredKey);
      const queueName = expirationKey.queueName;
      // iterate through queues and find the right one
      // q.pop();
    });
  }
}

module.exports = {
  DejaQu,
  Message,
  Queue,
};
