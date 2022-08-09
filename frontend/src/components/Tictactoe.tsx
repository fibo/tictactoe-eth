import { FC, useCallback, useMemo } from "react";
import type { WalletAddress } from "../hooks/useWallet";
import { useTictactoe } from "../hooks/useTictactoe";
import { GameStatus } from "../contracts/TictactoeGame";

type Props = {
  walletAddress?: WalletAddress;
};

export const Tictactoe: FC<Props> = ({ walletAddress }) => {
  const tictactoe = useTictactoe(walletAddress);

  const onClickJoin = useCallback(() => {
    if (!tictactoe) return;
    tictactoe.join();
  }, [tictactoe]);

  const gameStatus = useMemo(() => {
    if (!tictactoe) return;
    console.log(tictactoe.filters.GameStatusChange());
    return GameStatus.Playing;
  }, [tictactoe]);

  if (!walletAddress) return null;

  if (!tictactoe) return <div>could not find contract</div>;

  return (
    <div>
      <button onClick={onClickJoin}>join</button>
    </div>
  );
};
