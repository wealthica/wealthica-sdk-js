const c = require('../testutils/common');

describe('Wealthica Providers resource', () => {
  c.setupResource.bind(this)();

  test('should be initiated along with the Wealthica instance', () => {
    expect(this.wealthica.providers).toBeDefined();
    expect(this.wealthica.providers).toHaveProperty('getList');
    expect(this.wealthica.providers).toHaveProperty('getOne');
  });

  describe('.getList()', () => {
    test('should GET /providers', async () => {
      this.apiMock.onGet().reply(200, [{ test: 'data' }]);
      const providers = await this.wealthica.providers.getList();
      expect(providers).toEqual(expect.arrayContaining([{ test: 'data' }]));
      expect(this.apiMock.history.get[0].url).toBe('/providers');
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.apiMock.onGet('/providers'),
      methodCall: () => this.wealthica.providers.getList(),
    });
  });

  describe('.getOne(id)', () => {
    test('should GET /providers/:id', async () => {
      this.apiMock.onGet().reply(200, { test: 'data' });
      const provider = await this.wealthica.providers.getOne('test');
      expect(provider).toEqual({ test: 'data' });
      expect(this.apiMock.history.get[0].url).toBe('/providers/test');
    });

    c.shouldValidateResourceId.bind(this)({
      message: 'provider id',
      calls: [
        () => this.wealthica.providers.getOne(),
        () => this.wealthica.providers.getOne(1),
      ],
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.apiMock.onGet('/providers/test'),
      methodCall: () => this.wealthica.providers.getOne('test'),
    });
  });
});
