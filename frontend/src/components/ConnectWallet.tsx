import {
  FC,
  PointerEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useMetaMask } from "../hooks/useMetaMask";
import type {
  AddWalletAddress,
  ResetWallet,
  WalletAddress,
} from "../hooks/useWallet";

const HARDHAT_NETWORK_ID = "31337";

type Props = {
  addWalletAddress: AddWalletAddress;
  resetWallet: ResetWallet;
};

export const ConnectWallet: FC<Props> = ({ addWalletAddress, resetWallet }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState<
    WalletAddress | undefined
  >();

  const metaMask = useMetaMask();

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

      const walletAddress =
        Array.isArray(requestAccounts) && typeof requestAccounts[0] === "string"
          ? requestAccounts[0]
          : undefined;

      if (typeof walletAddress !== "string") {
        setErrorMessage("Could not find wallet address");
        return;
      }

      if (metaMask.networkVersion !== HARDHAT_NETWORK_ID) {
        setErrorMessage(
          "Please connect MetaMask to HardHat network on Localhost:8545"
        );
        return;
      }

      setWalletAddress(walletAddress);
    },
    [metaMask, setErrorMessage, setWalletAddress]
  );

  useEffect(() => {
    if (!metaMask || !walletAddress) return;
    console.log(metaMask);

    addWalletAddress(walletAddress);

    const onChainChanged = (addresses: unknown) => {
      resetWallet();

      const newWalletAddress =
        Array.isArray(addresses) && typeof addresses[0] === "string"
          ? addresses[0]
          : undefined;
      setWalletAddress(newWalletAddress);
    };

    const onAccountsChanged = () => {
      resetWallet();
    };

    const removeMetaMaskListeners = () => {
      metaMask.removeListener("accountsChanged", onAccountsChanged);
      metaMask.removeListener("chainChanged", onChainChanged);
    };

    removeMetaMaskListeners();

    metaMask.on("accountsChanged", onAccountsChanged);
    metaMask.on("chainChanged", onChainChanged);

    return () => {
      removeMetaMaskListeners();
    };
  }, [
    addWalletAddress,
    metaMask,
    resetWallet,
    setWalletAddress,
    walletAddress,
  ]);

  return (
    <div>
      <div>connect wallet</div>
      <button onClick={onClickConnect}>connect</button>
      {errorMessage ? <div>{errorMessage}</div> : null}
    </div>
  );
};
