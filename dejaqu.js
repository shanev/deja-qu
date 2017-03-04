const debug = require('debug')('dejaqu');

class DejaQu {
  constructor(redis = null, namespace = 'dejaqu') {
    if (redis == null) {
      throw new Error('Initialized without a Redis client.');
    }
    this.redis = redis;
    this.namespace = namespace;
    this.queues = [];
  }

  createQueue(name, userId) {
    const q = new Queue(redis, name, userId);
    queues.push[q];
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

class Queue {
	constructor(redis, name = 'timeline', userId) {
    if (redis == null) {
      throw new Error('Redis is required. Duh.');
    }

    if (userId == null) {
      throw new Error('A userId is required.');
    }
    this.key = `user:${userId}:${name}`;
  }

	push(message) {
    return new Promise((resolve) => {
      const serializedMessage = message.serialize();
      if (message.expiry == null) {
        redis.rpush(`${key}`, serializedMessage, () => { 
          debug(`Pushed message ${message.id} to ${key}`);
          return resolve();
        });
      } else {
        redis.multi()
          .rpush(`${key}`, serializedMessage)
          .set(`expires:user:${message.userId}:msg:${message.id}`, null, 'EX', message.expiry)
          .exec(() => {
            debug(`Pushed message ${message.id} to ${key}`);
            return resolve();
          });
      }
    });
  }

	get() {}

	pop() {}
}

class ExpirationService {
	subscribe() {}
	expire(message) {}
}

module.exports = {
  DejaQu,
  Message,
  Queue,
};
