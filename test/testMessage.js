const assert = require('assert');

const dq = require('../dejaqu.js');

describe('Message model', () => {
  it('should construct a Message', (done) => {
    const msg = new dq.Message(null, 'Hello');
    assert(msg);
    done();
  });

  it('should serialize a Message', (done) => {
    const msg = new dq.Message(123, 'Hello', 123, 456, 789);
    const result = msg.serialize();
    assert.equal(result, '{"id":123,"body":"Hello","userId":123,"refId":456,"expiry":789}');
    done();
  });

  it('should deserialize a Message', (done) => {
    const msg = dq.Message.deserialize('{"id":123,"body":"Hello","userId":123,"refId":456,"expiry":789}');
    assert(msg);
    assert.equal(msg.id, 123);
    assert.equal(msg.body, 'Hello');
    assert.equal(msg.userId, 123);
    assert.equal(msg.refId, 456);
    assert.equal(msg.expiry, 789);
    done();
  });
});
