const shortId = require('shortid');

class Message {
  // deserialize() a Redis string in a Message object
  static deserialize(messageString) {
    return JSON.parse(messageString);
  }

  // construct a message, a body is required, currently serializes to JSON
  constructor(id = null, body, userId = null, refId = null, expiry = null) {
    if (body == null) {
      throw new Error('A message body is required.');
    }

    // generate an id if one isn't passed in
    this.id = id || shortId.generate();

    // set fields
    this.body = body;
    this.userId = userId;
    this.refId = refId;
    this.expiry = expiry;
  }

  // serialize() a message to JSON so it can be stored in a Redis string
  serialize() {
    return JSON.stringify(this);
  }
}

module.exports = Message;
