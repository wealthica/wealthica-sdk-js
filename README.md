# Official Wealthica JS SDK for the Browser & NodeJS

## What is Wealthica Connect?

[Wealthica](https://wealthica.com/) is an API for connecting with Canadian financial bands and brokerages platforms.

We believe teams and developers should focus on building great products, not worry about the fragmented landscape of exchange APIs and blockchain protocols.

For our updated list of integrations, check out our list of [Wealthica Integrations](https://wealthica.com/status/).

## Wealthica API Javascript (JS) SDK

This is the Official Wealthica JS SDK for the Browser & NodeJS.

The Wealthica Connect SDK provides convenient access to the Wealthica API from applications written in browser and server-side JavaScript. Please note that you must register and [request your API keys](https://wealthica.com/) to use in your application.

## Documentation

Refer to the [Wealthica API Documentation](https://wealthica.com/docs) for more details.

Bugs, requests or suggestions

Get in touch at [hello@wealthica.com](mailto:hello@wealthica.com) for bug reports, requests or suggestions.

## Getting started

```javascript
import Wealthica from 'wealthica-sdk-js';

(async () => {
  // Create a Wealthica Connect SDK instance
  const wealthica = Wealthica.init({
    clientId: 'YOUR_CLIENT_ID',
    secret: 'YOUR_CLIENT_SECRET',
  });

  // Call the API helper methods
  const providers = await wealthica.providers.getList();
  const team = await wealthica.getTeam();

  // Alternately, pass a loginName to return a Wealthica Connect SDK User instance in order to call
  // user-specific endpoints
  const user = Wealthica.init({
    clientId: 'YOUR_CLIENT_ID',
    secret: 'YOUR_CLIENT_SECRET',
    // Optional, only if you need to work with user data API, such as `wealthica.institutions.getOne(id)`,
    // or `wealthica.transactions.getList()` etc.
    loginName: 'YOUR_USERNAME_OR_ID',
  });

  // Call the user-specific API methods
  const institution = await user.institutions.getOne('INSTITUTION_ID');
})();
```

## APIs

### General APIs

These methods are SDK-specific and do not have a corresponding Wealthica API endpoint.

#### wealthica.login(loginName)

This method logs a user in and returns a Wealthica Connect SDK User instance so you can call user-specific APIs.

##### From server

`loginName` is required

```javascript
// Create a Wealthica Connect SDK instance
const wealthica = Wealthica.init({
  clientId: 'YOUR_CLIENT_ID',
  secret: 'YOUR_CLIENT_SECRET',
});

// Log user(s) in
const user1 = wealthica.login('USER_ID_1');
const user2 = wealthica.login('USER_ID_2');

// Call user APIs
const user1Institution = await user1.institutions.getOne('INSTITUTION_ID_1');
const user2Institution = await user2.institutions.getOne('INSTITUTION_ID_2');
```

##### From client (browser/ReactNative)

`loginName` is optional. Authentication is done either via an `authEndpoint` or a custom `authorizer` callback passed to `Wealthica.init()`

```javascript
// Create a Wealthica Connect SDK instance
const wealthica = Wealthica.init({
  clientId: 'YOUR_CLIENT_ID',
  // POST to `authEndpoint` on your server, expecting a JSON { token: 'USER_TOKEN' }
  authEndpoint: '/wealthica/auth', // default value
  // Optional parameters for `authEndpoint` to authenticate your user
  auth: {
    params: {}, // custom `authEndpoint` body
    headers: { Authorization: `Bearer ${yourAppsUserToken}` }, // custom `authEndpoint` headers
  },
  // Optional authorization method to use instead of `authEndpoint`
  authorizer: async (callback) => {
    try {
      const token = await getUserTokenFromYourServer();
      callback(null, { token });
    } catch (error) {
      callback(error);
    }
  }
});

// Log in to create a Wealthica User instance
const user = wealthica.login();

// Call user APIs
const institution = await user.institutions.getOne('INSTITUTION_ID_1');
```

Example server implementation for `authEndpoint`:

```
const wealthica = Wealthica.init({
  clientId: 'YOUR_CLIENT_ID',
  secret: 'YOUR_CLIENT_SECRET',
});

router.post('/wealthica/auth', async function(req, res) {
  const user = wealthica.login(req.user.id);

  res.json({ token: await user.getToken() });
});
```

#### user.fetchToken()

This method fetches and returns a new user token.

**NOTE**

- User token has a maximum lifetime duration. Current default is 20 minutes.
- All User API methods automatically fetch a new token if the old one expires so this is rarely needed.

```javascript
const token = await user.fetchToken();
```

#### user.getToken()

This method returns an existing user token or fetch a new one if the existing token has less than a specified amount of duration (default 10 seconds).

```javascript
const wealthica = Wealthica.init({
  clientId: 'YOUR_CLIENT_ID',
  secret: 'YOUR_CLIENT_SECRET',
});

const user = wealthica.login('YOUR_USERNAME_OR_ID');
let token = await user.getToken(); // returns the user token, 20 minutes lifetime
// After 10 minutes
token = await user.getToken(); // returns the same token
// After 19 minutes 51 seconds
token = await user.getToken(); // fetches and returns a new token

// After > another 10 minutes
token = await user.getToken({ minimumLifeTime: 600 }); // fetches and returns another new token
```

#### user.getConnectData({ provider, redirectURI, state, lang, theme, providersPerLine })

This method returns a Wealthica Connect URL and authentication token for user to connect an institution.

Wealthica Connect URL must be called via POST method and pass token in the form data.

User token has a 10 minutes session timeout.

```javascript
const { url, token } = await user.getConnectData({
  provider: 'coinbase', // optional
  // required for server-side, optional for client (browser, ReactNative) or if already passed to `Wealthica.init()`.
  // Must be a registered URI.
  redirectURI: 'YOUR_REDIRECT_URI',
  // required for Wealthica Connect drop-in widget, but already handled by the SDK when calling
  // `user.connect()` (defaults to `window.location.origin`).
  // https://wealthica.com/docs/#connect-url-parameters
  institutionId: 'INSTITUTION_ID',
  // Pass institutionId to re-connect an existing institution that has expired/revoked credentials
  origin: 'YOUR_SITE_ORIGIN',
  state: 'YOUR_APP_STATE', // optional
  lang: 'en', // optional (en | es | fr | it), 'en' by default
  providers: ['wise', 'stockchase'], // optional, ignored if `provider` is also passed in.
  providerGroups: ['core', 'thirdparty'], // optional, ['core'] by default
  theme: 'light', // optional (light | dark), 'light' by default
  providersPerLine: 1, // optional (1 | 2), 2 by default
  features: 'feature1,feature2', // optional, a comma-separated list of features. undefined by default
});
// {
//   url: "https://connect.wealthica.com/connect/coinbase?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&origin=YOUR_SITE_ORIGIN&state=YOUR_APP_STATE&lang=en&theme=light&providersPerLine=2",
//   token: "USER_TOKEN"
// }

// POST Wealthica Connect URL from client (browser/ReactNative) example:
const form = document.createElement("form");
form.method = "POST";
form.action = url;

const input = document.createElement("input");
input.type = "hidden";
input.name = "token";
input.value = token;
form.appendChild(input);

document.body.appendChild(form);

form.submit();

// Alternatively, pass redirectURI once to `Wealthica.init()`
const wealthica = Wealthica.init({
  clientId: 'YOUR_CLIENT_ID',
  secret: 'YOUR_CLIENT_SECRET',
  redirectURI: 'YOUR_REDIRECT_URI',
});

const user1 = wealthica.login('USER_ID_1');
const { url: url1, token } = await user1.getConnectData();

const user2 = wealthica.login('USER_ID_2');
const { url: url2, token } = await user2.getConnectData();
```

#### user.connect({ provider, providers, institutionId, lang, theme, providersPerLine, features, origin })

This method starts the Wealthica Connect process inside your webpage/app for user to connect their institution.

Connection response are provided via callbacks.

This method accepts the same parameters as `user.getConnectData()` except for `redirectURI` and `state`

```javascript
user.connect({
  // additional options
}).onConnection(institution => {
  // Send the institution to your server
  sendToServer('/some-route', institution);
}).onError(error => {
  console.error('institution connection error:', error)
}).onEvent((name, data) => {
  console.log('institution connection event:', name, data);
});
```

#### user.reconnect(institutionId)

This method starts the Wealthica Connect process to re-connect an existing institution that has expired/revoked credentials.

Connection response are provided via callbacks.

```javascript
user.reconnect('INSTITUTION_ID', {
  // additional options
}).onConnection(institution => {
  // Send the institution to your server
  sendToServer('/some-route', institution);
}).onError(error => {
  console.error('institution connection error:', error)
}).onEvent((name, data) => {
  console.log('institution connection event:', name, data);
});
```

### User APIs

These methods return user data and thus require a Wealthica Connect SDK User instance. They automatically fetch a new token if necessary so you would not be bothered with tokens logic.

#### user.institutions.getList()

This method retrieves the list of institutions for a user.

```javascript
const institutions = await user.institutions.getList();
```

todo: add response example
```json

```

#### user.institutions.getOne(id)

This method retrieves a single institution.

```javascript
const institution = await user.institutions.getOne('603522490d2b02001233a5d6');
```

todo: add response example
```json

```

#### user.institutions.sync(id)

This method triggers an institution sync.

```javascript
const institution = await user.institutions.sync('603522490d2b02001233a5d6');
```

#### user.institutions.remove(id)

This method removes a single institution from the user.

```javascript
await user.institutions.remove('603522490d2b02001233a5d6');
```

#### user.history.getList({ institutions, from, to, investments })

This method retrieves the balance history for an institution.

Returns data within the last 1 year by default.

```javascript
const history = await user.history.getList({
  institutions: ['603522490d2b02001233a5d6'],
  from: '2021-01-01',
  to: '2021-09-09',
  investments: ['bitcoin:cash:usd'],
});
```

todo: add response example
```json

```

#### user.transactions.getList({ institutionId, ticker, from, to, investments, last, limit })

This method retrieves the list of transactions for an institution.

Returns data within the last 1 year by default.

```javascript
const transactions = await user.transactions.getList({
  institutions: ['603522490d2b02001233a5d6'],
  from: '2020-08-31', // optional
  to: '2021-08-31', // optional
  investment: 'wise:cash:usd', // optional
  last: '603522490d2b02001233a5d6', // optional, blank string is allowed
  limit: 10, // optional
  institutionId: '603522490d2b02001233a5d6', // Deprecated, use institutions prop
});
```

todo: add response example
```json

```

#### user.transactions.getOne({ txId })

This method retrieves a single transaction.

```javascript
const transaction = await user.transactions.getOne({
  txId: '603522490d2b02001233a5d6'
});
```

todo: add response example
```json

```

#### user.positions.getList({ institutions })

This method retrieves user positions.

```javascript
const positions = await user.positions.getList({
  institutions: ['603522490d2b02001233a5d6']
});
```

todo: add response example
```json

```

### Data APIs

These methods provide general Wealthica information and do not require logging in a user.

```javascript
const wealthica = Wealthica.init({
  clientId: 'YOUR_CLIENT_ID',
  secret: 'YOUR_CLIENT_SECRET',
});

const providers = await wealthica.providers.getList();
```

#### wealthica.providers.getList()

This method retrieves the list of Wealthica supported providers.

```javascript
const providers = await wealthica.providers.getList();
```

todo: add response example
```json

```

#### wealthica.providers.getOne(id)

This method retrieves a single provider.

```javascript
const provider = await wealthica.providers.getOne('coinbase');
```

todo: add response example
```json

```

## Development

### Install

```
yarn install
```

### Build

```
yarn build
```

### Test

```
yarn build
yarn test
```

### Use GET method in Connect URL instead of POST

Pass additional flag `connectionType: 'GET'` to use GET method in Connect URL instead of POST:

```
connect({ connectionType: 'GET' })
reconnect(accountId, { connectionType: 'GET' })
```

That's useful for developing Connect URL when vite local server used.
Token exposed in URL when GET method used what is not secure so this feature should be used only for development goals.

### Release
```
npm version patch # or minor/major
git push && git push --tags
# wait until merged then
npm publish
```
