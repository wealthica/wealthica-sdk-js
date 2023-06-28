const Wealthica = require('../src');
const Team = require('../src/resources/teams');

jest.mock('../src/resources/teams');

describe('Wealthica instance', () => {
  describe('.login()', () => {
    test('should return a Wealthica User instance', () => {
      const user = Wealthica.init({ clientId: 'test', secret: 'test' }).login('test');
      // Test API instance has been `init`ed
      expect(user.institutions).toHaveProperty('getList');
    });

    test('should require loginName in NodeJs', () => {
      mockNode();
      expect(() => Wealthica.init({ clientId: 'test', secret: 'test' }).login()).toThrow(/loginName/);
    });

    test('should NOT require loginName in Browser & ReactNative', () => {
      mockBrowser();
      expect(() => Wealthica.init({ clientId: 'test', secret: 'test' }).login())
        .not.toThrow(/loginName/);

      mockReactNative();
      expect(() => Wealthica.init({ clientId: 'test', secret: 'test' }).login())
        .not.toThrow(/loginName/);
    });
  });

  describe('.getTeam()', () => {
    test('should call teams.info()', () => {
      const wealthica = Wealthica.init({ clientId: 'test', secret: 'test' });
      wealthica.getTeam();
      const teams = Team.mock.instances[0];
      expect(teams).toBeDefined();
      expect(teams.info).toHaveBeenCalled();
    });
  });
});
