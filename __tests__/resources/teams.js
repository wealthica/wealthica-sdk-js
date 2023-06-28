const c = require('../testutils/common');

describe('Wealthica Teams resource', () => {
  c.setupResource.bind(this)();

  test('should be initiated along with the Wealthica instance', () => {
    expect(this.wealthica.teams).toBeDefined();
    expect(this.wealthica.teams).toHaveProperty('info');
  });

  describe('.info()', () => {
    test('should GET /teams/info', async () => {
      this.apiMock.onGet().reply(200, { test: 'data' });
      const team = await this.wealthica.teams.info();
      expect(team).toEqual({ test: 'data' });
      expect(this.apiMock.history.get[0].url).toBe('/teams/info?client_id=test');
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.apiMock.onGet('/teams/info?client_id=test'),
      methodCall: () => this.wealthica.teams.info(),
    });
  });
});
