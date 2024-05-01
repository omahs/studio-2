<template>
  <v-dialog persistent width="585" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-card :disabled="loading">
      <v-card-title>
        Transfer NFT
      </v-card-title>
      <v-card-text class="text-surface-variant">
        Transfer "{{ id }} {{ name }}" to another bitsong account.
      </v-card-text>
      <v-card-text>
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

const props = withDefaults(defineProps<{
  modelValue: boolean;
  name: string;
  id: string;
  nftAddress: string;
}>(), {
  modelValue: false,
  name: "",
  id: "",
  nftAddress: ""
});

const { modelValue, name, id, nftAddress } = toRefs(props);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh"): void;
}>();

const loading = ref(false);
const recipient = ref("");

const handleClose = () => {
  emit("update:modelValue", false);
  recipient.value = "";
  emit("refresh");
};

const { success, error } = useNotify()

async function onSend() {
  if (!recipient.value) {
    error("Recipient address is required")
    return
  }

  if (!id.value) {
    error("Token ID is required")
    return
  }

  if (nftAddress.value === "") {
    error("NFT address is required")
    return
  }

  loading.value = true;

  try {
    const address = getAddress("bitsong")

    const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl

    const msg = executeContract({
      contract: nftAddress.value,
      sender: address,
      msg: toUtf8(JSON.stringify({
        transfer_nft: {
          recipient: recipient.value,
          token_id: id.value.replace("#", ""),
        }
      })),
      funds: []
    })

    const txRaw = await signCW("bitsong", [msg])
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