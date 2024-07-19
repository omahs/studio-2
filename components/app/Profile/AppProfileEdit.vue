<template>
  <v-dialog persistent width="585" :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card :disabled="loading">
      <v-card variant="text">
        <v-img cover :src="cover" height="127" class="d-flex align-center text-center">
          <div>
            <v-btn icon="mdi-camera" variant="plain" @click.stop="onSelectCover" />
            <v-btn icon="mdi-close" variant="plain" @click.stop="removeCover" />
          </div>
        </v-img>

        <div class="d-flex justify-space-between mx-4">
          <v-avatar v-if="!avatar" color="surface-variant" size="86" class="profile-avatar">
            <v-btn icon="mdi-camera" variant="plain" @click.stop="onSelectAvatar" />
          </v-avatar>

          <v-avatar v-else-if="newValues.avatar || avatar" size="86" class="profile-avatar">
            <v-img :src="avatar" cover height="86" width="86" class="align-center">
              <v-btn icon="mdi-camera" variant="plain" @click.stop="onSelectAvatar" />
            </v-img>
          </v-avatar>
        </div>
      </v-card>
      <v-card-text class="mt-4">
        <v-text-field v-model="username" label="Username" variant="outlined" />
        <v-text-field v-model="email" label="Email" hint="Only visible to you" variant="outlined" />
      </v-card-text>
      <v-card-text v-if="errorMessage !== ''">
        <v-alert variant="outlined" type="error">
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions class="justify-center px-6 py-3">
        <v-spacer />
        <v-btn class="w-25 pt-1" rounded="pill" color="grey-lighten-1" variant="text" @click.stop="handleClose">
          Cancel
        </v-btn>
        <v-btn :loading="loading" class="w-25 pt-1" rounded="pill" color="primary" variant="flat"
          @click.stop="handleEditProfile">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
    <AppProfileEditDiscard v-model="discardAlert" @discard-changes="onDiscardChanges" />
    <input ref="coverUploader" accept="image/*" class="d-none" type="file" @change="coverUpload">

    <v-dialog v-model="showAvatarResizer" width="550" height="600">
      <v-card width="550" height="600">
        <v-card-text>
          <cropper class="fill-height" ref="avatarCropper" :src="newValues.avatar" :stencil-props="{ aspectRatio: 1 }"
            :canvas="{
    minHeight: 400,
    minWidth: 400
  }" :auto-zoom="false" />
        </v-card-text>
        <v-card-actions class="mb-2 mr-2">
          <v-btn class="w-25 pt-1" rounded="pill" color="grey-lighten-1" variant="text"
            @click.stop="cancelAvatarResizer">
            Cancel
          </v-btn>
          <v-btn @click="cropAvatar" class="w-25 pt-1" rounded="pill" color="primary" variant="flat">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCoverResizer" width="550" height="600">
      <v-card width="550" height="600">
        <v-card-text>
          <cropper class="fill-height" ref="coverCropper" :src="newValues.cover"
            :stencil-props="{ aspectRatio: 229 / 50 }" :canvas="{
    minHeight: 300,
    minWidth: 1374
  }" :auto-zoom="false" />
        </v-card-text>
        <v-card-actions class="mb-2 mr-2">
          <v-btn class="w-25 pt-1" rounded="pill" color="grey-lighten-1" variant="text"
            @click.stop="cancelCoverResizer">
            Cancel
          </v-btn>
          <v-btn @click="cropCover" class="w-25 pt-1" rounded="pill" color="primary" variant="flat">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-dialog>
</template>

<script lang="ts" setup>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css'
import { useFileDialog } from '@vueuse/core'
import defaultCover from "~/assets/images/default-cover.png";

const { open: openAvatarDialog, onChange: onChangeAvatar, reset: avatarReset } = useFileDialog({
  accept: 'image/jpg, image/jpeg, image/png',
  multiple: false,
})

const { open: openCoverDialog, onChange: onChangeCover, reset: coverReset } = useFileDialog({
  accept: 'image/jpg, image/jpeg, image/png',
  multiple: false,
})

const avatarCropper = ref<typeof Cropper | null>(null)
const coverCropper = ref<typeof Cropper | null>(null)

const showAvatarResizer = ref(false)
const showCoverResizer = ref(false)

const discardAlert = ref(false);
const loading = ref(false);

const coverUploader = ref<HTMLInputElement>();

const errorMessage = ref("");

function onSelectCover() {
  openCoverDialog()
  useAppEvent('select-cover')
}

function onSelectAvatar() {
  openAvatarDialog()
  useAppEvent('select-avatar')
}

const avatar = computed(() => {
  if (newValues.avatar) return newValues.avatar
  return props.avatar
})

const cover = computed(() => {
  if (newValues.cover) return newValues.cover
  return props.cover
})

const newValues = reactive<{
  cover?: string | null;
  avatar?: string | null;
  username?: string;
  email?: string;
}>({});

const resetState = () => {
  newValues.avatar = undefined
  newValues.cover = undefined
  newValues.username = undefined
  newValues.email = undefined
  errorMessage.value = ''
}

function cancelAvatarResizer() {
  avatarReset()
  newValues.avatar = undefined
  showAvatarResizer.value = false
}

function cancelCoverResizer() {
  coverReset()
  newValues.cover = undefined
  showCoverResizer.value = false
}

function cropAvatar() {
  if (!avatarCropper.value) return

  const { canvas } = avatarCropper.value.getResult()
  newValues.avatar = canvas.toDataURL()
  showAvatarResizer.value = false
  avatarReset()
}

