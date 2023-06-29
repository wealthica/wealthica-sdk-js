const { getQueryString } = require('../utils');

class Transactions {
  constructor(api) {
    this.api = api.userApi;
  }

  async getList(options = {}) {
    const { institutionId, ...params } = options;

    if (!institutionId || typeof institutionId !== 'string') {
      throw new Error('Please provide a valid Wealthica institution id.');
    }

    let url = `/transactions?institutions=${institutionId}`;
    const query = getQueryString(params);
    if (query) url = `${url}?${query}`;

    const response = await this.api.get(url);
    if (!response.ok) throw response.originalError;

    return response.data;
  }

  async getOne(options = {}) {
    const { institutionId, txId, ...params } = options;

    if (!institutionId || typeof institutionId !== 'string') {
      throw new Error('Please provide a valid Wealthica institution id.');
    }
    if (!txId || typeof txId !== 'string') {
      throw new Error('Please provide a valid Wealthica transaction id.');
    }

    let url = `/transactions/${txId}`;
    const query = getQueryString(params);
    if (query) url = `${url}?${query}`;

    const response = await this.api.get(url);
    if (!response.ok) throw response.originalError;

    return response.data;
  }
}

module.exports = Transactions;
