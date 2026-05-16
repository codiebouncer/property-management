import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { App } from 'vue'

const baseURL = import.meta.env.VITE_BASEURL

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default {
  install(app: App) {
    app.config.globalProperties.$axios = api
    app.config.globalProperties.$api = api
  },
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

export { api }
