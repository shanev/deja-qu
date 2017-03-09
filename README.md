# Déjà qu

[![npm version](https://badge.fury.io/js/deja-qu.svg)](https://badge.fury.io/js/deja-qu)
[![Build Status](https://travis-ci.org/shanev/deja-qu.svg?branch=master)](https://travis-ci.org/shanev/deja-qu)
[![codecov](https://codecov.io/gh/shanev/deja-qu/branch/master/graph/badge.svg)](https://codecov.io/gh/shanev/deja-qu)
[![codebeat badge](https://codebeat.co/badges/12303061-af38-468a-a118-c6663732ad90)](https://codebeat.co/projects/github-com-shanev-deja-qu-master)
[![Dependencies](https://david-dm.org/shanev/deja-qu.svg)](https://david-dm.org/shanev/deja-qu)

Déjà qu is Redis-backed FIFO message queue for storing any kind of ephemeral data. It allows you to easily build ephemeral timelines/stories. Messages are automatically removed from the queue once they're expired, without the need for polling, cron jobs, or timers.

## Installation

If you are using yarn:

```sh
yarn add deja-qu
```

or npm:

```sh
npm install deja-qu --save
```

Run Redis server:
```sh
redis-server
```
Check out [Redis quickstart](https://redis.io/topics/quickstart) to install.

## Usage

Initialize and start Déjà qu
```js
const dq = new DejaQu();

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

## Debugging

Add `DEBUG=deja-qu` to the node start script in `package.json` to see debug output. i.e:

```sh
DEBUG=deja-qu node server.js
```

## Tests

```sh
yarn install # or npm install
npm test
```

## Author

Shane Vitarana :: [http://shanev.me](http://shanev.me) :: [@shanev](https://twitter.com/shanev)
