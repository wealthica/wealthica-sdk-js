const { getQueryString } = require('../utils');

class Transactions {
  constructor(api) {
    this.api = api.userApi;
  }

  async getList(options = {}) {
    let url = '/transactions';

    const institutions = options.institutions || [];

    // Add institutionId for backward compatibility
    if (options.institutionId && !institutions.includes(options.institutionId)) {
      institutions.push(options.institutionId);
    }

    // eslint-disable-next-line no-param-reassign
    delete options.institutionId;

    const query = getQueryString({
      ...options,
      institutions,
    });

    if (query) url = `${url}?${query}`;

    const response = await this.api.get(url);
    if (!response.ok) throw response.originalError;

    return response.data;
  }

  async getOne(options = {}) {
    const { txId, ...params } = options;

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
