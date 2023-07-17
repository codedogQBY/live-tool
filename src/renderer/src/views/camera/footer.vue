<template>
  <div class="fixed bottom-0 bg-gray-800 h-8 w-full z-30 opacity-0 hover:opacity-100">
    <div class="flex justify-center items-center h-full gap-4">
      <flip-horizontally
        class="hover:cursor-pointer"
        theme="outline"
        size="16"
        fill="#fff"
        @click="handleFlip"
      />
      <full-screen
        v-if="!cameraConfig.rounded"
        class="hover:cursor-pointer"
        theme="outline"
        size="16"
        fill="#fff"
        @click="toggleFullScreen"
      />
      <n-dropdown
        v-model="cameraConfig.deviceId"
        trigger="hover"
        :options="cameras"
        key-field="deviceId"
        label-field="label"
        @select="handleSelect"
      >
        <camera-one
          v-if="!cameraConfig.rounded"
          class="hover:cursor-pointer"
          theme="outline"
          size="16"
          fill="#fff"
        />
      </n-dropdown>
      <error
        class="hover:cursor-pointer"
        theme="outline"
        size="16"
        fill="#fff"
        @click="handleClose"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CameraOne, FlipHorizontally, FullScreen, Error } from '@icon-park/vue-next/lib'
import { useConfigStore } from '../../stores/userCameraStore'
import { ref, onMounted } from 'vue'
const { config: cameraConfig } = useConfigStore()

const Api = window.api
const handleClose = (): void => {
  Api.quit()
}
const handleFlip = (): void => {
  cameraConfig.flip = !cameraConfig.flip
}

const isFullScreen = ref<boolean>(false)
const toggleFullScreen = (): void => {
  isFullScreen.value ? document.exitFullscreen() : document.documentElement.requestFullscreen()
  isFullScreen.value = !isFullScreen.value
}

document.addEventListener('fullscreenchange', () => {
  isFullScreen.value = Boolean(document.fullscreenElement)
})

const cameras = ref([])
onMounted(async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()
  cameras.value = devices.filter((d) => {
    return d.kind.includes('video')
  })
})

const handleSelect = (key: string | number): void => {
  cameraConfig.deviceId = key
}
</script>

<style lang="less" scoped></style>
