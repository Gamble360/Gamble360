const hiLo = artifacts.require("gamble360/HI_LO");
const rockPaperScissor = artifacts.require("gamble360/ROCK_PAPER_SCISSORS");
const lottery = artifacts.require("gamble360/LOTTERY");
module.exports = function (deployer) {
  deployer.deploy(hiLo);
  deployer.deploy(rockPaperScissor);
  deployer.deploy(lottery);
};
