import type { MetaMaskInpageProvider } from "@metamask/providers";

export const useMetaMask = () => {
  const ethereum = global?.window?.ethereum;
  if (!ethereum || !ethereum.isMetaMask) return;
  return ethereum as unknown as MetaMaskInpageProvider;
};
