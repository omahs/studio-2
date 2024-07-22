<template>
  <app-page>
    <template #body>
      <AppProfileHeader v-if="user" :address="user.address" :avatar="user.avatar" :cover="user.cover"
        :username="user.username" :email="user.email" />

      <v-skeleton-loader v-if="isFetching" type="card" width="320" class="ml-4" />
      <v-container v-if="nfts2">
        <v-row>
          <v-col cols="auto" v-for="nft in nfts2.nfts" :key="nft.nft">
            <v-card width="316">
              <v-card-text>
                <NuxtLink :to="`/nfts/${nft.nft}`">
                  <NuxtImg :src="useIpfsLink(nft.image)" width="285" aspect="1" />
                </NuxtLink>
                <div class="d-flex justify-space-between">
                  <div class="text-h6" :style="{ height: '65px' }">
                    <NuxtLink :to="`/nfts/${nft.nft}`" class="text-decoration-none text-white">
                      {{ nft.name }}
                    </NuxtLink>
                  </div>
                  <div v-if="showContextMenu">
                    <v-menu location="bottom right">
                      <template #activator="{ props }">
                        <v-btn variant="text" color="white" icon="mdi-dots-vertical" v-bind="props" />
                      </template>

                      <v-list density="compact" :style="{ cursor: 'pointer' }">
                        <v-list-item density="compact" append-icon="mdi-send" title="Transfer NFT" />
                      </v-list>
                    </v-menu>
                  </div>
                </div>
                <div class="d-flex justify-space-between">
                  <div class="text-subtitle-2 text-surface-variant" @click.stop="setTokens(nft.tokenIds)"
                    :style="{ cursor: 'pointer' }">
                    {{ nft.totalIds }} edition{{ nft.totalIds > 1 ? 's' : '' }}
                  </div>
                  <div class="text-subtitle-2 text-surface-variant">{{ formatNumber(nft.value) }} BTSG</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="showTokensDialog" width="360" height="400">
        <v-card>
          <v-card-title>Editions</v-card-title>
          <v-card-text>
            <v-chip size="small" rounded v-for="id in tokens" :key="id" class="mr-2 mb-2">
              #{{ id }}
            </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn @click.stop="closeTokensDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </app-page>
</template>

<script setup lang="ts">
import defaultImage from "~/assets/images/og-default-1200.png";
import { useQuery } from '@tanstack/vue-query'

definePageMeta({
  middleware: ["protected"]
});

const route = useRoute();
const showContextMenu = computed(() => route.name === "me");

const user = useUserState()
useSeoMeta({
  title: user.value?.username ? user.value?.username : user.value?.address,
  titleTemplate: '%s | Profile | BitSong Studio',
  description: `Check out ${user?.value?.username || user.value?.address}'s profile on BitSong Studio, the home of Web3 Music.`,
  twitterCard: "summary_large_image",
  ogImage: user?.value?.avatar ? useIpfsLink(user?.value?.avatar) : defaultImage,
});

interface NftsResponse {
  totalCount: number;
  totalValue: number;
  nfts: {
    nft: string;
    name: string;
    image: string;
    totalIds: number;
    tokenIds: string[]
    value: number;
  }[]
}

const { isFetching, data: nfts2 } = useQuery({
  queryKey: ['profile', user.value!.address, 'nfts'],
  queryFn: async () => {
    return await $fetch<NftsResponse>(`${useRuntimeConfig().public.mediaApiDirect}/u/${user.value!.address}/nfts`)
  },
  staleTime: 1000 * 60 * 5, // 5 minutes,
  select: (data) => {
    return {
      totalCount: data.totalCount,
      totalValue: data.totalValue,
      nfts: data.nfts.sort((a, b) => b.value - a.value)
    }
  }
})
const tokens = ref([])
const showTokensDialog = computed(() => tokens.value.length > 0)

function setTokens(ids: string[]) {
  tokens.value = ids.map(id => parseInt(id)).sort((a, b) => a - b).map(id => id.toString())
}

function closeTokensDialog() {
  tokens.value = []
}
</script>