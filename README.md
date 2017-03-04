# Deja Qu

## Data structures

### Message (String)

```
MSG
  id: 1234
  body: jhjkh,
  user: id,
  created: date,
  ref: id
```

`create()`

### Queue (List)

```
user:1:timeline MSG MSG MSG
user:1:${queue} MSG MSG MSG
```

`push()`
```
RPUSH user:1:{queue} MSG`
SET expires:user:1:msg:id null EX [time]
```

`get()`
```
LRANGE user:1:{queue} 0 5
```

`pop()` & `expireMessage()`
```
LPOP user:1:{queue}
```

### ExpirationKey (String)

```
expires:user:1:MSG:id
```

`create()`

## PubSub

### ExpirationService

`subscribe to “__keyevent@0__:expired”`

`expire()`
```
LPOP user:1:{queue}
```

## Usage

Publishing a message
```
const dq = DejaQu(redis, userId);
const q = new dq.Queue();
const msg = new dq.Message("Hello", 86400);
q.push(message);
```

Getting a range of messages
```
let messages = await q.get();
```

Deleting a message
```
q.pop();
```
