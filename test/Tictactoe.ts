import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const WaitingForPlayerOne = 0;
const WaitingForPlayerTwo = 1;
const Playing = 2;

const Space0 = 0;
const Space1 = 1;
const Space2 = 2;
const Space3 = 3;
const Space4 = 4;
const Space5 = 5;
const Space6 = 6;
const Space7 = 7;
const Space8 = 8;

const error = {
  CannotPlayAgainstYourSelf: "CannotPlayAgainstYourSelf",
  CannotJoinGameWhilePlaying: "CannotJoinGameWhilePlaying",
  GridPositionAlreadyTaken: "GridPositionAlreadyTaken",
  CannotMoveNow: "CannotMoveNow",
};

const event = {
  GameStatusChange: "GameStatusChange",
  Join: "Join",
  Winner: "Winner",
};

const CONTRACT_NAME = "Tictactoe";

const deployContract = (contractName: string) => async () => {
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy();
  return contract;
};

const getContract = deployContract(CONTRACT_NAME);

describe(CONTRACT_NAME, function () {
  async function deployFixture() {
    const [owner, player1, player2, otherAccount] = await ethers.getSigners();
    const contract = await getContract();
    return { contract, owner, player1, player2, otherAccount };
  }

  async function startGameFixture() {
    const [owner, player1, player2, otherAccount] = await ethers.getSigners();

    const contract = await getContract();

    await contract.connect(player1).join();
    await contract.connect(player2).join();

    return { contract, owner, player1, player2, otherAccount };
  }

  describe("Deployment", function () {
    it("starts with default status", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.gameStatus()).to.equal(WaitingForPlayerOne);
    });
  });

  describe("join()", function () {
    it("update status to WaitingForPlayerTwo  and emit event on first join", async function () {
      const { contract, player1 } = await loadFixture(deployFixture);
      await expect(await contract.connect(player1).join())
        .to.emit(contract, event.GameStatusChange)
        .withArgs(WaitingForPlayerTwo);
      expect(await contract.gameStatus()).to.equal(WaitingForPlayerTwo);
    });

    it("update status to Playing and emit event on second join", async function () {
      const { contract, player1, player2 } = await loadFixture(deployFixture);
      await contract.connect(player1).join();
      await expect(await contract.connect(player2).join())
        .to.emit(contract, event.GameStatusChange)
        .withArgs(Playing);
      expect(await contract.gameStatus()).to.equal(Playing);
    });

    it("does not allow to play againt your self", async function () {
      const { contract, player1 } = await loadFixture(deployFixture);
      await contract.connect(player1).join();
      await expect(
        contract.connect(player1).join()
      ).to.be.revertedWithCustomError(
        contract,
        error.CannotPlayAgainstYourSelf
      );
    });

    it("does not allow a third player to join", async function () {
      const { contract, player1, player2, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.connect(player1).join();
      await contract.connect(player2).join();
      await expect(
        contract.connect(otherAccount).join()
      ).to.be.revertedWithCustomError(
        contract,
        error.CannotJoinGameWhilePlaying
      );
    });
  });

  describe("move()", function () {
    it("cannot be called if not playing", async function () {
      const { contract, player1, player2 } = await loadFixture(deployFixture);
      await contract.connect(player1).join();
      await expect(
        contract.connect(player2).move(Space1)
      ).to.be.revertedWithCustomError(contract, error.CannotMoveNow);
    });

    it("does not allow to choose the same space twice", async function () {
      const { contract, player1, player2 } = await loadFixture(
        startGameFixture
      );
      await contract.connect(player1).move(Space1);
      await expect(
        contract.connect(player2).move(Space1)
      ).to.be.revertedWithCustomError(contract, error.GridPositionAlreadyTaken);
    });

    it("checks that player moves during his/her turn", async function () {
      const { contract, player1, player2 } = await loadFixture(
        startGameFixture
      );
      await contract.connect(player1).move(Space1);
      await contract.connect(player2).move(Space2);
      await expect(
        contract.connect(player2).move(Space3)
      ).to.be.revertedWithCustomError(contract, error.CannotMoveNow);
    });

    it("does not allow to move players other than player1 and player2", async function () {
      const { contract, player1, player2, otherAccount } = await loadFixture(
        startGameFixture
      );
      await contract.connect(player1).move(Space1);
      await contract.connect(player2).move(Space2);
      await expect(
        contract.connect(otherAccount).move(Space3)
      ).to.be.revertedWithCustomError(contract, error.CannotMoveNow);
    });
  });

  describe("isWinCombination", async function () {
    it("works", async function () {
      const { contract } = await loadFixture(startGameFixture);

      expect(await contract.isWinCombination(0, 1, 2)).to.be.true;
      expect(await contract.isWinCombination(0, 4, 8)).to.be.true;
      expect(await contract.isWinCombination(0, 3, 6)).to.be.true;
      expect(await contract.isWinCombination(1, 4, 7)).to.be.true;
      expect(await contract.isWinCombination(2, 4, 6)).to.be.true;
      expect(await contract.isWinCombination(2, 5, 8)).to.be.true;
      expect(await contract.isWinCombination(3, 4, 5)).to.be.true;
      expect(await contract.isWinCombination(6, 7, 8)).to.be.true;
    });
  });

  describe("Game", function () {
    it("win with combination [0, 1, 2]", async function () {
      const { contract, player1, player2 } = await loadFixture(
        startGameFixture
      );
      await contract.connect(player1).move(Space0);
      await contract.connect(player2).move(Space7);
      await contract.connect(player1).move(Space1);
      await contract.connect(player2).move(Space8);
      await expect(await contract.connect(player1).move(Space2))
        .to.emit(contract, event.Winner)
        .withArgs(player1.address);
      expect(await contract.gameStatus()).to.equal(WaitingForPlayerOne);
    });
  });
});
