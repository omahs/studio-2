//import 'vuetify/styles';
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css';

import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { md3 } from 'vuetify/blueprints'
import { mdi, aliases } from "vuetify/iconsets/mdi";
//import { aliases, fa } from 'vuetify/iconsets/fa'
import { fa } from "vuetify/iconsets/fa-svg";
//import { aliases as aliasesMdi, mdi } from 'vuetify/iconsets/mdi-svg'

import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from "@fortawesome/free-brands-svg-icons";

import "@/assets/scss/style.scss";

// @ts-expect-error missing types in vuetify
import colors from "vuetify/lib/util/colors";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);

  library.add(fas)
  library.add(far)
  library.add(fab);

  config.autoAddCss = false;

  const mainnetTheme: ThemeDefinition = {
    dark: true,
    colors: {
      //primary: '#f50059',
      primary: '#f40a63',
      secondary: colors.blue.base,
    },
  };

  const testnetTheme: ThemeDefinition = {
    dark: true,
    colors: {
      primary: colors.green.base,
      secondary: colors.blue.base,
    },
  };

  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    blueprint: md3,
    theme: {
      defaultTheme:
        useRuntimeConfig().public.network === "mainnet"
          ? "mainnetTheme"
          : "testnetTheme",
      themes: {
        mainnetTheme,
        testnetTheme,
      },
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        fa,
        mdi
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
