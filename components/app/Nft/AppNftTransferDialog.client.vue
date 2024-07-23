<template>
  <v-dialog persistent width="585" :model-value="data.dialog">
    <v-card :disabled="loading">
      <v-card-title>
        Transfer NFT
      </v-card-title>
      <v-container class="px-6 pb-0">
        <v-row>
          <v-col cols="2">
            <NuxtImg :src="useIpfsLink(modelValue.image)" width="85" aspect="1" />
          </v-col>
          <v-col cols="8">
            <v-row no-gutters>
              <v-col class="text-h6">{{ modelValue.name }} </v-col>
              <v-col class="text-subtitle-2 text-surface-variant">{{ modelValue.nft }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text v-if="tokenIds !== undefined && tokenIds.length > 0">
        <v-combobox variant="outlined" v-model="selectedTokenIds" chips multiple label="Editions" :items="tokenIds" />
        <v-text-field v-model="recipient" label="Recipient address" variant="outlined" />
      </v-card-text>
      <v-card-actions class="justify-center px-6 py-3">
        <v-spacer />
        <v-btn class="w-25 pt-1" rounded="pill" color="grey-lighten-1" variant="text" @click.stop="handleClose">
          Cancel
        </v-btn>
        <v-btn :loading="loading" class="w-25 pt-1" rounded="pill" color="primary" variant="flat" @click.stop="onSend">
          Send
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { cosmwasm } from '@bitsongjs/telescope';
import { toUtf8 } from '@cosmjs/encoding';
import { useQuery } from '@tanstack/vue-query'

interface Data {
  dialog: boolean;
  nft?: string;
  name?: string;
  image?: string;
}

const props = defineProps<{
  modelValue: Data;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Data): void;
  (e: "refresh"): void;
}>();

const data = useVModel(props, 'modelValue', emit)

const loading = ref(false);
const recipient = ref("");

const handleClose = () => {
  data.value.dialog = false;
  data.value.nft = undefined;
  data.value.name = undefined;
  data.value.image = undefined;
  recipient.value = "";
  selectedTokenIds.value = []
  emit("refresh");
};

const { success, error } = useNotify()

const address = getAddress("bitsong")

const selectedTokenIds = ref<string[]>([])

const { data: tokenIds, refetch } = useQuery({
  queryKey: ['profile', address, 'nfts', data.value.nft, 'tokenIds'],
  queryFn: async () => {
    const response = await $fetch<ProfileNftsResponse>(`${useRuntimeConfig().public.mediaApiDirect}/u/${address}/nfts?includeValue=false`)
    console.log('data', response)
    console.log('tokenIds', response.nfts.find(nft => nft.nft === data.value.nft)?.tokenIds)
    return response.nfts.find(nft => nft.nft === data.value.nft)?.tokenIds
  },
  enabled() {
    return data.value.nft !== undefined
  },
  refetchInterval: 1000 * 30,
  refetchOnMount: false,
})

watch(data.value, (value) => {
  if (value.nft) {
    tokenIds.value = undefined
    selectedTokenIds.value = []
    refetch()
  }
})

async function onSend() {
  if (!recipient.value) {
    error("Recipient address is required")
    return
  }

  if (!data.value.nft) {
    error("NFT is required")
    return
  }

  if (selectedTokenIds.value.length === 0) {
    error("Select at least one edition")
    return
  }

  loading.value = true;

  try {
    const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl

    // const msg = executeContract({
    //   contract: nftAddress.value,
    //   sender: address,
    //   msg: toUtf8(JSON.stringify({
    //     transfer_nft: {
    //       recipient: recipient.value,
    //       token_id: id.value.replace("#", ""),
    //     }
    //   })),
    //   funds: []
    // })

    const msgs = selectedTokenIds.value.map(id => executeContract({
      contract: data.value.nft!,
      sender: address,
      msg: toUtf8(JSON.stringify({
        transfer_nft: {
          recipient: recipient.value,
          token_id: id,
        }
      })),
      funds: []
    }))

    const txRaw = await signCW("bitsong", msgs)
    const broadcast = (await import("@quirks/store")).broadcast
    const response = await broadcast("bitsong", txRaw)

    await useWaitForBlock(response.height)

    success("NFT sent successfully")
    handleClose()
  } catch (e) {
    error((e as Error).message)
  } finally {
    loading.value = false
  }
}
</script>