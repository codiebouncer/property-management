import { defineStore } from 'pinia'
import ApiResponse from '@/models/ApiResponse.model'
import FetchDataRecords from '@/models/Pagination/FetchDataRecords.model'
import Repair from '@/models/Property/repair.model'
import ResponseUtil from '@/utils/ResponseUtils'
import StatusConstants from '@/constants/status.constants'
import RepairLogic from '@/logic/repair.logic'
import type AllRepairs from '@/models/Property/all-repairs.model'
import TenantDetailsRequest from '@/models/TenantDetail/tenantdetailsredquest.model'

export const useRepairStore = defineStore('repairs', {
  state: () => ({
    propertyId: '',
    repairs: new FetchDataRecords<Repair>(),
    allRepairs: new FetchDataRecords<AllRepairs>(),
    loading: false,
    logic: new RepairLogic(),
    dateRange: {
      start: null as string | null | undefined,
      end: null as string | null | undefined,
    },
  }),

  actions: {
    async fetchRepairs(propertyId: string): Promise<ApiResponse<void>> {
      this.loading = true

      const request = {
        propertyId: propertyId,
        page: this.repairs.page || 1,
        pageSize: this.repairs.pageSize || 10,
        startDate: this.dateRange.start ?? null,
        endDate: this.dateRange.end ?? null,
      }

      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.logic.getRepairs(request)

        if (res.status === StatusConstants.SUCCESS && res.data) {
          this.repairs = res.data
        }

        this.loading = false
        return ResponseUtil.minimal(res)
      })
    },
    async fetchAllRepairs(): Promise<ApiResponse<void>> {
      this.loading = true

      const request = new TenantDetailsRequest()
      request.page = this.allRepairs.page || 1
      request.pageSize = this.allRepairs.pageSize || 10
      request.startDate = this.dateRange.start ?? null
      request.endDate = this.dateRange.end ?? null

      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.logic.getAllRepairs(request)

        if (res.status === StatusConstants.SUCCESS && res.data) {
          this.allRepairs = res.data
        }

        this.loading = false
        return ResponseUtil.minimal(res)
      })
    },

    async changePage(page: number) {
      this.repairs.page = page
      await this.fetchRepairs(this.propertyId)
    },
    async changeAllRepairsPage(page: number) {
      this.allRepairs.page = page
      await this.fetchAllRepairs()
    },

    async changePageSize(size: number) {
      this.repairs.pageSize = size
      this.repairs.page = 1
      await this.fetchRepairs(this.propertyId)
    },
    async changeAllRepairsPageSize(size: number) {
      this.allRepairs.pageSize = size
      this.allRepairs.page = 1
      await this.fetchAllRepairs()
    },
  },
})
