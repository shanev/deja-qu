const assert = require('assert');

const DejaQu = require('../dejaqu.js').DejaQu;

describe('DejaQu', () => {
  describe('constructor()', () => {
    it('should create an instance of DejaQu', (done) => {
      const dq = new DejaQu();
      assert(dq);
      assert(dq.redisClient);
      assert.equal(dq.namespace, 'dejaqu');
      assert(dq.expirationObserver);
      done();
    });
  });

  describe('.start()', () => {
    it('should start expiration observer', (done) => {
      const dq = new DejaQu();
      try {
        dq.start();
        assert(true);
        done();
      } catch (err) {
        assert(false);
        done();
      }
    });
  });

  describe('.getQueue()', () => {
    it('should get a queue', (done) => {
      const dq = new DejaQu();
      const q = dq.getQueue('timeline', 1234);
      assert.equal(q.name, 'timeline');
      done();
    });
  });

  describe('.count()', () => {
    it('should get a count of the number of queues', async () => {
      const dq = new DejaQu();
      const count = await dq.count();
      assert.equal(count, 2);
    });
  });
});
