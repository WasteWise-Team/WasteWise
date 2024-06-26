module.exports = function(api) {
  api.cache(true);
  // module.exports = {
  //   presets: ['module:metro-react-native-babel-preset'],
  //   plugins: ['react-native-reanimated/plugin'],
  // };
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env",
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      }]
    ]
  };
};