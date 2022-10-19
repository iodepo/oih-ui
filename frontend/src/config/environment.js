const configurations =
    { defaults: require('./defaults')
    };

const config = configurations.defaults || {};

config.default.dataServiceUrl = process.env.REACT_APP_DATA_SERVICE_URL || 'http://localhost:8000';
config.default.environment = process.env.NODE_ENV;

export const { appTitle,
               appShortTitle,
               appDescription,
               dataServiceUrl,
               mapboxAccessToken,
               basemapStyleLink,
               environment,
             } = config.default;
