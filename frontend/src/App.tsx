import { useCallback, useEffect, useState } from "react";
import { ConnectWallet } from "./components/ConnectWallet";
import { Header } from "./components/Header";
import { Tictactoe } from "./components/Tictactoe";
import { useMetaMask } from "./hooks/useMetaMask";
import { useWallet } from "./hooks/useWallet";
import "./styles.css";

export default function App() {
  const { addWalletAddress, resetWallet, walletAddress } = useWallet();
  const { metaMask } = useMetaMask();
  console.log(walletAddress);

  const [errorMessage, setErrorMessage] = useState("");

  const onAccountsChanged = useCallback(() => {
    resetWallet();
  }, [resetWallet]);

  const onChainChanged = useCallback(
    (addresses: unknown) => {
      resetWallet();
      const newWalletAddress =
        Array.isArray(addresses) && typeof addresses[0] === "string"
          ? addresses[0]
          : undefined;
      if (typeof newWalletAddress !== "string") {
        setErrorMessage("Could not find wallet address");
        return;
      }
      addWalletAddress(newWalletAddress);
    },
    [resetWallet, addWalletAddress]
  );

  useEffect(() => {
    if (!metaMask || !walletAddress) return;

    metaMask.on("accountsChanged", onAccountsChanged);
    metaMask.on("chainChanged", onChainChanged);

    return () => {
      metaMask.removeListener("accountsChanged", onAccountsChanged);
      metaMask.removeListener("chainChanged", onChainChanged);
    };
  }, [
    addWalletAddress,
    metaMask,
    onAccountsChanged,
    onChainChanged,
    walletAddress,
  ]);

  return (
    <>
      <Header walletAddress={walletAddress} />
      <ConnectWallet
        addWalletAddress={addWalletAddress}
        metaMask={metaMask}
        resetWallet={resetWallet}
        setErrorMessage={setErrorMessage}
        walletAddress={walletAddress}
      />
      <Tictactoe walletAddress={walletAddress} />
      {errorMessage ? <div>{errorMessage}</div> : null}
    </>
  );
}
