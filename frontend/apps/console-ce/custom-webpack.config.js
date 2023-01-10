const { merge } = require('webpack-merge');
const util = require('util');
const webpack = require('webpack');

const log = value =>
  console.log(
    util.inspect(value, { showHidden: false, depth: null, colors: true })
  );

module.exports = (config, context) => {
  const output = merge(config, {
    output: {
      publicPath: 'auto',
    },
    plugins: [
      new webpack.DefinePlugin({
        __CLIENT__: 'true',
        __SERVER__: false,
        __DEVELOPMENT__: true,
        __DEVTOOLS__: true, // <-------- DISABLE redux-devtools HERE
        CONSOLE_ASSET_VERSION: Date.now().toString(),
      }),
    ],
    module: {
      rules: [
        /*
        Rule taken from the old codebase
        => Do we still need the version naming ?

         */
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: { limit: 10000, mimetype: 'image/svg+xml' },
            },
          ],
        },
      ],
    },
    resolve: {
      fallback: {
        /*
        Used by :
        openapi-to-graphql and it's deps (graphql-upload > fs-capacitor)
        no real polyfill exists, so this turns it into an empty implementation
         */
        fs: false,
        /*
        Used by :
        openapi-to-graphql and it's deps (graphql-upload > fs-capacitor)
         */
        os: require.resolve('os-browserify/browser'),

        /*
        Used by :
        openapi-to-graphql and it's deps (swagger2openapi)
         */
        http: require.resolve('stream-http'),
        /*
        Used by :
        @graphql-codegen/typescript and it's deps (@graphql-codegen/visitor-plugin-common && parse-filepath)
        => one usage is found, so we have to check if the usage is still relevant
         */
        path: require.resolve('path-browserify'),
        /*
        Used by :
        jsonwebtoken deps (jwa && jws)
        => we already have an equivalent in the codebases that don't depend on it,jwt-decode.
           Might be worth using only the latter
         */
        crypto: require.resolve('crypto-browserify'),
        /*
        Used by :
        jsonwebtoken deps (jwa && jws)
        @graphql-tools/merge => dependanci of graphiql & graphql-codegen/core, a package upgrade might fix it
         */
        util: require.resolve('util/'),
        /*
        Used by :
        jsonwebtoken deps (jwa && jws)
         */
        stream: require.resolve('stream-browserify'),
      },
    },
  });
  return output;
};
