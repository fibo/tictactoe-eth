import { FC } from "react";
import type { WalletAddress } from "../hooks/useWallet";

type Props = {
  walletAddress?: WalletAddress;
};

export const Header: FC<Props> = ({ walletAddress }) => {
  return (
    <header>
      {walletAddress ? (
        <div className="header__wallet-address">
          <span>wallet address: </span>
          <span>{walletAddress}</span>
        </div>
      ) : null}
    </header>
  );
};
