<template>
  <v-card v-bind="$attrs" rounded="lg" style="cursor: pointer">
    <v-img height="250" cover :src="imageSrc" aspect-ratio="1" @click.stop="navigateTo(`/nfts/${nft}`)">

      <v-container v-if="showContextMenu" class="pa-0">
        <v-row>
          <v-col class="d-flex justify-end">
            <v-menu location="bottom right">
              <template #activator="{ props }">
                <v-btn variant="text" color="white" icon="mdi-dots-vertical" v-bind="props" />
              </template>

              <v-list density="compact" :style="{ cursor: 'pointer' }">
                <v-list-item density="compact" append-icon="mdi-send" title="Transfer NFT"
                  @click="showTransferDialog = true" />
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-img>

    <v-card-subtitle class="mt-4">
      <nuxt-link class="text-decoration-none text-grey text-body-2" :to="`/nfts/${nft}`">
        {{ nftName }}
      </nuxt-link>
    </v-card-subtitle>

    <v-card-title style="min-height: 48px">
      <nuxt-link class="text-decoration-none text-white text-body-1" :to="`/nfts/${nft}`">
        {{ tokenName }}
      </nuxt-link>
    </v-card-title>
    <AppNftTransferDialog :id="tokenName" v-model="showTransferDialog" :name="nftName" :nft-address="nft"
      @refresh="onRefresh" />
  </v-card>
</template>

<script lang="ts" setup>
import defaultImage from "@/assets/images/default.png";

export interface NftTokenGridItem {
  tokenName: string;
  image?: string;
  nftName: string;
  nft: string;
  tokenId: string;
}

const route = useRoute();

const showContextMenu = computed(() => route.name === "me");

const prop = defineProps<NftTokenGridItem>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

function onRefresh() {
  emit("refresh");
}

const img = useImage();

const imageSrc = computed(() => {
  if (!prop.image) {
    return defaultImage;
  }

  return img(useIpfsLink(prop.image)!, { width: 250, format: 'webp' })
});

const showTransferDialog = ref(false);
</script>
