# Official Wealthica JS SDK for the Browser & NodeJS

[![Build Status](https://semaphoreci.com/api/v1/wealthica/wealthica-sdk-js/branches/master/badge.svg)](https://semaphoreci.com/wealthica/wealthica-sdk-js)

## What is Wealthica? A Unified Cryptocurrency API.

> *“We tried a few crypto data APIs to retrieve our users digital assets, Wealthica is the only one that actually works!”* — Wealth Tracking Dashboard Dev

[Wealthica](https://wealthica.com/) is an API for connecting with cryptocurrency exchanges, wallets and protocols like Bitcoin. Instead of manually integrating with [Crypto Exchange APIs](https://wealthica.com/status/) like [Coinbase API](https://wealthica.com/), [Binance API](https://wealthica.com/), [Bitcoin APIs](https://wealthica.com/), [Crypto APIs](https://wealthica.com/) or the hundreds of other cryptocurrency APIs - you can simply use Wealthica for them all.

Wealthica is the **#1** alternative to the discontinued [Zabo API](https://wealthica.com/).

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
  const account = await user.institutions.getOne('ACCOUNT_ID');
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
const user1Account = await user1.institutions.getOne('ACCOUNT_ID_1');
const user2Account = await user2.institutions.getOne('ACCOUNT_ID_2');
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
const account = await user.institutions.getOne('ACCOUNT_ID_1');
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

This method returns a Wealthica Connect URL and authentication token for user to connect an account.

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
  accountId: 'ACCOUNT_ID',
  // Pass accountId to re-connect an existing account that has expired/revoked credentials
  origin: 'YOUR_SITE_ORIGIN',
  state: 'YOUR_APP_STATE', // optional
  lang: 'en', // optional (en | es | fr | it), 'en' by default
  providers: ['wise', 'stockchase'], // optional, ignored if `provider` is also passed in.
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
  origin: 'YOUR_SITE_ORIGIN',
});

const user1 = wealthica.login('USER_ID_1');
const { url: url1, token } = await user1.getConnectData();

const user2 = wealthica.login('USER_ID_2');
const { url: url2, token } = await user2.getConnectData();
```

#### user.connect({ provider, providers, accountId, lang, theme, providersPerLine, features })

This method starts the Wealthica Connect process inside your webpage/app for user to connect their account.

Connection response are provided via callbacks.

This method accepts the same parameters as `user.getConnectData()` except for `redirectURI`, `origin` and `state`

```javascript
user.connect().onConnection(account => {
  // Send the account to your server
  sendToServer('/some-route', account);
}).onError(error => {
  console.error('account connection error:', error)
}).onEvent((name, data) => {
  console.log('account connection event:', name, data);
});
```

#### user.reconnect(accountId)

This method starts the Wealthica Connect process to re-connect an existing account that has expired/revoked credentials.

Connection response are provided via callbacks.

```javascript
user.reconnect('ACCOUNT_ID').onConnection(account => {
  // Send the account to your server
  sendToServer('/some-route', account);
}).onError(error => {
  console.error('account connection error:', error)
}).onEvent((name, data) => {
  console.log('account connection event:', name, data);
});
```

### User APIs

These methods return user data and thus require a Wealthica Connect SDK User instance. They automatically fetch a new token if necessary so you would not be bothered with tokens logic.

#### user.institutions.getList()

This method retrieves the list of institutions for a user.

```javascript
const institutions = await user.institutions.getList();
```

```json
[
  {
    "id": "603522490d2b02001233a5d6",
    "provider": {
      "name": "coinbase",
      "display_name": "Coinbase",
      "logo": "https://app.wealthica.com/images/institutions/coinbase.png",
      "type": "oauth",
      "scopes": [],
      "resource_type": "provider"
    },
    "balances": [
      {
        "ticker": "BTC",
        "provider_ticker": "BTC",
        "name": "Bitcoin",
        "asset_is_verified": null,
        "asset_type": "",
        "amount": "0.20210831",
        "decimals": 8,
        "fiat_ticker": "USD",
        "fiat_value": "2021.08",
        "fiat_asset_is_verified": null,
        "logo": "https://data.wealthica.com/api/securities/CRYPTO:BTC/logo",
        "updated_at": 1630412605283,
        "misc": null,
        "resource_type": "balance"
      }
    ],
    "blockchain": null,
    "created_at": 1630412605283,
    "updated_at": 1630412605283,
    "resource_type": "account",
  },
  {
    "id": "603522490d2b02001233a5d7",
    "provider": {
      "name": "bitcoin",
      "display_name": "Bitcoin Address",
      "logo": "https://app.wealthica.com/images/institutions/bitcoin.png",
      "type": "wallet",
      "scopes": [],
      "resource_type": "provider"
    },
    "balances": [],
    "blockchain": null,
    "created_at": 1630412605283,
    "updated_at": 1630412605283,
    "resource_type": "account",
  }
]
```

#### user.institutions.getOne(id)

This method retrieves a single account.

```javascript
const account = await user.institutions.getOne('603522490d2b02001233a5d6');
```

```json
{
  "id": "603522490d2b02001233a5d6",
  "provider": {
    "name": "coinbase",
    "display_name": "Coinbase",
    "logo": "https://app.wealthica.com/images/institutions/coinbase.png",
    "type": "oauth",
    "scopes": [],
    "resource_type": "provider"
  },
  "balances": [
    {
      "ticker": "BTC",
      "provider_ticker": "BTC",
      "name": "Bitcoin",
      "asset_is_verified": null,
      "asset_type": "",
      "amount": "0.20210831",
      "decimals": 8,
      "fiat_ticker": "USD",
      "fiat_value": "2021.08",
      "fiat_asset_is_verified": null,
      "logo": "https://data.wealthica.com/api/securities/CRYPTO:BTC/logo",
      "updated_at": 1630412605283,
      "misc": null,
      "resource_type": "balance"
    }
  ],
  "blockchain": null,
  "created_at": 1630412605283,
  "updated_at": 1630412605283,
  "resource_type": "account",
}
```

#### user.institutions.sync(id)

This method triggers an account sync.

```javascript
const account = await user.institutions.sync('603522490d2b02001233a5d6');
```

#### user.institutions.remove(id)

This method removes a single account from the user.

```javascript
await user.institutions.remove('603522490d2b02001233a5d6');
```

#### user.history.getList({ accountId, from, to, wallet })

This method retrieves the balance history for an account.

Returns data within the last 1 year by default.

```javascript
const history = await user.history.getList({
  accountId: '603522490d2b02001233a5d6',
  from: '2021-01-01',
  to: '2021-09-09',
  wallet: 'bitcoin:cash:usd',
});
```

```json
[
  {
    "id": "6144755af8a77cae7174afa3",
    "date": 1630412605283,
    "wallet": "demo:cash:usd",
    "fiat_ticker": "USD",
    "fiat_value": "125.30"
  },
  {
    "id": "6144755af8a77cae7174afa4",
    "date": 1630412605283,
    "wallet": "demo:cash:cad",
    "fiat_ticker": "USD",
    "fiat_value": "125.30"
  },
]
```

#### user.transactions.getList({ accountId, ticker, from, to, wallet, last, limit })

This method retrieves the list of transactions for an account.

Returns data within the last 1 year by default.

```javascript
const transactions = await user.transactions.getList({
  accountId: '603522490d2b02001233a5d6',
  ticker: 'BTC', // optional
  from: '2020-08-31', // optional
  to: '2021-08-31', // optional
  wallet: 'bitcoin:cash:usd', // optional
  last: '603522490d2b02001233a5d6', // optional, blank string is allowed
  limit: 10, // optional
});
```

```json
[
  {
    "id": "603522490d2b02001233a5d6",
    "status": null,
    "transaction_type": "deposit",
    "parts": [
      {
        "direction": "received",
        "ticker": "BTC",
        "provider_ticker": "BTC",
        "amount": "1.20210831",
        "asset_is_verified": null,
        "fiat_ticker": "USD",
        "fiat_value": "1234567.8",
        "fiat_asset_is_verified": null,
        "other_parties": []
      }
    ],
    "fees": [
      {
        "type": null,
        "ticker": "USD",
        "provider_ticker": "USD",
        "amount": "0.5",
        "asset_is_verified": null,
        "fiat_ticker": "",
        "fiat_value": "",
        "fiat_asset_is_verified": null,
        "resource_type": "transaction_fee"
      }
    ],
    "misc": [],
    "fiat_calculated_at": 1630412605283,
    "initiated_at": 1630412605283,
    "confirmed_at": 1630412605283,
    "resource_type": "transaction"
  },
  {
    "id": "603522490d2b02001233a5d7",
    "status": null,
    "transaction_type": "deposit",
    "parts": [],
    "fees": [],
    "misc": [],
    "fiat_calculated_at": 1630412605283,
    "initiated_at": 1630412605283,
    "confirmed_at": 1630412605283,
    "resource_type": "transaction"
  }
]
```

#### user.transactions.getOne({ accountId, txId })

This method retrieves a single transaction.

```javascript
const transaction = await user.transactions.getOne({
  accountId: '603522490d2b02001233a5d6',
  txId: '603522490d2b02001233a5d6'
});
```

```json
{
  "id": "603522490d2b02001233a5d6",
  "status": null,
  "transaction_type": "deposit",
  "parts": [
    {
      "direction": "received",
      "ticker": "BTC",
      "provider_ticker": "BTC",
      "amount": "1.20210831",
      "asset_is_verified": null,
      "fiat_ticker": "USD",
      "fiat_value": "1234567.8",
      "fiat_asset_is_verified": null,
      "other_parties": []
    }
  ],
  "fees": [
    {
      "type": null,
      "ticker": "USD",
      "provider_ticker": "USD",
      "amount": "0.5",
      "asset_is_verified": null,
      "fiat_ticker": "",
      "fiat_value": "",
      "fiat_asset_is_verified": null,
      "resource_type": "transaction_fee"
    }
  ],
  "misc": [],
  "fiat_calculated_at": 1630412605283,
  "initiated_at": 1630412605283,
  "confirmed_at": 1630412605283,
  "resource_type": "transaction"
}
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

```json
[
  {
    "name": "coinbase",
    "display_name": "Coinbase",
    "logo": "https://app.wealthica.com/images/institutions/coinbase.png",
    "auth_type": "oauth",
    "available_scopes": [],
    "available_currencies": null,
    "resource_type": "provider",
    "status": null,
    "is_beta": true,
    "connect_notice": "",
    "credentials": ["code"]
  },
  {
    "name": "bitcoin",
    "display_name": "Bitcoin Address",
    "logo": "https://app.wealthica.com/images/institutions/bitcoin.png",
    "auth_type": "wallet",
    "available_scopes": [],
    "available_currencies": null,
    "resource_type": "provider",
    "status": null,
    "is_beta": true,
    "connect_notice": "",
    "credentials": ["wallet"]
  }
]
```

#### wealthica.providers.getOne(id)

This method retrieves a single provider.

```javascript
const provider = await wealthica.providers.getOne('coinbase');
```

```json
{
    "name": "coinbase",
    "display_name": "Coinbase",
    "logo": "https://app.wealthica.com/images/institutions/coinbase.png",
    "auth_type": "oauth",
    "available_scopes": [],
    "available_currencies": null,
    "resource_type": "provider",
    "status": null,
    "is_beta": true,
    "connect_notice": "",
    "credentials": ["code"]
  }
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

### Release
```
npm version patch # or minor/major
git push && git push --tags
# wait until merged then
npm publish
```
