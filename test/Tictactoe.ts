import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const WaitingForPlayerOne = 0;
const WaitingForPlayerTwo = 1;
const Playing = 2;

describe("Tictactoe", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Tictactoe = await ethers.getContractFactory("Tictactoe");
    const contract = await Tictactoe.deploy();

    return { contract, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("starts with default status", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.status()).to.equal(WaitingForPlayerOne);
    });
  });

  describe("join()", function () {
    it("update status to WaitingForPlayerTwo on first join", async function () {
      const { contract } = await loadFixture(deployFixture);
      await contract.join();
      expect(await contract.status()).to.equal(WaitingForPlayerTwo);
    });

    it("update status to Playing on second join", async function () {
      const { contract } = await loadFixture(deployFixture);
      await contract.join();
      await contract.join();
      expect(await contract.status()).to.equal(Playing);
    });
  });
});
