/* eslint-disable @typescript-eslint/no-var-requires */
const CracoEsbuildPlugin = require('craco-esbuild')
const CracoLessPlugin = require('craco-less')

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#6777ef' },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
}
