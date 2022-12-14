import { ethers } from "ethers";
import contractArtifact from "../contracts/TictactoeGameArtifact.json";
import contractAddress from "../contracts/TictactoeGameAddress.json";
import type { WalletAddress } from "./useWallet";

export const useTictactoe = (walletAddress?: WalletAddress) => {
  if (!walletAddress) return;

  const ethereum = global?.window?.ethereum;
  if (!ethereum || !walletAddress) return;

  const provider = new ethers.providers.Web3Provider(ethereum);

  const contract = new ethers.Contract(
    contractAddress,
    contractArtifact.abi,
    provider.getSigner(0)
  );

  return contract;
};
