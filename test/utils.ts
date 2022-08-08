import { ethers } from "hardhat";

// Copied partially from @nomiclabs/hardhat-ethers
type FactoryOptions = {
  libraries?: { [libraryName: string]: string };
};

export const deployArtifact =
  (name: string, options?: FactoryOptions) => async () => {
    const Artifact = await ethers.getContractFactory(name, options);
    const artifact = await Artifact.deploy();
    return artifact;
  };
