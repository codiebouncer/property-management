import { defineStore } from 'pinia'
import AuthLogic from '../logic/auth.logic'
import TokenResponse from '../models/Auth/TokenResponse.model'
import LoginRequest from '../models/Auth/LoginRequest.model'
import ApiResponse from '../models/ApiResponse.model'
import { api } from '../boot/axios'
import ResponseUtil from '../utils/ResponseUtils'
import StatusConstants from '../constants/status.constants'
import AuthConstants from '../constants/auth.constants'
import RegisterUser from '@/models/Auth/RegisterUser.model'
import type CreateCompany from '@/models/Auth/CreateCompany.model'
import AllCompanies from '@/models/Auth/AllCompanies.model'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: new TokenResponse(),
    authLogic: new AuthLogic(),
    status: AuthConstants.LOGOUT,
    companies: [] as AllCompanies[],
    registerModel: new RegisterUser(),
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => state.status === AuthConstants.LOGIN,
  },

  actions: {
    initialize() {
      const storedAuth = localStorage.getItem('isAuthenticated')
      const token = localStorage.getItem('accessToken')

      if (storedAuth === 'true' && token) {
        this.status = AuthConstants.LOGIN
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    },
    async login(model: LoginRequest): Promise<ApiResponse<void>> {
      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.authLogic.login(model)
        if (response.status === StatusConstants.SUCCESS) {
          this.status = AuthConstants.LOGIN

          console.log(this.isAuthenticated)

          const result = response.data

          localStorage.setItem('isAuthenticated', JSON.stringify(this.isAuthenticated))
          localStorage.setItem('accessToken', result?.accessToken ?? '')

          api.defaults.headers.common['Authorization'] = `Bearer ${result?.accessToken}`
        }

        return ResponseUtil.minimal(response)
      })
    },
    async register(model: RegisterUser): Promise<ApiResponse<void>> {
      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.authLogic.register(model)
        return ResponseUtil.minimal(response)
      })
    },

    async loadCompanies(): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.authLogic.getAllCompanies()

        if (res.status === StatusConstants.SUCCESS && res.data) {
          this.companies = res.data
        }

        this.loading = false
        return ResponseUtil.minimal(res)
      })
    },

    async createCompany(model: CreateCompany): Promise<ApiResponse<void>> {
      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.authLogic.createCompany(model)
        return ResponseUtil.minimal(response)
      })
    },

    logout() {
      this.status = AuthConstants.LOGOUT
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('accessToken')
      delete api.defaults.headers.common['Authorization']
    },
  },
})