function cropCover() {
  if (!coverCropper.value) return

  const { canvas } = coverCropper.value.getResult()
  newValues.cover = canvas.toDataURL()
  showCoverResizer.value = false
  coverReset()
}

interface Props {
  modelValue: boolean;
  cover?: string;
  avatar?: string;
  username?: string | null;
  email?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  cover: defaultCover,
  avatar: undefined,
  username: undefined,
  email: undefined,
});

const hasChanges = computed(() => {
  return newValues.avatar !== undefined || newValues.cover !== undefined || newValues.username !== undefined || newValues.email !== undefined
})

const username = computed({
  get() {
    return newValues.username || props.username
  },
  set(value) {
    if (value !== null && value !== undefined && value.length > 0) newValues.username = value
  }
})

const email = computed({
  get() {
    return newValues.email || props.email
  },
  set(value) {
    if (value !== null && value !== undefined && value.length > 0) newValues.email = value
  }
})

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const handleClose = () => {
  if (hasChanges.value) {
    discardAlert.value = true;
  } else {
    emits("update:modelValue", false);
  }

  useAppEvent('close-edit-profile')
};

const onDiscardChanges = (value: boolean) => {
  if (value) {
    emits("update:modelValue", false);
    resetState();
    useAppEvent('discard-profile-changes')
  }
};

interface ImageValidator {
  maxFileSize: number;
  formatsAllowed: string[];
  minWidth: number;
  minHeight: number;
  square?: boolean;
}

const validateImage = (file: File, opts: ImageValidator) => {
  const { maxFileSize, formatsAllowed, minWidth, minHeight } = opts;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve, reject) => {
    if (file.size > maxFileSize) {
      reject(`Image must be less than ${maxFileSize / 1024 / 1024}MB`);
    }

    if (!formatsAllowed.includes(file.type)) {
      reject(`Image must be of type ${formatsAllowed.join(", ")}`);
    }

    reader.onload = (e) => {
      if (!e.target) {
        return;
      }

      const image = new Image();
      image.onload = () => {
        if (image.height && image.height < minHeight) {
          reject(`Image must be at least ${minHeight}px x ${minWidth}px`);
        }

        if (image.width && image.width < minWidth) {
          reject(`Image must be at least ${minHeight}px x ${minWidth}px`);
        }

        if (opts.square && image.height !== image.width) {
          reject("Image must be square");
        }

        resolve(true);
      };

      image.onerror = () => {
        reject(false);
      };

      image.src = e.target?.result as string;
    };
  });
};

onChangeAvatar(async (files) => {
  if (!files || files.length === 0) {
    return
  }

  const file = files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    if (!e.target) {
      return
    }

    newValues.avatar = e.target?.result as string
    showAvatarResizer.value = true
  }
  reader.readAsDataURL(file)
})

onChangeCover(async (files) => {
  if (!files || files.length === 0) {
    return
  }

  const file = files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    if (!e.target) {
      return
    }

    newValues.cover = e.target?.result as string
    showCoverResizer.value = true
  }
  reader.readAsDataURL(file)
})

const coverUpload = async () => {
  errorMessage.value = ''

  const file = toValue(coverUploader)?.files?.[0]
  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    if (!e.target) {
      return
    }

    validateImage(file, {
      maxFileSize: 10 * 1024 * 1024,
      formatsAllowed: ["image/jpeg", "image/png"],
      minWidth: 1374,
      minHeight: 300,
      square: false,
    }).then(() => {
      newValues.cover = e.target?.result as string
    }).catch((e) => {
      newValues.cover = undefined
      errorMessage.value = e
    })
  }
  reader.readAsDataURL(file)
}

const removeCover = async () => {
  newValues.cover = null
  useAppEvent('remove-cover')
}

function base64ToFile(base64String: string, filename: string): File {
  const splitData = base64String.split(',');
  const contentType = splitData[0].split(':')[1].split(';')[0];
  const base64 = splitData[1];
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  return new File([blob], filename, { type: contentType });
}

const handleEditProfile = async () => {
  if (!hasChanges.value) {
    emits("update:modelValue", false);
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const avatar = toValue(newValues.avatar)
    const cover = toValue(newValues.cover)
    const usernameVal = toValue(username)
    const emailVal = toValue(email)

    const formData = new FormData()

    if (avatar !== undefined) {
      const formData = new FormData()

      if (avatar === null) {
        formData.append('avatar', '')
      } else {
        formData.append('avatar', avatar ? base64ToFile(avatar, 'avatar') : '')
      }

      await $fetch(`${useRuntimeConfig().public.mediaApiDirect}/me/avatar`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${useUserState().value?.sid}`
        }
      })
    }

    if (cover !== undefined) {
      const formData = new FormData()

      if (cover === null) {
        formData.append('cover', '')
      } else {
        formData.append('cover', cover ? base64ToFile(cover, 'cover') : '')
      }

      await $fetch(`${useRuntimeConfig().public.mediaApiDirect}/me/cover`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${useUserState().value?.sid}`
        }
      })
    }

    if (usernameVal) formData.append('username', usernameVal)
    if (emailVal) formData.append('email', emailVal)

    const data = await $fetch('/api/me', {
      method: 'PUT',
      body: formData
    })

    const user = useUserState();
    user.value = {
      ...data.user,
      sid: data.sid
    }

    emits("update:modelValue", false);
    resetState();
    useAppEvent('save-profile')
  } catch (e) {
    // @ts-expect-error - e is untyped
    errorMessage.value = e.data.message
    useAppEvent('save-profile-error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-avatar {
  margin-top: -43px;
  border: 2px solid white;
}
</style>
