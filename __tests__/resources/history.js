const c = require('../testutils/common');
const h = require('../testutils/helpers');

describe('Wealthica History resource', () => {
  c.setupResource.bind(this)({ isUser: true });

  test('should NOT be initiated along with the Wealthica instance', () => {
    expect(this.wealthica.history).not.toBeDefined();
  });

  test('should be initiated along with the Wealthica User instance', () => {
    expect(this.user.history).toBeDefined();
    expect(this.user.history).toHaveProperty('getList');
  });

  describe('.getList()', () => {
    test('should validate institutionId', async () => {
      await expect(() => this.user.history.getList()).rejects.toThrow();
      await expect(() => this.user.history.getList({})).rejects.toThrow('institution id');
      await expect(() => this.user.history.getList({ institutionId: 1 })).rejects
        .toThrow('institution id');
      expect(h.countRequests(this.userApiMock)).toBe(0);
    });

    test('should GET /institutions/:id/history', async () => {
      this.userApiMock.onGet().reply(200, [{ test: 'data' }]);
      const history = await this.user.history.getList({ institutionId: 'test' });
      expect(history).toEqual(expect.arrayContaining([{ test: 'data' }]));
      expect(this.userApiMock.history.get[0].url).toBe('/institutions/test/history');
    });

    test('should forward query params', async () => {
      this.userApiMock.onGet().reply(200, [{ test: 'data' }]);
      await this.user.history.getList({
        institutionId: 'test',
        from: '2021-01-01',
        to: '2021-10-01',
        investments: 'aa:bb:cc',
        anything: 'else',
      });
      expect(this.userApiMock.history.get[0].url).toBe(
        '/institutions/test/history?from=2021-01-01&to=2021-10-01&investments=aa%3Abb%3Acc&anything=else',
      );
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.userApiMock.onGet('/institutions/test/history'),
      methodCall: () => this.user.history.getList({ institutionId: 'test' }),
    });

    c.shouldHandleTokenError.bind(this)({
      methodCall: () => this.user.history.getList({ institutionId: 'test' }),
    });
  });
});
