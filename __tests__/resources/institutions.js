const c = require('../testutils/common');

describe('Wealthica Institutions resource', () => {
  c.setupResource.bind(this)({ isUser: true });

  test('should NOT be initiated along with the Wealthica instance', () => {
    expect(this.wealthica.institutions).not.toBeDefined();
  });

  test('should be initiated along with the Wealthica User instance', () => {
    expect(this.user.institutions).toBeDefined();
    expect(this.user.institutions).toHaveProperty('getList');
    expect(this.user.institutions).toHaveProperty('getOne');
    expect(this.user.institutions).toHaveProperty('sync');
    expect(this.user.institutions).toHaveProperty('remove');
  });

  describe('.getList()', () => {
    test('should GET /institutions', async () => {
      this.userApiMock.onGet().reply(200, [{ test: 'data' }]);
      const institutions = await this.user.institutions.getList();
      expect(institutions).toEqual(expect.arrayContaining([{ test: 'data' }]));
      expect(this.userApiMock.history.get[0].url).toBe('/institutions');
    });

    test('should forward query params', async () => {
      this.userApiMock.onGet().reply(200, [{ test: 'data' }]);
      await this.user.institutions.getList({ some: 'thing' });
      expect(this.userApiMock.history.get[0].url).toBe('/institutions?some=thing');
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.userApiMock.onGet('/institutions'),
      methodCall: () => this.user.institutions.getList(),
    });

    c.shouldHandleTokenError.bind(this)({
      methodCall: () => this.user.institutions.getList(),
    });
  });

  describe('.getOne()', () => {
    test('should GET /institutions/:id', async () => {
      this.userApiMock.onGet().reply(200, { test: 'data' });
      const account = await this.user.institutions.getOne('test');
      expect(account).toEqual({ test: 'data' });
      expect(this.userApiMock.history.get[0].url).toBe('/institutions/test');
    });

    test('should forward query params', async () => {
      this.userApiMock.onGet().reply(200, { test: 'data' });
      await this.user.institutions.getOne('test', { some: 'thing' });
      expect(this.userApiMock.history.get[0].url).toBe('/institutions/test?some=thing');
    });

    c.shouldValidateResourceId.bind(this)({
      message: 'account id',
      isUser: true,
      calls: [
        () => this.user.institutions.getOne(),
        () => this.user.institutions.getOne(1),
      ],
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.userApiMock.onGet('/institutions/test'),
      methodCall: () => this.user.institutions.getOne('test'),
    });

    c.shouldHandleTokenError.bind(this)({
      methodCall: () => this.user.institutions.getOne('test'),
    });
  });

  describe('.sync()', () => {
    test('should POST /institutions/:id/sync', async () => {
      this.userApiMock.onPost().reply(202, { test: 'data' });
      const account = await this.user.institutions.sync('test');
      expect(account).toEqual({ test: 'data' });
      expect(this.userApiMock.history.post[0].url).toBe('/institutions/test/sync');
    });

    c.shouldValidateResourceId.bind(this)({
      message: 'account id',
      isUser: true,
      calls: [
        () => this.user.institutions.sync(),
        () => this.user.institutions.sync(1),
      ],
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.userApiMock.onPost('/institutions/test/sync'),
      methodCall: () => this.user.institutions.sync('test'),
    });

    c.shouldHandleTokenError.bind(this)({
      methodCall: () => this.user.institutions.sync('test'),
    });
  });

  describe('.remove()', () => {
    test('should DELETE /institutions/:id', async () => {
      this.userApiMock.onDelete().reply(202);
      const account = await this.user.institutions.remove('test');
      expect(account).toBeUndefined(); // should not return anything on success
      expect(this.userApiMock.history.delete[0].url).toBe('/institutions/test');
    });

    c.shouldValidateResourceId.bind(this)({
      message: 'account id',
      isUser: true,
      calls: [
        () => this.user.institutions.remove(),
        () => this.user.institutions.remove(1),
      ],
    });

    c.shouldHandleResourceEndpointError.bind(this)({
      mockCall: () => this.userApiMock.onDelete('/institutions/test'),
      methodCall: () => this.user.institutions.remove('test'),
    });

    c.shouldHandleTokenError.bind(this)({
      methodCall: () => this.user.institutions.remove('test'),
    });
  });
});
