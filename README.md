# Déjà qu

[![npm version](https://badge.fury.io/js/deja-qu.svg)](https://badge.fury.io/js/deja-qu)
[![Build Status](https://travis-ci.org/shanev/deja-qu.svg?branch=master)](https://travis-ci.org/shanev/deja-qu)

Déjà qu is Redis-backed FIFO message queue for storing ephemeral data. It allows you to easily build ephemeral timelines/stories. It automatically removes the message from the queue once it's expired. No polling, cron jobs, or timers needed.

## Usage

Initialize and start Déjà qu
```js
const dq = DejaQu();

dq.start();
```

Create a queue
```js
const q = dq.createQueue('timeline', user1);
```

Create and add a message that expires in 24 hours
```js
const msg = new dq.Message('Have I seen this before?', 86400);

q.push(msg);
```

Get the first 5 messages
```js
const messages = await q.get(0, 4);
```

Delete the oldest message
```js
const message = await q.pop();
```
