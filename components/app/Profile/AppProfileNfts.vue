<script lang="ts" setup>
const route = useRoute();
const showContextMenu = computed(() => route.name === "me");

const props = defineProps<{
  address: string;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const { address } = toRefs(props);
const { nfts, isFetching } = await useProfile(address.value)

const tokens = ref<string[]>([])
const showTokensDialog = computed(() => tokens.value.length > 0)

function setTokens(ids: string[]) {
  tokens.value = ids.map(id => parseInt(id)).sort((a, b) => a - b).map(id => id.toString())
}

function closeTokensDialog() {
  tokens.value = []
}

const showTransferDialog = reactive<{
  dialog: boolean;
  nft?: string;
  name?: string;
  image?: string;
}>({
  dialog: false,
  nft: undefined,
  name: undefined,
  image: undefined,
})

function setTransferDialog(nft: string) {
  const _nft = nfts.value.find(n => n.nft === nft)
  if (!_nft) return

  showTransferDialog.dialog = true
  showTransferDialog.nft = nft
  showTransferDialog.name = _nft?.name
  showTransferDialog.image = _nft?.image
}

function onRefresh() {
  emit("refresh");
}

</script>

<template>
  <v-skeleton-loader v-if="isFetching" type="card" width="320" class="ml-4" />
  <v-container v-if="nfts" fluid>
    <v-row>
      <v-col cols="auto" v-for="nft in nfts" :key="nft.nft">
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
                    <v-list-item @click="setTransferDialog(nft.nft)" density="compact" append-icon="mdi-send"
                      title="Transfer NFT" />
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

  <ClientOnly>
    <AppNftTransferDialog v-model="showTransferDialog" @refresh="onRefresh" />
  </ClientOnly>

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