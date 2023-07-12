<template>
  <div class="main">
    <div>:{{ text }}</div>
    <error class="close" theme="outline" size="14" fill="#fff" @click="handleClose" />
  </div>
</template>

<script setup lang="ts">
import { Error } from '@icon-park/vue-next/lib'
import { onMounted, ref } from 'vue'
const text = ref('')
const Api = window.api
onMounted(() => {
  Api.setSubtitlePosition()
  const speech = window.webkitSpeechRecognition || window.SpeechRecognition
  const recognition = new speech()
  recognition.continuous = true
  recognition.lang = 'zh-CN' // 设置为所需的语言
  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1]
    const transcript = result[0].transcript
    text.value += transcript + ' '
    if (text.value.length > 60) {
      text.value = text.value.slice(transcript.length + 1)
    }
  }
  recognition.start()
})
const handleClose = () => {
  Api.quit()
}
</script>
<style lang="less" scoped>
.main {
  line-height: 60px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: bold;
  color: aliceblue;
  background: rgba(219, 215, 215, 0.11);
  .close {
    position: fixed;
    top: 8px;
    right: 8px;
    cursor: pointer;
  }
}
</style>
