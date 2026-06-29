const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const mocks = {
  'react-native-iap': path.resolve(__dirname, 'src/mocks/react-native-iap.ts'),
  'react-native-nitro-modules': path.resolve(__dirname, 'src/mocks/react-native-nitro-modules.ts'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (mocks[moduleName]) {
    return { filePath: mocks[moduleName], type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
