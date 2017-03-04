# Deja Qu

Deja Qu is an ephemeral message queue backed by Redis. It allows you to easily build ephemeral messaging services

## Redis setup

### ExpirationService

`subscribe to “__keyevent@0__:expired”`

`expire()`
```
LPOP user:1:{queue}
```

## Usage

Publish a message
```
const dq = DejaQu(redis);

const q = dq.createQueue('timeline', user1);

const msg = new dq.Message("Hello", 86400);

q.push(message);
```

Get a range of messages (0..5)
```
let messages = await q.get(0, 5);
```

Delete oldest message in queue
```
q.pop();
```
