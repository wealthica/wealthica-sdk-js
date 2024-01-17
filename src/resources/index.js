/* eslint-disable global-require */
const RESOURCES = {
  institutions: require('./institutions'),
  history: require('./history'),
  providers: require('./providers'),
  teams: require('./teams'),
  transactions: require('./transactions'),
  positions: require('./positions'),
};

module.exports = function createResources(api, resources) {
  return resources.reduce((res, resource) => {
    res[resource] = new RESOURCES[resource](api);
    return res;
  }, {});
};
