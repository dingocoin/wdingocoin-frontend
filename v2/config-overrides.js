const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add comprehensive polyfills
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    vm: require.resolve('vm-browserify'),
    process: require.resolve('process/browser'),
  };

  // Add aliases to handle specific resolution issues
  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': require.resolve('process/browser'),
    'process/browser.js': require.resolve('process/browser'),
  };

  // Ignore source map warnings
  if (!config.ignoreWarnings) {
    config.ignoreWarnings = [];
  }
  config.ignoreWarnings.push(/Failed to parse source map/);

  // Add Buffer and process polyfills
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  // Ensure proper module resolution for both .mjs and .js files
  config.module.rules.push({
    test: /\.(js|mjs)$/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Handle specific packages that have ESM issues
  config.module.rules.push({
    test: /node_modules\/@rainbow-me\/rainbowkit\/.*\.js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  config.module.rules.push({
    test: /node_modules\/@reown\/.*\.js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
}; 