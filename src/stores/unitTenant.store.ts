import { defineStore } from 'pinia'
import FetchDataRecords from '@/models/Pagination/FetchDataRecords.model'
import UnitWithTenant from '@/models/Property/unitwithtenant.model'
import PropertyLogic from '@/logic/property.logic'
import ResponseUtil from '@/utils/ResponseUtils'
import StatusConstants from '@/constants/status.constants'
import type ApiResponse from '@/models/ApiResponse.model'
import type UpdatePropertyTenantRequest from '@/models/Property/update-tenant-request'
import TenantLogic from '@/logic/tenant.logic'

export const useUnitTenantStore = defineStore('unitTenant', {
  state: () => ({
    propertyId: '',
    units: new FetchDataRecords<UnitWithTenant>(),
    loading: false,
    tenantLogic: new TenantLogic(),
    logic: new PropertyLogic(),
  }),

  actions: {
    async fetchUnits(propertyId: string): Promise<ApiResponse<void>> {
      this.loading = true
      this.propertyId = propertyId

      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.logic.getUnitsWithTenants(
          propertyId,
          this.units.page || 1,
          this.units.pageSize || 10,
        )

        if (res.status === StatusConstants.SUCCESS && res.data) {
          this.units = res.data
        }

        this.loading = false
        return ResponseUtil.minimal(res)
      })
    },
    async updatePropertyTenant(model: UpdatePropertyTenantRequest): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.tenantLogic.updatePropertyTenant(model)

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },

    async changePage(page: number) {
      this.units.page = page
      await this.fetchUnits(this.propertyId)
    },

    async changePageSize(size: number) {
      this.units.pageSize = size
      this.units.page = 1
      await this.fetchUnits(this.propertyId)
    },
  },
})
