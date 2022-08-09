import { FC, PointerEventHandler, useCallback, useState } from "react";
import { MetaMaskInpageProvider } from "../hooks/useMetaMask";
import type {
  AddWalletAddress,
  ResetWallet,
  WalletAddress,
} from "../hooks/useWallet";

const HARDHAT_NETWORK_ID = "31337";

type Props = {
  addWalletAddress: AddWalletAddress;
  metaMask: MetaMaskInpageProvider | undefined;
  resetWallet: ResetWallet;
  setErrorMessage: (_: string) => void;
  walletAddress?: WalletAddress;
};

export const ConnectWallet: FC<Props> = ({
  addWalletAddress,
  metaMask,
  setErrorMessage,
  walletAddress,
}) => {
  const onClickConnect = useCallback<PointerEventHandler<HTMLButtonElement>>(
    async (event) => {
      event.stopPropagation();
      setErrorMessage("");

      if (!metaMask) {
        setErrorMessage(
          "No Ethereum wallet was detected. Please install MetaMask"
        );
        return;
      }

      const requestAccounts = await metaMask.request({
        method: "eth_requestAccounts",
      });

      const newWalletAddress =
        Array.isArray(requestAccounts) && typeof requestAccounts[0] === "string"
          ? requestAccounts[0]
          : undefined;

      if (typeof newWalletAddress !== "string") {
        setErrorMessage("Could not find wallet address");
        return;
      }

      if (metaMask.networkVersion !== HARDHAT_NETWORK_ID) {
        setErrorMessage(
          "Please connect MetaMask to HardHat network on Localhost:8545"
        );
        return;
      }

      addWalletAddress(newWalletAddress);
    },
    [addWalletAddress, metaMask, setErrorMessage]
  );

  if (walletAddress) return null;

  return (
    <div>
      <div>connect wallet</div>
      <button onClick={onClickConnect}>connect</button>
    </div>
  );
};
