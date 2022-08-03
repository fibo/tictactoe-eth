import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const WaitingForPlayerOne = 0;
const WaitingForPlayerTwo = 1;
const Playing = 2;

const error = {
  CannotPlayAgainstYourSelf: "CannotPlayAgainstYourSelf",
  CannotJoinGameWhilePlaying: "CannotJoinGameWhilePlaying",
  GridPositionAlreadyTaken: "GridPositionAlreadyTaken",
  NotPlaying: "NotPlaying",
  NotYourTurn: "NotYourTurn",
};

describe("Tictactoe", function () {
  async function deployFixture() {
    const [owner, player1, player2, otherAccount] = await ethers.getSigners();

    const Tictactoe = await ethers.getContractFactory("Tictactoe");
    const tictactoe = await Tictactoe.deploy();

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
});
