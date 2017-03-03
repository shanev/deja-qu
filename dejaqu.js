const debug = require('debug')('dejaqu');

class DejaQu {
  constructor(redis = null, options = {}) {
    if (redis == null) {
      throw new Error('Initialized without a Redis client.');
    }
    this.redis = redis;
    this.namespace = options.namespace || 'dejaqu';
  }
}

class Message {
  constructor(body, userId, refId, expiry) {
  	// validate arguments and throw error if invalid or null
    this.body = body;
    this.user = user;
    this.ref = ref;
    this.expiry = expiry;
  }
}

class Queue {
	constructor() {}

	push(message) {}

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
