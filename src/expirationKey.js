/**
 * Model for the key used to identify a Message expiration
 */
class ExpirationKey {

  // deserialize() a Redis string into an ExpirationKey object
  static deserialize(expiredKey) {
    const tokens = expiredKey.split(':');
    const namespace = tokens[0];
    const userId = tokens[3];
    const queueName = tokens[4];
    const messageId = tokens[6];
    return new ExpirationKey(namespace, queueName, userId, messageId);
  }

  // construct an ExpirationKey object
  constructor(namespace, queueName, userId, messageId) {
    this.namespace = namespace;
    this.queueName = queueName;
    this.userId = userId;
    this.messageId = messageId;
  }

  // serialize() as a string for storage in Redis
  serialize() {
    return `${this.namespace}:expires:user:${this.userId}:${this.queueName}:msg:${this.messageId}`;
  }
}

module.exports = ExpirationKey;
