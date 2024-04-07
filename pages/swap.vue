<template>
    <app-page>
        <template #body>
            <v-container>
                <v-row>
                    <v-col cols="12" md="6">
                        <ClientOnly>
                            <app-swap-card />
                        </ClientOnly>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </app-page>
</template>