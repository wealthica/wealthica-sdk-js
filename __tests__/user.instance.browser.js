const MockAdapter = require('axios-mock-adapter');
const Wealthica = require('../src');
const c = require('./testutils/common');
const { generateToken } = require('./testutils/helpers');

describe('Wealthica User instance (Browser)', () => {
  beforeEach(() => {
    mockBrowser();
    this.user = Wealthica.init({ clientId: 'test' }).login();
    this.token = generateToken();
    this.authMock = new MockAdapter(this.user.authApi.axiosInstance);
    this.authMock.onPost('/wealthica/auth').reply(200, { token: this.token });
  });

  describe('.reconnect()', () => {
    test('should require institutionId', () => {
      expect(() => this.user.reconnect()).toThrow(/institutionId/);
    });
  });

  describe('.fetchToken()', () => {
    test('should call default authEndpoint', async () => {
      const resultToken = await this.user.fetchToken();
      expect(resultToken).toEqual(this.token);
      expect(this.authMock.history.post).toHaveLength(1);
      expect(this.authMock.history.post[0].url).toBe('/wealthica/auth');
      expect(this.authMock.history.post[0].baseURL).toBeUndefined();
    });

    test('should call custom authEndpoint if defined', async () => {
      this.user = Wealthica.init({
        clientId: 'test',
        authEndpoint: 'http://localhost/custom/auth',
      }).login('test');
      this.authMock = new MockAdapter(this.user.authApi.axiosInstance);
      this.authMock.onPost('http://localhost/custom/auth').reply(200, { token: this.token });

      const resultToken = await this.user.fetchToken();
      expect(resultToken).toEqual(this.token);
      expect(this.authMock.history.post).toHaveLength(1);
      expect(this.authMock.history.post[0].url).toBe('http://localhost/custom/auth');
    });

    test('should pass custom params & headers to authEndpoint if defined', async () => {
      this.user = Wealthica.init({
        clientId: 'test',
        auth: {
          params: { custom: 'param' },
          headers: { custom: 'header' },
        },
      }).login('test');
      this.authMock = new MockAdapter(this.user.authApi.axiosInstance);
      this.authMock.onPost('/wealthica/auth').reply(200, { token: this.token });

      const resultToken = await this.user.fetchToken();
      expect(resultToken).toEqual(this.token);
      expect(this.authMock.history.post).toHaveLength(1);
      expect(this.authMock.history.post[0].url).toBe('/wealthica/auth');
      expect(this.authMock.history.post[0].data).toBe('{"custom":"param"}');
      expect(this.authMock.history.post[0].headers).toHaveProperty('custom', 'header');
    });

    test('should handle error from authEndpoint', async () => {
      this.authMock.onPost('/wealthica/auth').reply(400);
      await expect(() => this.user.fetchToken()).rejects.toThrow('400');

      this.authMock.onPost('/wealthica/auth').reply(500);
      await expect(() => this.user.fetchToken()).rejects.toThrow('500');
    });

    test('should get token via authorizer function if defined', async () => {
      const authorizer = jest.fn().mockImplementation((callback) => {
        callback(null, { token: this.token });
      });
      this.user = Wealthica.init({
        clientId: 'test',
        authEndpoint: 'http://localhost/custom/auth', // to test authorizer taking precedence
        authorizer,
      }).login('test');
      this.authMock = new MockAdapter(this.user.authApi.axiosInstance);

      const resultToken = await this.user.fetchToken();
      expect(resultToken).toEqual(this.token);
      expect(authorizer).toHaveBeenCalled();
      expect(this.authMock.history.post).toHaveLength(0);
    });

    test('should handle error from authorizer function', async () => {
      const authorizer = jest.fn().mockImplementation((callback) => {
        callback(new Error('test error'));
      });
      this.user = Wealthica.init({
        clientId: 'test',
        authEndpoint: 'http://localhost/custom/auth', // to test authorizer taking precedence
        authorizer,
      }).login('test');
      this.authMock = new MockAdapter(this.user.authApi.axiosInstance);
      await expect(() => this.user.fetchToken()).rejects.toThrow('test error');
    });

    test('should handle invalid result from authorizer function', async () => {
      const authorizer = jest.fn().mockImplementation((callback) => {
        callback(null, { wrong: 'result' });
      });
      this.user = Wealthica.init({
        clientId: 'test',
        authEndpoint: 'http://localhost/custom/auth', // to test authorizer taking precedence
        authorizer,
      }).login('test');
      this.authMock = new MockAdapter(this.user.authApi.axiosInstance);
      await expect(() => this.user.fetchToken()).rejects.toThrow('Invalid authorizer result');
    });
  });

  c.testGetTokenBehavior.bind(this)({ isBrowser: true });
  c.testAutoRefreshBehavior.bind(this)({ isBrowser: true });
  c.testGetConnectDataBehavior.bind(this)({ isBrowser: true });
});
