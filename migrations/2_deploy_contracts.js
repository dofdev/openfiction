var Monolith = artifacts.require("./contracts/Monolith.sol");

module.exports = function (deployer) {
  deployer.deploy(Monolith);
};