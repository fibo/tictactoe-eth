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

describe("Tictactoe", function () {
  async function deployFixture() {
    const [owner, player1, player2, otherAccount] = await ethers.getSigners();

    const Tictactoe = await ethers.getContractFactory("Tictactoe");
    const tictactoe = await Tictactoe.deploy();

    return { tictactoe, owner, player1, player2, otherAccount };
  }

  async function startGameFixture() {
    const [owner, player1, player2, otherAccount] = await ethers.getSigners();

    const Tictactoe = await ethers.getContractFactory("Tictactoe");
    const tictactoe = await Tictactoe.deploy();

    await tictactoe.connect(player1).join();
    await tictactoe.connect(player2).join();

    return { tictactoe, owner, player1, player2, otherAccount };
  }

  describe("Deployment", function () {
    it("starts with default status", async function () {
      const { tictactoe } = await loadFixture(deployFixture);
      expect(await tictactoe.gameStatus()).to.equal(WaitingForPlayerOne);
    });
  });

  describe("join()", function () {
    it("update status to WaitingForPlayerTwo on first join", async function () {
      const { tictactoe, player1 } = await loadFixture(deployFixture);
      await tictactoe.connect(player1).join();
      expect(await tictactoe.gameStatus()).to.equal(WaitingForPlayerTwo);
    });

    it("update status to Playing on second join", async function () {
      const { tictactoe, player1, player2 } = await loadFixture(deployFixture);
      await tictactoe.connect(player1).join();
      await tictactoe.connect(player2).join();
      expect(await tictactoe.gameStatus()).to.equal(Playing);
    });

    it("does not allow to play againt your self", async function () {
      const { tictactoe, player1 } = await loadFixture(deployFixture);
      await tictactoe.connect(player1).join();
      await expect(
        tictactoe.connect(player1).join()
      ).to.be.revertedWithCustomError(
        tictactoe,
        error.CannotPlayAgainstYourSelf
      );
    });

    it("does not allow a third player to join", async function () {
      const { tictactoe, player1, player2, otherAccount } = await loadFixture(
        deployFixture
      );
      await tictactoe.connect(player1).join();
      await tictactoe.connect(player2).join();
      await expect(
        tictactoe.connect(otherAccount).join()
      ).to.be.revertedWithCustomError(
        tictactoe,
        error.CannotJoinGameWhilePlaying
      );
    });
  });

  describe("move()", function () {
    it("cannot be called if not playing", async function () {
      const { tictactoe, player1, player2 } = await loadFixture(deployFixture);
      await tictactoe.connect(player1).join();
      await expect(
        tictactoe.connect(player2).move(Space1)
      ).to.be.revertedWithCustomError(tictactoe, error.CannotMoveNow);
    });

    it("does not allow to choose the same space twice", async function () {
      const { tictactoe, player1, player2 } = await loadFixture(
        startGameFixture
      );
      await tictactoe.connect(player1).move(Space1);
      await expect(
        tictactoe.connect(player2).move(Space1)
      ).to.be.revertedWithCustomError(
        tictactoe,
        error.GridPositionAlreadyTaken
      );
    });

    it("checks that player moves during his/her turn", async function () {
      const { tictactoe, player1, player2 } = await loadFixture(
        startGameFixture
      );
      await tictactoe.connect(player1).move(Space1);
      await tictactoe.connect(player2).move(Space2);
      await expect(
        tictactoe.connect(player2).move(Space3)
      ).to.be.revertedWithCustomError(tictactoe, error.CannotMoveNow);
    });

    it("does not allow to move players other than player1 and player2", async function () {
      const { tictactoe, player1, player2, otherAccount } = await loadFixture(
        startGameFixture
      );
      await tictactoe.connect(player1).move(Space1);
      await tictactoe.connect(player2).move(Space2);
      await expect(
        tictactoe.connect(otherAccount).move(Space3)
      ).to.be.revertedWithCustomError(tictactoe, error.CannotMoveNow);
    });
  });

  describe("Game", function () {
    it("win with combination [0, 1, 2]", async function () {
      const { tictactoe, player1, player2 } = await loadFixture(
        startGameFixture
      );
      await tictactoe.connect(player1).move(Space0);
      await tictactoe.connect(player2).move(Space7);
      await tictactoe.connect(player1).move(Space1);
      await tictactoe.connect(player2).move(Space8);
      await tictactoe.connect(player1).move(Space2);
      expect(await tictactoe.gameStatus()).to.equal(WaitingForPlayerOne);
    });
  });
});
