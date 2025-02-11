import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Stake", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  async function deployBeeToken() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await hre.ethers.getSigners();

    const BeeToken = await hre.ethers.getContractFactory("BeeToken");
    const beeTok = await BeeToken.deploy();

    return { beeTok };
  }

  async function deployBooToken() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await hre.ethers.getSigners();

    const BooToken = await hre.ethers.getContractFactory("BooToken");
    const booTok = await BooToken.deploy();

    return { booTok };
  }

  async function deployStake() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, account1, account2] = await hre.ethers.getSigners();

    const { beeTok } = await deployBeeToken();

    const { booTok } = await deployBooToken();

    const Stake = await hre.ethers.getContractFactory("Stake");
    const stake = await Stake.deploy(beeTok, booTok);

    return { stake, beeTok, booTok, owner, otherAccount, account1, account2 };
  }

  describe("Deployment", function () {
    it("Should balance of", async function () {
      const { stake, owner, beeTok, booTok, account1, account2 } = await loadFixture(
        deployStake
      );

      const stakeAmount = hre.ethers.parseUnits("200", 18);

      await beeTok.approve(stake, stakeAmount);

      await booTok.approve(stake, stakeAmount);

      await stake.stakeTokens(stakeAmount, stakeAmount);

      expect(await beeTok.balanceOf(stake)).to.eq(stakeAmount);

    });
  });
});
