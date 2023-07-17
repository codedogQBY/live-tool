<script setup lang="ts">
import { useConfigStore } from '../../stores/userCameraStore'
import { onMounted, ref } from 'vue'
import CameraFooter from './footer.vue'

const isShowVideo = ref<boolean>(false)
const { config } = useConfigStore()

const constraints = {
  audio: false,
  video: {
    deviceId: config.deviceId,
    width: 1920,
    height: 1080
  }
} as MediaStreamConstraints

onMounted(() => {
  const video = document.querySelector('video')! as HTMLVideoElement
  config.videoElement = video

  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    isShowVideo.value = true
    video.srcObject = stream
  })
})
</script>
<template>
  <main
    class="w-screen h-screen drag relative"
    :class="{ 'rounded-full': config.rounded }"
    :style="`border:solid ${config.borderWidth} ${config.borderColor}`"
  >
    <div
      v-if="!isShowVideo"
      class="border-4 border-transparent absolute w-screen h-screen bg-slate-700 text-white font-light text-base flex flex-col justify-center items-center"
    >
      摄像头加载中...
    </div>
    <video
      class="object-cover absolute z-10 box-border h-full w-full"
      :style="config.flip ? `transform: rotateY(180deg)` : ''"
      autoplay
      :class="{ 'rounded-full': config.rounded }"
    ></video>
    <camera-footer />
  </main>
</template>

<style lang="less" scoped>
html,
body {
  background: transparent;
}
</style>
