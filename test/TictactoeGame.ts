import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployArtifact } from "./utils";
import { LIBRARY_NAME } from "./TictactoeUtils";
import {
  GameStatus,
  GridPosition,
} from "../frontend/src/contracts/TictactoeGame";

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

const CONTRACT_NAME = "TictactoeGame";

const deployContract = async () => {
  const deployLibrary = deployArtifact(LIBRARY_NAME);
  const library = await deployLibrary();
  const deploy = deployArtifact(CONTRACT_NAME, {
    libraries: { [LIBRARY_NAME]: library.address },
  });
  const contract = await deploy();
  return contract;
};

describe(CONTRACT_NAME, () => {
  async function deployFixture() {
    const [owner, player1, player2, otherAccount] = await ethers.getSigners();
    const contract = await deployContract();
    return { contract, owner, player1, player2, otherAccount };
  }

  async function startGameFixture() {
    const [owner, player1, player2, otherAccount] = await ethers.getSigners();

    const contract = await deployContract();

    await contract.connect(player1).join();
    await contract.connect(player2).join();

    return { contract, owner, player1, player2, otherAccount };
  }

  describe("Deployment", () => {
    it("starts with default status", async () => {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.gameStatus()).to.equal(
        GameStatus.WaitingForPlayerOne
      );
    });
  });

  describe("join()", () => {
    it("update status to WaitingForPlayerTwo  and emit event on first join", async () => {
      const { contract, player1 } = await loadFixture(deployFixture);
      await expect(await contract.connect(player1).join())
        .to.emit(contract, event.GameStatusChange)
        .withArgs(GameStatus.WaitingForPlayerTwo);
      expect(await contract.gameStatus()).to.equal(
        GameStatus.WaitingForPlayerTwo
      );
    });

    it("update status to Playing and emit event on second join", async () => {
      const { contract, player1, player2 } = await loadFixture(deployFixture);
      await contract.connect(player1).join();
      await expect(await contract.connect(player2).join())
        .to.emit(contract, event.GameStatusChange)
        .withArgs(GameStatus.Playing);
      expect(await contract.gameStatus()).to.equal(GameStatus.Playing);
    });

    it("does not allow to play againt your self", async () => {
      const { contract, player1 } = await loadFixture(deployFixture);
      await contract.connect(player1).join();
      await expect(
        contract.connect(player1).join()
      ).to.be.revertedWithCustomError(
        contract,
        error.CannotPlayAgainstYourSelf
      );
    });

    it("does not allow a third player to join", async () => {
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

  describe("move()", () => {
    it("cannot be called if not playing", async () => {
      const { contract, player1, player2 } = await loadFixture(deployFixture);
      await contract.connect(player1).join();
      await expect(
        contract.connect(player2).move(GridPosition.Space1)
      ).to.be.revertedWithCustomError(contract, error.CannotMoveNow);
    });

    it("does not allow to choose the same space twice", async () => {
      const { contract, player1, player2 } = await loadFixture(
        startGameFixture
      );
      await contract.connect(player1).move(GridPosition.Space1);
      await expect(
        contract.connect(player2).move(GridPosition.Space1)
      ).to.be.revertedWithCustomError(contract, error.GridPositionAlreadyTaken);
    });

    it("checks that player moves during his/her turn", async () => {
      const { contract, player1, player2 } = await loadFixture(
        startGameFixture
      );
      await contract.connect(player1).move(GridPosition.Space1);
      await contract.connect(player2).move(GridPosition.Space2);
      await expect(
        contract.connect(player2).move(GridPosition.Space3)
      ).to.be.revertedWithCustomError(contract, error.CannotMoveNow);
    });

    it("does not allow to move players other than player1 and player2", async () => {
      const { contract, player1, player2, otherAccount } = await loadFixture(
        startGameFixture
      );
      await contract.connect(player1).move(GridPosition.Space1);
      await contract.connect(player2).move(GridPosition.Space2);
      await expect(
        contract.connect(otherAccount).move(GridPosition.Space3)
      ).to.be.revertedWithCustomError(contract, error.CannotMoveNow);
    });
  });

  describe("Game", () => {
    it("win with combination [0, 1, 2]", async () => {
      const { contract, player1, player2 } = await loadFixture(
        startGameFixture
      );
      await contract.connect(player1).move(GridPosition.Space0);
      await contract.connect(player2).move(GridPosition.Space7);
      await contract.connect(player1).move(GridPosition.Space1);
      await contract.connect(player2).move(GridPosition.Space8);
      await expect(await contract.connect(player1).move(GridPosition.Space2))
        .to.emit(contract, event.Winner)
        .withArgs(player1.address);
      expect(await contract.gameStatus()).to.equal(
        GameStatus.WaitingForPlayerOne
      );
    });
  });
});
