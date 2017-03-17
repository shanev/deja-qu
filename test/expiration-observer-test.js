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
    const body = 'Hello';
    const userId = 123;
    const refId = null;
    const expiry = 1; // seconds
    const msg = new Message(body, { userId, refId, expiry });
    return msg;
  }

  it('should construct(), start(), and end() expiration observer', (done) => {
    const observer = new ExpirationObserver();
    observer.start();
    assert(observer);
    assert(observer.subscriber);
    observer.end();
    done();
  });

  it('should expire key and delete message from queue', (done) => {
    const q = createQueue();
    const msg = createExpiringMessage();
    q.push(msg).then((count) => {
      assert.equal(count, 1);
      setTimeout(() => {
        q.count().then((count2) => {
          assert.equal(0, count2);
          done();
        });
      }, 1500);
    });
  });
});
