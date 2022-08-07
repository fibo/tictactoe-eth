import { ConnectWallet } from "./components/ConnectWallet";
import { Tictactoe } from "./components/Tictactoe";
import { useWallet } from "./hooks/useWallet";

export default function App() {
  const { addWalletAddress, resetWallet, walletAddress } = useWallet();

  if (!walletAddress)
    return (
      <ConnectWallet
        addWalletAddress={addWalletAddress}
        resetWallet={resetWallet}
      />
    );

  return <Tictactoe walletAddress={walletAddress} />;
}
