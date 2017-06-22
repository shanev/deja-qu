const debug = require('debug')('deja-qu');

const ExpirationKey = require('./expiration-key');

const Message = require('./message');

/**
 * Queue model that wraps the Redis list data structure. It's responsible for enqueing
 * messages and setting the expiration key.
 */
class Queue {
  // creates a FIFO queue
  constructor(redisClient, namespace, name = 'timeline', userId) {
    if (redisClient == null) {
      throw new Error('A Redis client is required.');
    }

    if (userId == null) {
      throw new Error('A userId is required.');
    }
    this.redisClient = redisClient;
    this.namespace = namespace;
    this.name = name;
    this.userId = userId;
    this.key = `${namespace}:user:${userId}:${name}`;
  }

  /**
   * push() pushes a new Message to the queue.
   * Returns a Promise resolved to the queue count.
   */
  push(message) {
    return new Promise((resolve, reject) => {
      const serializedMessage = message.serialize();
      if (message.expiry == null) {
        // push message to queue and don't publish an expire event
        this.redisClient.rpush(this.key, serializedMessage, (err, count) => {
          if (err) { return reject(err); }
          debug(`[Queue] Pushed message ${message.id} to ${this.key}`);
          return resolve(count[0]);
        });
      } else {
        // push message to queue and publish an expire event
        const expirationKey = new ExpirationKey(this.namespace, this.name, this.userId, message.id).serialize();
        this.redisClient.multi()
          .rpush(this.key, serializedMessage)
          .set(expirationKey, message.id, 'EX', message.expiry)
          .exec((err, count) => {
            if (err) { return reject(err); }
            debug(`[Queue] Pushed message ${message.id} to ${this.key}`);
            return resolve(count[0]);
          });
      }
    });
  }

  /**
   * get() messages in a certain range from the top of the list, i.e: 0..4.
   * Returns a Promise with the messages.
   */
  get(start = 0, stop = 4) {
    return new Promise((resolve, reject) => {
      this.redisClient.lrange(this.key, start, stop, (err, res) => {
        if (err) { return reject(err); }
        debug(`[Queue] Retrieving messages ${start}..${stop} from ${this.key}`);
        const result = res.map(msg => Message.deserialize(msg));
        return resolve(result);
      });
    });
  }

  /**
   * pop() deletes the first message in the queue.
   * Returns a Promise with the deleted message.
   */
  pop() {
    return new Promise((resolve, reject) => {
      this.redisClient.lpop(this.key, (err, res) => {
        if (err) { return reject(err); }
        debug(`[Queue] Popped first message from ${this.key}`);
        return resolve(Message.deserialize(res));
      });
    });
  }

  /**
   * delete(message) deletes the message from the queue.
   * Returns a Promise with num of deleted elements
   */
  delete(message) {
    return new Promise((resolve, reject) => {
      const msg = message.serialize();
      this.redisClient.lrem(this.key, -1, msg, (err, res) => {
        if (err) { return reject(err); }
        debug(`[Queue] Deleted message ${message.id} from ${this.key}`);
        return resolve(res);
      });
    });
  }

  /**
   * count() returns the length of the queue
   */
  count() {
    return new Promise((resolve, reject) => {
      this.redisClient.llen(this.key, (err, count) => {
        if (err) { return reject(err); }
        return resolve(count);
      });
    });
  }
}

module.exports = Queue;
