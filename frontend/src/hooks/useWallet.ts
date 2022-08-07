import { useCallback, useMemo, useReducer } from "react";
import { WalletAddress, walletReducer } from "../reducers/wallet";

export type { WalletAddress } from "../reducers/wallet";

export type AddWalletAddress = (payload: WalletAddress) => void;
export type ResetWallet = () => void;

export const useWallet = () => {
  const [state, dispatch] = useReducer(walletReducer, {});

  const walletAddress = useMemo(() => state.address, [state]);

  const addWalletAddress = useCallback<AddWalletAddress>(
    (payload) => {
      dispatch({ type: "ADD_WALLET_ADDRESS", payload });
    },
    [dispatch]
  );

  const resetWallet = useCallback<ResetWallet>(() => {
    dispatch({ type: "RESET_WALLET" });
  }, [dispatch]);

  return {
    addWalletAddress,
    resetWallet,
    walletAddress,
  };
};
