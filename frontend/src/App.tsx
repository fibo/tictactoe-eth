import { NoWalletDetected } from "./components/NoWalletDetected";
import { Tictactoe } from "./components/Tictactoe";
import contractArtifact from "../contracts/contractArtifact.json";
import contractAddress from "../contracts/contractAddress.json";

const HARDHAT_NETWORK_ID = "1337";

export default function App() {
  if (!window.ethereum) {
    return <NoWalletDetected />;
  }

  return <Tictactoe />;
}
