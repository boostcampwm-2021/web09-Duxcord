const CracoAlias = require('craco-alias');

module.exports = {
  babel: {
    presets: [['@babel/preset-env'], ['@babel/preset-react']],
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        tsConfigPath: 'tsconfig.paths.json',
      },
    },
  ],
};
