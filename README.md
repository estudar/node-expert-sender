# node-expert-sender

ExpertSender REST API client for Node.js

Check the official REST API documentation here: https://sites.google.com/a/expertsender.com/api-documentation/home

## Usage

```js
const ExpertSenderClient = require('@estudar/expert-sender')
const client = new ExpertSenderClient('API_SERVER', 'API_KEY')

const listId = 1
const subscriber = { firstname: 'Daniel', email: 'daniel@example.com' }

client.addSubscriber(listId, subscriber)
// => Promise
```

## Requirements

  This package is tested using node.js v6.10.3 (aws lambda version).

## Installing

```js
npm install --save @estudar/expert-sender
```

## Features

- [x] Add subscribers
- [ ] Add data table rows
- [ ] Update data table rows

All other methods can be easily implemented. Pull requests are welcome :)

