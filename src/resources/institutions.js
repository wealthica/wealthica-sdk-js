const { getQueryString } = require('../utils');

class Institutions {
  constructor(api) {
    this.api = api.userApi;
  }

  async getList(params = {}) {
    let url = '/institutions';
    const query = getQueryString(params);
    if (query) url = `${url}?${query}`;

    const response = await this.api.get(url);
    if (!response.ok) throw response.originalError;

    return response.data;
  }

  async getOne(id, params = {}) {
    if (!id || typeof id !== 'string') throw new Error('Please provide a valid Wealthica institution id.');

    let url = `/institutions/${id}`;
    const query = getQueryString(params);
    if (query) url = `${url}?${query}`;

    const response = await this.api.get(url);
    if (!response.ok) throw response.originalError;

    return response.data;
  }

  async sync(id) {
    if (!id || typeof id !== 'string') throw new Error('Please provide a valid Wealthica institution id.');

    const response = await this.api.post(`/institutions/${id}/sync`, {});
    if (!response.ok) throw response.originalError;

    return response.data;
  }

  async remove(id) {
    if (!id || typeof id !== 'string') throw new Error('Please provide a valid Wealthica institution id.');

    const response = await this.api.delete(`/institutions/${id}`);
    if (!response.ok) throw response.originalError;
  }
}

module.exports = Institutions;
