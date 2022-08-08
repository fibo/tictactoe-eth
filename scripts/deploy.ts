import path from "path";
import fs from "fs/promises";
import { artifacts, ethers, network } from "hardhat";

const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
const contractAddressJsonFilepath = path.join(
  contractsDir,
  "contractAddress.json"
);
const contractArtifactJsonFilepath = path.join(
  contractsDir,
  "contractArtifact.json"
);

const CONTRACT_NAME = "TictactoeGame";

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  console.info("Deploying the contracts with the account:", deployerAddress);

  const Contract = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = await Contract.deploy();
  await contract.deployed();
  const contractAddress = contract.address;
  console.info("Contract address:", contractAddress);

  await fs.writeFile(
    contractAddressJsonFilepath,
    JSON.stringify(contractAddress)
  );

  const contractArtifact = artifacts.readArtifactSync(CONTRACT_NAME);
  await fs.writeFile(
    contractArtifactJsonFilepath,
    JSON.stringify(contractArtifact)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
