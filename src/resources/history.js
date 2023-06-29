const { getQueryString } = require('../utils');

class History {
  constructor(api) {
    this.api = api.userApi;
  }

  async getList(options = {}) {
    const { institutionId, ...params } = options;

    if (!institutionId || typeof institutionId !== 'string') {
      throw new Error('Please provide a valid Wealthica institution id.');
    }

    let url = `/institutions/${institutionId}/history`;
    const query = getQueryString(params);
    if (query) url = `${url}?${query}`;

    const response = await this.api.get(url);
    if (!response.ok) throw response.originalError;

    return response.data;
  }
}

module.exports = History;
