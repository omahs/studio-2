import {
  bitsong,
  bitsongAssetList,
  osmosis,
  osmosisAssetList,
} from "@nabla-studio/chain-registry";
import type { Config } from "@quirks/store";
import { keplrExtension, leapExtension, keplrMobile, leapMobile } from "@quirks/wallets";

// const bitsong = {
//   ...bitsongConfig,
//   apis: {
//     rpc: [
//       {
//         address: "https://rpc.explorebitsong.com",
//         provider: "bitsong-team"
//       }
//     ],
//     rest: [
//       {
//         address: "https://lcd.explorebitsong.com",
//         provider: "bitsong-team"
//       },
//     ]
//   },
// }

export default defineNuxtPlugin((nuxtApp) => {
  const { walletconnectProjectId } = useRuntimeConfig().public;

  const config: Config = {
    wallets: [keplrExtension, leapExtension, keplrMobile, leapMobile],
    chains: [osmosis, bitsong],
    assetsLists: [osmosisAssetList, bitsongAssetList],
    autoAccountChange: false,
    walletConnectOptions: {
      providerOpts: {
        logger: "info",
        projectId: walletconnectProjectId as string,
        metadata: {
          name: "BitSong Studio",
          description: "BitSong Studio x WalletConnect",
          url: "https://bitsong.studio",
          icons: ["https://bitsong.studio/images/logo-circle.png"],
        }
      }
    }
  };

  nuxtApp.vueApp.use(quirksPlugin, config);
});