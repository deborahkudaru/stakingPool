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
    const [owner, otherAccount, account1, account2] =
      await hre.ethers.getSigners();

    const { beeTok } = await deployBeeToken();

    const { booTok } = await deployBooToken();

    const Stake = await hre.ethers.getContractFactory("Stake");
    const stake = await Stake.deploy(beeTok, booTok);

    return { stake, beeTok, booTok, owner, otherAccount, account1, account2 };
  }

  describe("Deployment", function () {
    it("Should send contract tokens successfully", async function () {
      const { stake, owner, beeTok, booTok, account1, account2 } =
        await loadFixture(deployStake);

      const stakeAmount = hre.ethers.parseUnits("200", 18);

      await beeTok.approve(stake, stakeAmount);

      await booTok.approve(stake, stakeAmount);

      await stake.stakeTokens(stakeAmount, stakeAmount);

      expect(await beeTok.balanceOf(stake)).to.eq(stakeAmount);
      expect(await booTok.balanceOf(stake)).to.eq(stakeAmount);
    });

    it("Should stake tokens successfully", async function () {
      const { stake, owner, beeTok, booTok, account1, account2 } =
        await loadFixture(deployStake);

      const stakeAmount = hre.ethers.parseUnits("200", 18);
      const stakeCoinAmount = hre.ethers.parseUnits("10", 18);

      await beeTok.approve(stake, stakeAmount);
      await booTok.approve(stake, stakeAmount);

      await stake.stakeTokens(stakeAmount, stakeAmount);

      await beeTok.transfer(account1, stakeCoinAmount);
      await booTok.transfer(account1, stakeCoinAmount);

      await beeTok.transfer(account2, stakeCoinAmount);
      await booTok.transfer(account2, stakeCoinAmount);

      const balance1 = await beeTok.balanceOf(account1.address);
      console.log("Account1 BeeToken Balance:", balance1);

      await beeTok.connect(account1).approve(stake, stakeCoinAmount);
      await booTok.connect(account1).approve(stake, stakeCoinAmount);

      await beeTok.connect(account2).approve(stake, stakeCoinAmount);
      await booTok.connect(account2).approve(stake, stakeCoinAmount);

      await stake
        .connect(account1)
        .stakeTokens(stakeCoinAmount, stakeCoinAmount);

      expect(await stake.beeStakers(account1)).to.equal(
        stakeCoinAmount
      );
      expect(await stake.booStakers(account1)).to.equal(
        stakeCoinAmount
      );

      await stake
      .connect(account2)
      .stakeTokens(stakeCoinAmount, stakeCoinAmount);

    expect(await stake.beeStakers(account2)).to.equal(
      stakeCoinAmount
    );
    expect(await stake.booStakers(account2)).to.equal(
      stakeCoinAmount
    );
    });

    it("Should unstake tokens successfully", async function () {
      const { stake, owner, beeTok, booTok, account1, account2 } =
        await loadFixture(deployStake);

      const stakeAmount = hre.ethers.parseUnits("200", 18);
      const stakeCoinAmount = hre.ethers.parseUnits("10", 18);

      await beeTok.approve(stake, stakeAmount);
      await booTok.approve(stake, stakeAmount);

      await stake.stakeTokens(stakeAmount, stakeAmount);

      await beeTok.transfer(account1, stakeCoinAmount);
      await booTok.transfer(account1, stakeCoinAmount);

      const balance = await beeTok.balanceOf(account1.address);

      await beeTok.connect(account1).approve(stake, stakeCoinAmount);
      await booTok.connect(account1).approve(stake, stakeCoinAmount);

      await stake
        .connect(account1)
        .stakeTokens(stakeCoinAmount, stakeCoinAmount);

      await stake
        .connect(account1)
        .unstakeTokens(stakeCoinAmount, stakeCoinAmount);

    });
  });
});
