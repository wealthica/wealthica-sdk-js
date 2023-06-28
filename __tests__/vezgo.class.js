const Wealthica = require('../src');
const API = require('../src/api');

describe('Wealthica.init()', () => {
  test('should return a Wealthica instance', () => {
    const wealthica = Wealthica.init({
      clientId: 'test',
      secret: 'test',
    });

    expect(wealthica).toBeInstanceOf(API);
    expect(wealthica).toHaveProperty('getTeam');
    // Test API instance has been `init`ed
    expect(wealthica.providers).toHaveProperty('getList');
    expect(wealthica.teams).toHaveProperty('info');
    // Test not being a Wealthica User instance
    expect(wealthica.institutions).toBeUndefined();
    expect(wealthica.transactions).toBeUndefined();
  });

  test('should return a Wealthica User instance when loginName is passed in', () => {
    const wealthica = Wealthica.init({
      clientId: 'test',
      secret: 'test',
      loginName: 'test',
    });

    expect(wealthica.institutions).toHaveProperty('getList');
    expect(wealthica.transactions).toHaveProperty('getList');
  });

  test('should require & validate clientId', () => {
    expect(() => Wealthica.init({ secret: 'test' })).toThrow(/clientId/);
    expect(() => Wealthica.init({ clientId: 1, secret: 'test' })).toThrow(/clientId/);
  });

  test('should require & validate secret in NodeJS', () => {
    mockNode();
    expect(() => Wealthica.init({ clientId: 'test' })).toThrow(/secret/);
    expect(() => Wealthica.init({ clientId: 'test', secret: 1 })).toThrow(/secret/);
  });

  test('should NOT require secret in Browser & ReactNative', () => {
    mockBrowser();
    expect(() => Wealthica.init({ clientId: 'test' })).not.toThrow(/secret/);

    mockReactNative();
    expect(() => Wealthica.init({ clientId: 'test' })).not.toThrow(/secret/);
  });
});
