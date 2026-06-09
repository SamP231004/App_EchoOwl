const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add path aliases support
const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname);

config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => path.join(workspaceRoot, `node_modules/${name}`),
  }
);

module.exports = config;
