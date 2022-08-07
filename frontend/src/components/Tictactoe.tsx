import { FC } from "react";
import type { WalletAddress } from "../hooks/useWallet";
import { useTictactoe } from "../hooks/useTictactoe";

type Props = {
  walletAddress: WalletAddress;
};

export const Tictactoe: FC<Props> = ({ walletAddress }) => {
  const tictactoe = useTictactoe(walletAddress);

  if (!tictactoe) return <div>could not find contract</div>;

  return <div>tictactoe</div>;
};
