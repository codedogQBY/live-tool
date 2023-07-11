<template>
  <div class="main">
    <div class="menu">
      <n-space>
        <n-button type="primary">
          <template #icon>
            <camera-five theme="outline" size="16" fill="#fff" />
          </template>
          摄 像
        </n-button>
        <n-button type="info">
          <template #icon>
            <video-one theme="outline" size="16" fill="#fff" />
          </template>
          录 制
        </n-button>
        <n-button type="error">
          <template #icon> <topbuzz theme="outline" size="16" fill="#fff" /></template>
          字 幕
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CameraFive, VideoOne, Topbuzz } from '@icon-park/vue-next/lib'
</script>
<style lang="less">
.main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
