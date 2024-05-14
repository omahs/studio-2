import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { polyfillNode } from "esbuild-plugin-polyfill-node";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  appConfig: {
    umami: {
      version: 2,
      ignoreLocalhost: true,
    },
  },
  runtimeConfig: {
    nftStorageApiKey: '',
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsSesRegion: '',
    awsS3Region: '',
    awsS3BucketTracks: '',
    awsS3BucketPodcast: '',
    awsS3AccessKeyId: '',
    awsS3SecretAccessKey: '',
    pinataApiKey: '',
    pinataApiSecret: '',
    public: {
      baseUrl: 'http://localhost:3000',
      network: process.env.NUXT_PUBLIC_NETWORK || 'testnet',
      rpcAddress: process.env.NUXT_PUBLIC_RPC_ADDRESS || 'https://rpc.bwasmnet-1.bitsong.network',
      restAddress: process.env.NUXT_PUBLIC_REST_ADDRESS || 'https://api.bwasmnet-1.bitsong.network',
      chainId: process.env.NUXT_PUBLIC_CHAIN_ID || 'bwasmnet-1',
      appName: 'Studio',
      links: {
        tos: 'https://bitsong.io/tos',
        privacy: 'https://bitsong.io/privacy'
      },
      ipfsGateway: 'https://media-api.bitsong.studio/ipfs/{cid}',
      umamiHost: '',
      umamiId: '',
      mediaApiDirect: '/media-api',
    },
  },
  css: [
    '@mdi/font/css/materialdesignicons.css',
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  build: {
    transpile: ['trpc-nuxt', 'vue-toastification', 'vuetify'],
  },
  gtag: {
    id: "G-41SQ7H37C8",
  },
  image: {
    domains: [
      'yellow-hilarious-jay-665.mypinata.cloud',
      'media-api.bitsong.studio',
      'localhost',
      'bitsong.studio',
      'testnet.bitsong.studio'
    ],
  },
  extends: ['nuxt-umami'],
  modules: [
    '@nuxt/eslint',
    'nuxt-gtag',
    'nuxt-og-image',
    '@nuxt/image',
    '@pinia/nuxt',
    '@quirks/nuxt',
    '@vue-email/nuxt',
    '@vueuse/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins!.push(vuetify({ autoImport: true }))
      })
    },
  ],
  nitro: {
    storage: {
      mnft: {
        driver: 'fs',
        base: './storage/mnft',
      }
    },
    routeRules: {
      '/media-api/**': {
        proxy: {
          to: `${import.meta.env.NUXT_MEDIA_API || 'http://localhost:3000'}/**`,
        }
      }
    }
  },
  vueEmail: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  vite: {
    plugins: [polyfillNode()],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
