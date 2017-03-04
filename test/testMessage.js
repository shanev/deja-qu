const assert = require('assert');

const dq = require('../dejaqu.js');

describe('Message model', () => {
  it('should construct a message', (done) => {
    const body = "Hello";
    const msg = new Message(body);
    assert(msg);
    done();
  });
});
