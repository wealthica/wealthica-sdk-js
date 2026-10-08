const c = require('../testutils/common');

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
    test('should GET /history', async () => {
      this.userApiMock.onGet().reply(200, [{ test: 'data' }]);
      const history = await this.user.history.getList();
      expect(history).toEqual(expect.arrayContaining([{ test: 'data' }]));
      expect(this.userApiMock.history.get[0].url).toBe('/history');
    });

    test('should forward query params', async () => {
      this.userApiMock.onGet().reply(200, [{ test: 'data' }]);
      await this.user.history.getList({
        institutions: ['test'],
        from: '2021-01-01',
        to: '2021-10-01',
        investments: 'aa:bb:cc',
        anything: 'else',
      });
      expect(this.userApiMock.history.get[0].url).toBe(
        '/history?institutions=test&from=2021-01-01&to=2021-10-01&investments=aa%3Abb%3Acc&anything=else',
      );
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.userApiMock.onGet('/history'),
      methodCall: () => this.user.history.getList(),
    });

    c.shouldHandleTokenError.bind(this)({
      methodCall: () => this.user.history.getList(),
    });
  });
});
