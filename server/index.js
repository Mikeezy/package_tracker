require('dotenv').config();
const WebSocket = require('ws');

const { createServer } = require('./server');
const config = require('./config');
const { handleIncomingMessage } = require('./src/modules');
const eventEmitter = require('./src/utils/eventEmitter');
const { DELIVERY_UPDATED } = require('./src/utils/constant');
require('colors');

const app = createServer();

const port = config.get('port');
const wsPort = config.get('wsPort');
const env = config.get('nodeEnv');

const wss = new WebSocket.Server({ port: wsPort });

wss.on('connection', (ws, request, client) => {
  ws.on('message', (message) => {
    handleIncomingMessage(message);
  });

  ws.on('error', console.error);

  ws.on('close', () => {
    console.log('disconnected');
  });
});

eventEmitter.on(DELIVERY_UPDATED, (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const message = {
        event: DELIVERY_UPDATED,
        delivery_object: data,
      };
      client.send(JSON.stringify(message));
    }
  });
});

app.listen(port, () => {
  console.log(`Server now listening on localhost:${port}, on ${env}`.green);
});
