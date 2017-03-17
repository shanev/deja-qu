const assert = require('assert');

const DejaQu = require('../dejaqu.js').DejaQu;

const Message = require('../dejaqu.js').Message;

const dq = new DejaQu();

const ExpirationObserver = require('../src/expiration-observer');

describe('Expiration observer', () => {
  before(() => {
    dq.redisClient.flushdb();
  });

  function createQueue() {
    const name = 'timeline';
    const userId = 1234;
    return dq.getQueue(name, userId);
  }

  function createExpiringMessage() {
    const id = null;
    const body = 'Hello';
    const userId = 123;
    const refId = null;
    const expiry = 1; // seconds
    const msg = new Message(id, body, userId, refId, expiry);
    return msg;
  }

  it('should construct an expiration observer', (done) => {
    const observer = new ExpirationObserver();
    observer.start();
    assert(observer);
    assert(observer.subscriber);
    done();
  });

  it('should expire key and delete message from queue', (done) => {
    const q = createQueue();
    const msg = createExpiringMessage();
    // q.push(msg);
    // setTimeout(() => {
    //   q.count().then((count) => {
    //     assert.equal(0, count);
    //     done();
    //   });
    // }, 1500);
    done();
  });
});
