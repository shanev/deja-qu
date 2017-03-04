# Déjà qu

Déjà qu is Redis-backed FIFO message queue for storing ephemeral data. It allows you to easily build ephemeral timelines/stories. It automatically removes the message from the queue once it's expired. No polling, cron jobs, or `setTimeout()`'s needed. 

## Usage

Initialize Déjà qu and create a queue
```javascript
const dq = DejaQu(redis);

const q = dq.createQueue('timeline', user1);
```

Create and add a message that expires in 24 hours
```javascript
const msg = new dq.Message("Hello", 86400);

q.push(message);
```

Get a range of messages (0..5)
```javascript
let messages = await q.get(0, 5);
```

Delete oldest message
```javascript
const message = await q.pop();
```
