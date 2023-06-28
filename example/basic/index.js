require('dotenv').config();

const express = require('express');
const path = require('path');

// Import published SDK version
const Wealthica = require('wealthica-sdk-js');

// Or import from this local repo. Need to run `yarn build` in wealthica-sdk-js directory first
// const Wealthica = require('../../src/index');

const app = express();
const port = process.env.PORT || 3001;

const wealthica = Wealthica.init({
  clientId: process.env.WEALTHICA_CLIENT_ID,
  secret: process.env.WEALTHICA_CLIENT_SECRET,

  // The following is for Wealthica developers only, remove if you are a Wealthica client
  baseURL: process.env.WEALTHICA_API_URL,
  connectURL: process.env.WEALTHICA_CONNECT_URL,
});

// To pass some configurations to the frontend
app.get('/assets/config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
var constants = {
  WEALTHICA_CLIENT_ID: '${process.env.WEALTHICA_CLIENT_ID}',
  WEALTHICA_API_URL: '${process.env.WEALTHICA_API_URL || 'https://api.wealthica.com'}',
  WEALTHICA_CONNECT_URL: '${process.env.WEALTHICA_CONNECT_URL || 'https://connect.wealthica.com'}',
};
  `.trim());
});

// Serve the local build of the Wealthica Browser SDK
app.get('/assets/wealthica.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '../../dist/wealthica.js'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/wealthica/auth', async (req, res) => {
  // Replace with your own authentication
  const authorization = req.get('Authorization');
  const userId = authorization.replace('Bearer ', '');

  const user = wealthica.login(userId);
  res.json({ token: await user.getToken() });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Wealthica Connect Example App listening at http://localhost:${port}`);
});
