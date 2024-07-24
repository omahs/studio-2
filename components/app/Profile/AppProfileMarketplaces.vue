<script lang="ts" setup>
import type { Marketplace } from '~/composables/useMarketplace';

const props = defineProps<{
  marketplaces: Marketplace[] | undefined;
}>();

const { marketplaces } = toRefs(props);
</script>

<template>
  <!--<v-skeleton-loader v-if="isFetching" type="card" width="320" class="ml-4" />-->
  <v-container v-if="marketplaces && marketplaces.length > 0" fluid>
    <v-row>
      <v-col>
        <h2 class="text-h4">Created</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" v-for="marketplace in marketplaces" :key="marketplace.address">
        <v-card width="316">
          <v-card-text>
            <NuxtLink :to="`/nfts/${marketplace.nft.address}`">
              <NuxtImg :src="useIpfsLink(marketplace.nft.metadata.image)" width="285" aspect="1" />
            </NuxtLink>
            <div class="d-flex justify-space-between">
              <div :style="{ height: '90px' }">
                <div class="text-subtitle-2 text-surface-variant mt-1">
                  {{ marketplace.nft.metadata?.bitsong?.artists?.map((artist) => artist.name).join(', ') }}
                </div>
                <div class="text-h6">
                  <NuxtLink :to="`/nfts/${marketplace.nft.address}`" class="text-decoration-none text-white">
                    {{ marketplace.nft.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
            <!--<div class="d-flex justify-space-between">
              <div class="text-subtitle-2 text-surface-variant">
                Start in ...
              </div>
              <div class="text-subtitle-2 text-surface-variant">500 BTSG</div>
            </div>-->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>