const assert = require('assert');

const dq = require('../dejaqu.js');

describe('Message model', () => {
  it('should construct a message', (done) => {
    const body = "Hello";
    const msg = new dq.Message(body);
    assert(msg);
    done();
  });

  it('should serialize a Message', (done) => {
    const msg = new dq.Message("Hello", 123, 456, 789);
    const result = msg.serialize();
    assert.equal(result, '{"body":"Hello","userId":123,"refId":456,"expiry":789}');
    done();
  })

  it('should deserialize a Message', (done) => {
    const msg = dq.Message.deserialize('{"body":"Hello","userId":123,"refId":456,"expiry":789}');
    assert(msg);
    assert.equal(msg.body, 'Hello');
    assert.equal(msg.userId, 123);
    assert.equal(msg.refId, 456);
    assert.equal(msg.expiry, 789);
    done();
  });
});
