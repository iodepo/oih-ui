const configurations =
    { defaults: require('./defaults')
    };

const config = configurations.defaults || {};

config.default.dataServiceUrl = process.env.REACT_APP_DATA_SERVICE_URL || 'http://localhost:8000';
export const { dataServiceUrl } = config.default;
