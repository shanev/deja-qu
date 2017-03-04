const debug = require('debug')('dejaqu');

class DejaQu {
  constructor(redis = null, namespace = 'dejaqu') {
    if (redis == null) {
      throw new Error('Initialized without a Redis client.');
    }
    this.redis = redis;
    this.namespace = namespace;
  }

  createQueue(name, userId, redis = redis) {

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
    this.user = user;
    this.ref = ref;
    this.expiry = expiry;
  }

  serialize() {
    JSON.stringify(this);
  }
}

class Queue {
	constructor(name = 'timeline', userId) {
    if (userId == null) {
      throw new Error('A userId is required.');
    }
    this.key = `user:${userId}:${name}`;
  }

	push(message) {

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
