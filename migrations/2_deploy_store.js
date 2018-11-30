var Store = artifacts.require("./FilesStore.sol");
let getConfig = require('../config.js');

module.exports = function(deployer, network, accounts) {
  config = getConfig(accounts);
  deployer.deploy(Store, config.options);
};
