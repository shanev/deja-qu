const assert = require('assert');

const ExpirationKey = require('../src/expirationKey.js');

describe('ExpirationKey model', () => {
  const namespace = 'dejaqu';

  it('should construct an ExpirationKey', (done) => {
    const queueName = 'QueueName';
    const userId = 123;
    const messageId = 456;
    const key = new ExpirationKey(namespace, queueName, userId, messageId);
    assert(key);
    done();
  });

  it('should serialize an ExpirationKey', (done) => {
    const queueName = 'timeline';
    const userId = 123;
    const messageId = 456;
    const key = new ExpirationKey(namespace, queueName, userId, messageId);
    const result = key.serialize();
    assert.equal(result, 'dejaqu:expires:user:123:timeline:msg:456');
    done();
  });

  it('should deserialize an ExpirationKey', (done) => {
    const key = ExpirationKey.deserialize('dejaqu:expires:user:123:timeline:msg:456');
    assert(key);
    assert.equal(key.namespace, 'dejaqu');
    assert.equal(key.queueName, 'timeline');
    assert.equal(key.userId, 123);
    assert.equal(key.messageId, 456);
    done();
  });
});
