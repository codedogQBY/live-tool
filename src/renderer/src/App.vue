<script setup lang="ts">
import '@icon-park/vue-next/styles/index.less'
import { onMounted, ref } from 'vue'
const startX = ref(0)
const startY = ref(0)
const dragging = ref(false)

// 将dragWindow方法从window.api传递给setup函数
const dragWindow = window.api.dragWindow

const handleMouseDown = (event): void => {
  dragging.value = true
  const { pageX, pageY } = event
  startX.value = pageX
  startY.value = pageY
}

const handleMouseMove = (event): void => {
  if (dragging.value) {
    const offsetX = event.pageX - startX.value
    const offsetY = event.pageY - startY.value
    requestAnimationFrame(() => dragWindow(offsetX, offsetY))
  }
}

const handleMouseUp = (): void => {
  dragging.value = false
}

onMounted(() => {
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div class="window" @mousedown="handleMouseDown">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
body,
html {
  padding: 0;
  margin: 0;
  background-color: transparent !important;
}
</style>
