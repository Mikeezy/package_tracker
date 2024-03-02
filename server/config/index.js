require('dotenv').config();
const convict = require('convict');

const config = convict({
  nodeEnv: {
    doc: `This corresponds to the NODE_ENV environment variable and affects execution of many child modules. Generally speaking this should be "development" in a local developer environment and "production" in a real environment (regardless of whether it's staging or production).`,
    format: ['development', 'production', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'Port to bind server on.',
    format: 'port',
    default: null,
    env: 'PORT',
  },
  wsPort: {
    doc: 'Port to bind websocket server on.',
    format: 'port',
    default: null,
    env: 'WS_Port',
  },
});

// load environment defaults
if (config.get('nodeEnv')) {
  // note that this is relative to CWD
  config.loadFile(`./config/${config.get('nodeEnv')}.json`);
}

module.exports = config;
