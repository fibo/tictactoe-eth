import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Tictactoe", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Tictactoe = await ethers.getContractFactory("Tictactoe");
    const game = await Tictactoe.deploy();

    return { game, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { game, owner } = await loadFixture(deployFixture);

      expect(await game.owner()).to.equal(owner.address);
    });
  });
});
