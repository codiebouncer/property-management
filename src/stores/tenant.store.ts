import { defineStore } from 'pinia'
import Tenant from '@/models/Tenant/tenant.model'
import type ApiResponse from '@/models/ApiResponse.model'
import TenantLogic from '@/logic/tenant.logic'
import ResponseUtil from '@/utils/ResponseUtils'
import StatusConstants from '@/constants/status.constants'
import TenantPaginationRequest from '@/models/Pagination/pagination.model'
import FetchDataRecords from '@/models/Pagination/FetchDataRecords.model'
import AddTenantRequest from '@/models/Tenant/AddTenant.model'
import type UpdateTenantRequest from '@/models/Tenant/UpdateTenant.model'
import type Payment from '@/models/TenantDetail/payments.model'
import TenantDetailsRequest from '@/models/TenantDetail/tenantdetailsredquest.model'

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    tenants: {
      totalCount: 0,
      search: '',
      page: 1,
      pageSize: 10,
      startDate: '',
      endDate: '',
      data: [] as Tenant[],
    } as FetchDataRecords<Tenant>,
    allpayments: {
      data: [] as Payment[],
      page: 1,
      pageSize: 10,
      totalCount: 0,
    } as FetchDataRecords<Payment>,

    dateRange: {
      start: null as string | null | undefined,
      end: null as string | null | undefined,
    },
    loading: false,
    tenantLogic: new TenantLogic(),
  }),

  actions: {
    async fetchTenants(): Promise<ApiResponse<void>> {
      this.loading = true

      const params = new TenantPaginationRequest()
      params.page = this.tenants.page
      params.pageSize = this.tenants.pageSize
      params.search = this.tenants.search || undefined
      params.startDate = this.dateRange.start || undefined
      params.endDate = this.dateRange.end || undefined

      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantLogic.fetchTenants(params)

        if (response.status === StatusConstants.SUCCESS && response.data) {
          this.tenants = response.data
        }

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },
    async AllPayments(): Promise<ApiResponse<void>> {
      this.loading = true
      const params = new TenantDetailsRequest()
      params.page = this.allpayments.page || 1
      params.pageSize = this.allpayments.pageSize || 10
      params.startDate = this.dateRange.start || undefined
      params.endDate = this.dateRange.end || undefined
      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantLogic.allPayments(params)

        if (response.status === StatusConstants.SUCCESS) {
          this.allpayments.data = response.data?.data ?? []
          this.allpayments.page = response.data?.page ?? 1
          this.allpayments.pageSize = response.data?.pageSize ?? 10
          this.allpayments.totalCount = response.data?.totalCount ?? 0
        }

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },

    async addTenant(model: AddTenantRequest): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantLogic.addTenant(model)

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },
    async deleteTenant(id: string): Promise<ApiResponse<void>> {
      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantLogic.deleteTenant(id)

        if (response.status === StatusConstants.SUCCESS) {
          this.fetchTenants()
        }

        return ResponseUtil.minimal(response)
      })
    },
    async updateTenant(model: UpdateTenantRequest): Promise<ApiResponse<void>> {
      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantLogic.updateTenant(model)

        if (response.status === StatusConstants.SUCCESS) {
          // Refresh table
          await this.fetchTenants()
        }

        return ResponseUtil.minimal(response)
      })
    },
  },
})
