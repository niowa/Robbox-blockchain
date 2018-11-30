var Store = artifacts.require("./FilesStore.sol");
let getConfig = require('../config.js');

module.exports = function(deployer, network, accounts) {
  config = getConfig(accounts);
  deployer.then(function () {
    return Store.deployed();
  })
  .then(function (deployedStore) {
    return deployedStore.setAdminAddress(config.addminAddress, config.options);
  })
};
