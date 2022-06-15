const configurations =
    { defaults: require('./defaults')
    };

const config = configurations.defaults || {};

config.default.dataServiceUrl = 'http://oih.staging.derilinx.com:8000/';
export const { dataServiceUrl } = config.default;
