import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore(
  'subtitle',
  () => {
    const config = ref({
      // 只打开一个字幕窗口
      subtitleWin: null
    })
    const updateConfig = () => {}
    return { config, updateConfig }
  },
  { persist: true }
)
