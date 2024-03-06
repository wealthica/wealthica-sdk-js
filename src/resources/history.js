const { getQueryString } = require('../utils');

class History {
  constructor(api) {
    this.api = api.userApi;
  }

  async getList(options = {}) {
    let url = '/history';
    const query = getQueryString(options);
    if (query) url = `${url}?${query}`;

    const response = await this.api.get(url);
    if (!response.ok) throw response.originalError;

    return response.data;
  }
}

module.exports = History;
