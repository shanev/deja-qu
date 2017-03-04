/**
 * Model for the key used to identify a Message expiration
 */
class ExpirationKey {

  // deserialize() a Redis string into an ExpirationKey object
  static deserialize(expiredKey) {
    const tokens = expiredKey.split(':');
    const userId = tokens[2];
    const queueName = tokens[3];
    const messageId = tokens[5];
    return new ExpirationKey(queueName, userId, messageId);
  }

  // construct an ExpirationKey object
  constructor(queueName, userId, messageId) {
    this.queueName = queueName;
    this.userId = userId;
    this.messageId = messageId;
  }

  // serialize() as a string for storage in Redis
  serialize() {
    return `expires:user:${this.userId}:${this.queueName}:msg:${this.messageId}`;
  }
}

module.exports = ExpirationKey;
