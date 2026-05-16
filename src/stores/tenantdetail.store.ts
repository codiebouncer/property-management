import { defineStore } from 'pinia'
import ApiResponse from '@/models/ApiResponse.model'
import FetchDataRecords from '@/models/Pagination/FetchDataRecords.model'
import Invoice from '@/models/TenantDetail/invoice.model'
import ResponseUtil from '@/utils/ResponseUtils'
import StatusConstants from '@/constants/status.constants'
import TenantDetailLogic from '@/logic/tenantdetail.logic'
import TenantDetailsRequest from '@/models/TenantDetail/tenantdetailsredquest.model'
import type Payment from '@/models/TenantDetail/payments.model'
import type TenantProperty from '@/models/TenantDetail/property.model'
import type MakePaymentRequest from '@/models/payments-request.model'

export const useTenantDetailsStore = defineStore('tenantDetails', {
  state: () => ({
    tenantId: '' as string,

    invoices: new FetchDataRecords<Invoice>(),
    payments: new FetchDataRecords<Payment>(),
    properties: new FetchDataRecords<TenantProperty>(),
    dateRange: {
      start: null as string | null | undefined,
      end: null as string | null | undefined,
    },

    loading: false,

    tenantDetail: new TenantDetailLogic(),
  }),

  getters: {
    hasInvoices: (state) => state.invoices.data?.length > 0,
  },

  actions: {
    /* ============================================================
       FETCH INVOICES
    ============================================================ */
    async fetchTenantInvoices(tenantId: string): Promise<ApiResponse<void>> {
      this.loading = true
      this.tenantId = tenantId

      const params = new TenantDetailsRequest()
      params.page = this.invoices.page || 1
      params.pageSize = this.invoices.pageSize || 10
      params.startDate = this.dateRange.start
      params.endDate = this.dateRange.end

      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantDetail.getTenantInvoices(tenantId, params)

        if (response.status === StatusConstants.SUCCESS && response.data) {
          this.invoices = response.data
        }

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },
    async makePayment(model: MakePaymentRequest): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantDetail.makePayment(model)

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },

    /* ============================================================
       FETCH PAYMENTS
    ============================================================ */
    async fetchTenantPayments(tenantId: string): Promise<ApiResponse<void>> {
      this.loading = true
      this.tenantId = tenantId

      const params = new TenantDetailsRequest()
      params.page = this.payments.page || 1
      params.pageSize = this.payments.pageSize || 10
      params.startDate = this.dateRange.start
      params.endDate = this.dateRange.end
      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantDetail.getTenantPayments(tenantId, params)

        if (response.status === StatusConstants.SUCCESS && response.data) {
          this.payments.totalCount = response.data.totalCount
          this.payments.page = response.data.page
          this.payments.pageSize = response.data.pageSize
          this.payments.data = response.data.data
        }

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },

    /* ============================================================
       FETCH PROPERTIES
    ============================================================ */
    async fetchTenantProperties(tenantId: string): Promise<ApiResponse<void>> {
      this.loading = true
      this.tenantId = tenantId

      const params = new TenantDetailsRequest()
      params.page = this.properties.page || 1
      params.pageSize = this.properties.pageSize || 10

      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantDetail.getTenantProperties(tenantId, params)

        if (response.status === StatusConstants.SUCCESS && response.data) {
          this.properties = response.data
        }

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },

    /* ============================================================
       PAGINATION HANDLERS
    ============================================================ */

    async changeInvoicePage(newPage: number) {
      this.invoices.page = newPage
      await this.fetchTenantInvoices(this.tenantId)
    },

    async changeInvoicePageSize(newSize: number) {
      this.invoices.pageSize = newSize
      this.invoices.page = 1
      await this.fetchTenantInvoices(this.tenantId)
    },

    async changePaymentsPage(newPage: number) {
      this.payments.page = newPage
      await this.fetchTenantPayments(this.tenantId)
    },

    async changePaymentsPageSize(newSize: number) {
      this.payments.pageSize = newSize
      this.payments.page = 1
      await this.fetchTenantPayments(this.tenantId)
    },

    async changePropertyPage(newPage: number) {
      this.properties.page = newPage
      await this.fetchTenantProperties(this.tenantId)
    },

    async changePropertyPageSize(newSize: number) {
      this.properties.pageSize = newSize
      this.properties.page = 1
      await this.fetchTenantProperties(this.tenantId)
    },

    /* ============================================================
       RESET STORE
    ============================================================ */
    reset() {
      this.tenantId = ''
      this.invoices = new FetchDataRecords<Invoice>()
      this.payments = new FetchDataRecords<Payment>()
      this.properties = new FetchDataRecords<TenantProperty>()
      this.loading = false
    },
  },
})
