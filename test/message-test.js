const assert = require('assert');

const Message = require('../dejaqu.js').Message;

describe('Message model', () => {
  it('should construct a Message', (done) => {
    const msg = new Message('Hello');
    assert(msg);
    done();
  });

  it('should serialize a Message', (done) => {
    const options = { id: 123, userId: 123, refId: 456, expiry: 789 };
    const msg = new Message('Hello', options);
    const result = msg.serialize();
    assert.equal(result, '{"id":123,"body":"Hello","userId":123,"refId":456,"expiry":789}');
    done();
  });

  it('should deserialize a Message', (done) => {
    const msg = Message.deserialize('{"id":123,"body":"Hello","userId":123,"refId":456,"expiry":789}');
    assert(msg);
    assert.equal(msg.id, 123);
    assert.equal(msg.body, 'Hello');
    assert.equal(msg.userId, 123);
    assert.equal(msg.refId, 456);
    assert.equal(msg.expiry, 789);
    done();
  });
});
