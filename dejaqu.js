const debug = require('debug')('dejaqu');

class DejaQu {
  constructor(redis = null, namespace = 'dejaqu') {
    if (redis == null) {
      throw new Error('Initialized without a Redis client.');
    }
    this.redis = redis;
    this.namespace = namespace;
    this.queues = null;
  }

  createQueue(name, userId) {
    this.queue = new Queue(redis, name, userId);
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
        const expireKey = new ExpirationKey(message).key;
        this.redis.multi()
          .rpush(key, serializedMessage)
          .set(expireKey, null, 'EX', message.expiry)
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
  constructor(message) {
    this.key = `expires:user:${message.userId}:msg:${message.id}`;
  }
}

module.exports = {
  DejaQu,
  Message,
  Queue,
};
