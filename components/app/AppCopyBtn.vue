<template>
  <v-btn
v-bind="$attrs" color="grey-lighten-1" icon="mdi-content-copy" size="small" variant="text"
    @click.stop="copy(text)"/>
</template>

<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";
import { useToast } from "vue-toastification";

const { success } = useToast();
const { copy, copied } = useClipboard();

defineProps<{
  text: string;
}>();

watch(copied, (copied) => {
  if (copied) success("Copied to clipboard");
});
</script>
