import type { Action, Reducer } from "./types";

export type WalletAddress = string;

type WalletState = {
  address?: WalletAddress;
};

type WalletActions =
  | Action<"ADD_WALLET_ADDRESS", WalletAddress>
  | Action<"RESET_WALLET", void>;

export const walletReducer: Reducer<WalletState, WalletActions> = (
  state,
  action
) => {
  switch (action.type) {
    case "ADD_WALLET_ADDRESS": {
      const address = action.payload;
      return {
        ...state,
        address,
      };
    }

    case "RESET_WALLET":
      return {};

    default:
      throw new Error();
  }
};
