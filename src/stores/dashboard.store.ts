import StatusConstants from '@/constants/status.constants'
import ApiResponse from '@/models/ApiResponse.model'
import DashboardLogic from '@/logic/dashboard.logic'
import ResponseUtil from '@/utils/ResponseUtils'
import { defineStore } from 'pinia'
import Dashboard from '@/models/Dashboard/Dasboard.model'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashSummary: new Dashboard(),
    dashLogic: new DashboardLogic(),
  }),
  getters: {},

  actions: {
    async fetchDashboardSummary(): Promise<ApiResponse<void>> {
      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.dashLogic.fetchDasboard()
        if (response.status === StatusConstants.SUCCESS) {
          this.dashSummary = response.data as Dashboard
        }

        return ResponseUtil.minimal(response)
      })
    },
  },
})
