const c = require('../testutils/common');
const h = require('../testutils/helpers');

describe('Wealthica Transactions resource', () => {
  c.setupResource.bind(this)({ isUser: true });

  test('should NOT be initiated along with the Wealthica instance', () => {
    expect(this.wealthica.transactions).not.toBeDefined();
  });

  test('should be initiated along with the Wealthica User instance', () => {
    expect(this.user.transactions).toBeDefined();
    expect(this.user.transactions).toHaveProperty('getList');
    expect(this.user.transactions).toHaveProperty('getOne');
  });

  describe('.getList()', () => {
    test('should GET /transactions?institutions=id', async () => {
      this.userApiMock.onGet().reply(200, [{ test: 'data' }]);
      const transactions = await this.user.transactions.getList({ institutions: ['test'] });
      expect(transactions).toEqual(expect.arrayContaining([{ test: 'data' }]));
      expect(this.userApiMock.history.get[0].url).toBe('/transactions?institutions=test');
    });

    test('should forward query params', async () => {
      this.userApiMock.onGet().reply(200, [{ test: 'data' }]);
      await this.user.transactions.getList({
        institutions: ['test'],
        from: '2021-01-01',
        to: '2021-10-01',
        ticker: 'ABC',
        investments: 'aa:bb:cc',
        last: 'test',
        limit: 10,
        anything: 'else',
      });
      expect(this.userApiMock.history.get[0].url).toBe(
        '/transactions?institutions=test&from=2021-01-01&to=2021-10-01&ticker=ABC&investments=aa%3Abb%3Acc&last=test&limit=10&anything=else',
      );
    });

    test('should allow passing an empty `last`', async () => {
      this.userApiMock.onGet().reply(200, [{ test: 'data' }]);
      await this.user.transactions.getList({ institutions: ['test'], last: '' });
      expect(this.userApiMock.history.get[0].url).toBe('/transactions?institutions=test&last=');
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.userApiMock.onGet('/transactions?institutions=test'),
      methodCall: () => this.user.transactions.getList({ institutions: ['test'] }),
    });

    c.shouldHandleTokenError.bind(this)({
      methodCall: () => this.user.transactions.getList({ institutions: ['test'] }),
    });
  });

  describe('.getOne()', () => {
    test('should validate txId', async () => {
      await expect(() => this.user.transactions.getOne()).rejects.toThrow();
      await expect(() => this.user.transactions.getOne({})).rejects
        .toThrow('Please provide a valid Wealthica transaction id.');
      await expect(() => this.user.transactions.getOne({})).rejects
        .toThrow('transaction id');
      await expect(() => this.user.transactions.getOne({ txId: 1 })).rejects
        .toThrow('transaction id');
      expect(h.countRequests(this.userApiMock)).toBe(0);
    });

    test('should GET /transactions/:txid', async () => {
      this.userApiMock.onGet().reply(200, { test: 'data' });
      const transaction = await this.user.transactions.getOne({
        txId: 'test',
        anything: 'else',
      });
      expect(transaction).toEqual({ test: 'data' });
      expect(this.userApiMock.history.get[0].url).toBe('/transactions/test?anything=else');
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.userApiMock.onGet('/transactions/test'),
      methodCall: () => this.user.transactions.getOne({ txId: 'test' }),
    });

    c.shouldHandleTokenError.bind(this)({
      methodCall: () => this.user.transactions.getOne({ txId: 'test' }),
    });
  });
});
