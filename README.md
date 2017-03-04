# Deja Qu

Deja Qu is an ephemeral FIFO message queue backed by Redis. It allows you to easily build ephemeral timelines/stories.

## Usage

Initialize Deja Qu and create a queue
```
const dq = DejaQu(redis);

const q = dq.createQueue('timeline', user1);
```

Create and add a message that expires in 24 hours. Deja Qu will automatically remove the message from the queue once it's expired.
```
const msg = new dq.Message("Hello", 86400);

q.push(message);
```

Get a range of messages (0..5)
```
let messages = await q.get(0, 5);
```

Delete oldest message
```
const message = await q.pop();
```
