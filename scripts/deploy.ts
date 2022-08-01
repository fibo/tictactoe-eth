import { ethers } from "hardhat";

async function main() {
  const Tictactoe = await ethers.getContractFactory("Tictactoe");
  const game = await Tictactoe.deploy();

  await game.deployed();

  console.log("Tictactoe deployed to:", game.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
