<template>
  <div class="main">
    <div class="menu">
      <n-space>
        <n-button type="primary" @click="handleCameraClick">
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
const Api = window.api

// 控制窗口跳转
const createWindow = (
  opt: unknown,
  url?: string,
  isCloseCurrentWindow?: boolean,
  title?: string
) => {
  Api.openNewWindow(opt, url, isCloseCurrentWindow,title)
}

// 摄像头点击事件
const handleCameraClick = () => {
  createWindow(
    {
      width: 400,
      height: 200
    },
    '/camera',
    false,
    '摄像头'
  )
}
</script>
<style lang="less">
.main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2f3241;
}
</style>
