const assert = require('assert');
const DejaQu = require('../dejaqu.js').DejaQu;
const Message = require('../dejaqu.js').Message;

describe('Queue model', () => {
  before(() => {
    new DejaQu().redisClient.flushdb();
  });

  function createQueue() {
    const name = 'timeline';
    const userId = 1234;
    const q = new DejaQu().getQueue(name, userId);
    return q;
  }

  function createMessage() {
    const msg = new Message('Hello');
    return msg;
  }

  function createExpiringMessage() {
    const body = 'Hello';
    const userId = 123;
    const refId = null;
    const expiry = 5; // seconds
    const msg = new Message(body, { userId, refId, expiry });
    return msg;
  }

  it('should construct a queue', (done) => {
    assert(createQueue());
    done();
  });

  describe('.push()', () => {
    it('should push a Message to a queue', (done) => {
      const q = createQueue();
      const msg = createMessage();
      // keep track of first message id for pop() test
      this.messageId = msg.id;
      q.push(msg)
        .then((count) => {
          assert.notEqual(count, 0);
          done();
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it('should push an expiring Message to a queue', (done) => {
      const q = createQueue();
      const msg = createExpiringMessage();
      q.push(msg)
        .then((count) => {
          assert.notEqual(count, 0);
          done();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  describe('.get()', () => {
    it('should get 5 messages from queue', (done) => {
      const q = createQueue();
      q.push(createMessage());
      q.push(createMessage());
      q.push(createMessage());
      q.push(createMessage());
      q.push(createMessage());
      q.get().then((res) => {
        assert.equal(res.length, 5);
        done();
      });
    });

    it('should get 2 JSON messages from queue', (done) => {
      const userId = '7890';
      const q = new DejaQu().getQueue('jsonQueue', userId);
      const json = { key: 'value' };
      const msg = new Message(json);
      q.push(msg);
      q.push(msg);
      q.get().then((res) => {
        assert.equal(res.length, 2);
        assert.equal(res[1].body.key, 'value');
        done();
      });
    });
  });

  describe('.pop()', () => {
    it('should pop and return the first message from queue', (done) => {
      const q = createQueue();
      q.pop().then((msg) => {
        // check if popped message id is equal to the one saved
        // in the first test
        assert.equal(this.messageId, msg.id);
        done();
      });
    });
  });

  describe('.delete()', () => {
    it('should delete Message object and return the count of deleted items from queue', async () => {
      const q = createQueue();
      const msg = createMessage();
      q.push(msg);
      const num = await q.delete(msg);
      assert.equal(num, 1);
    });

    it('should delete serialized Message and return the count of deleted items from queue', async () => {
      const q = createQueue();
      const msg = createMessage();
      q.push(msg);
      const serializedMsg = msg.serialize();
      const num = await q.delete(serializedMsg);
      assert.equal(num, 1);
    });
  });
});
