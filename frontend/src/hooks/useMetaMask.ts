import detectEthereumProvider from "@metamask/detect-provider";
import type { MetaMaskInpageProvider } from "@metamask/providers";
import { useCallback, useEffect, useState } from "react";

export type { MetaMaskInpageProvider } from "@metamask/providers";

export const useMetaMask = () => {
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState<
    MetaMaskInpageProvider | undefined
  >();

  const onChainChanged = useCallback(() => {
    setProvider(undefined);
  }, [setProvider]);

  const onConnect = useCallback(() => {
    setConnected(true);
  }, [setConnected]);

  const onDisconnect = useCallback(() => {
    setConnected(false);
  }, [setConnected]);

  useEffect(() => {
    async function detectMetaMask() {
      const detectedProvider = await detectEthereumProvider();
      if (typeof detectedProvider !== "object" || detectedProvider === null)
        return;
      const { isMetaMask } = detectedProvider as Pick<
        MetaMaskInpageProvider,
        "isMetaMask"
      >;
      if (isMetaMask) setProvider(detectedProvider as MetaMaskInpageProvider);
    }
    detectMetaMask();
  }, [setProvider]);

  useEffect(() => {
    if (!provider) return;
    provider.on("chainChanged", onChainChanged);
    provider.on("connect", onConnect);
    provider.on("disconnect", onDisconnect);
    return () => {
      provider.removeListener("chainChanged", onChainChanged);
      provider.removeListener("connect", onConnect);
      provider.removeListener("disconnect", onDisconnect);
    };
  }, [onChainChanged, onConnect, onDisconnect, provider]);

  return { metaMask: provider, connected };
};
