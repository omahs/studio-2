<template>
    <v-card color="#321e41" rounded="xl" class="px-6 py-8">
        <div class="pb-6">
            <v-sheet height="135" color="#261236" rounded="xl" class="pl-6 pt-4">
                <span class="text-surface-variant text-body-2">
                    Swap from
                </span>

                <v-row>
                    <v-col cols="6">
                        <input type="text" value="0" class="text-h4 swap__input" />
                        <div class="text-surface-variant text-body-2">0.29 $</div>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                        <v-btn :style="{ height: '60px' }" size="x-large" append-icon="mdi-chevron-down" variant="flat"
                            color="#301c3e" rounded="xl">
                            <template #prepend>
                                <v-avatar size="32" class="mr-3"
                                    image="https://raw.githubusercontent.com/bitsongofficial/assetlists/main/logos/adam.jpeg">
                                </v-avatar>
                            </template>
                            <template #default>
                                <div class="d-flex flex-column" :style="{ minWidth: '135px' }">
                                    <div class="text-h6 text-left">BTSG</div>
                                    <div class="text-left text-surface-variant text-subtitle-2">2.032032</div>
                                </div>
                            </template>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-sheet>
            <div class="pt-2 text-body-2 font-weight-medium" :style="{ color: '#FF005C' }">
                You don't have enough coins
            </div>
        </div>
        <div>
            <v-sheet height="135" color="#261236" rounded="xl" class="pl-6 pt-4 border-error">
                <span class="text-surface-variant text-body-2">
                    Swap from
                </span>

                <v-row>
                    <v-col cols="6">
                        <input type="text" value="0" class="text-h4 swap__input" />
                        <div class="text-surface-variant text-body-2">0.29 $</div>
                    </v-col>
                    <v-col cols="6" class="d-flex">
                        <v-btn :style="{ height: '60px' }" size="x-large" append-icon="mdi-chevron-down" variant="flat"
                            color="#301c3e" rounded="xl">
                            <template #prepend>
                                <v-avatar size="32" class="mr-3"
                                    image="https://raw.githubusercontent.com/bitsongofficial/assetlists/main/logos/adam.jpeg">
                                </v-avatar>
                            </template>
                            <template #default>
                                <div class="d-flex flex-column" :style="{ minWidth: '135px' }">
                                    <div class="text-h6 text-left">BTSG</div>
                                    <div class="text-left text-surface-variant text-subtitle-2">2.032032</div>
                                </div>
                            </template>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-sheet>
            <div class="pt-2 text-body-2 font-weight-medium" :style="{ color: '#FF005C' }">
                You don't have enough coins
            </div>
        </div>

        <v-card class="pb-7 pt-4 px-4 mt-4" variant="plain" ounded="xl">
            <v-row align="center d-flex">
                <v-col class="py-0" cols="6">
                    Estimated Slippage <v-icon size="x-small">mdi-information</v-icon>
                </v-col>
                <v-col class="py-0 text-right" cols="6">
                    < 0.001% <v-btn icon="mdi-chevron-down" color="white" variant="text"
                        @click="openSlippage = !openSlippage">
                        </v-btn>
                </v-col>
            </v-row>
            <v-row align="center d-flex" v-if="openSlippage">
                <v-col class="py-0" cols="6">
                    Slippage Tolerance <v-icon size="x-small">mdi-information</v-icon>
                </v-col>
                <v-col class="py-0 text-right" cols="6">
                    <v-btn size="small" variant="outlined" color="white" class="mx-2">1 %</v-btn>
                    <v-btn size="small" variant="outlined" color="white" class="mx-2">3 %</v-btn>
                    <v-btn size="small" variant="outlined" color="white">5 %</v-btn>
                </v-col>
            </v-row>
        </v-card>
        <v-container>
            <v-row align="center">
                <v-col cols="6">
                    <div class=text-surface-variant>Rates</div>

                    <div class="text-h6">BTSG = 12.663 CLAY</div>

                    <div class="text-h6">CLAY = 0.079 BTSG</div>

                </v-col>
                <v-col cols="6">
                    <v-btn color="#FF005C" rounded="xl" block size="x-large">Swap</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts" setup>
const openSlippage = ref(false)
</script>

<style>
.swap__input {
    font-weight: 400;
    letter-spacing: 0.00937em !important;
    padding: 6px 0;
    color: #7a6e84;
    width: 100%;
}

.swap__input:focus-visible {
    outline: none;
}

.border-error {
    border: 2px solid #FF005C !important
}
</style>