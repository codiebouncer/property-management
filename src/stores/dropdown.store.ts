import { defineStore } from 'pinia'
import PropertyLogic from '@/logic/property.logic'
import TenantLogic from '@/logic/tenant.logic'
import ApiResponse from '@/models/ApiResponse.model'
import ResponseUtil from '@/utils/ResponseUtils'
import StatusConstants from '@/constants/status.constants'
import type UnitLookup from '@/models/Assignment/unit-dropdown.model'
import PropertyLookup from '@/models/Assignment/property-dropdown.model'
import TenantLookup from '@/models/Assignment/tenant-dropdown.model'
import type Plan from '@/models/Assignment/plan.model'

export const useDropdownStore = defineStore('dropdownStore', {
  state: () => ({
    properties: [] as PropertyLookup[],
    units: [] as UnitLookup[],
    propertySearch: '',
    tenants: [] as TenantLookup[],
    plans: [] as Plan[],

    loading: false,

    propertyLogic: new PropertyLogic(),
    tenantLogic: new TenantLogic(),
  }),

  actions: {
    async fetchProperties(search?: string): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.propertyLogic.getAllProperties(search)

        if (res.status === StatusConstants.SUCCESS && res.data) {
          this.properties = res.data
        }

        this.loading = false
        return ResponseUtil.minimal(res)
      })
    },

    async fetchUnits(propId: string): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.propertyLogic.getAllUnits(propId)

        if (res.status === StatusConstants.SUCCESS && res.data) {
          this.units = res.data
        }

        this.loading = false
        return ResponseUtil.minimal(res)
      })
    },

    async fetchTenants(): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.tenantLogic.getAllTenants()

        if (res.status === StatusConstants.SUCCESS && res.data) {
          this.tenants = res.data
        }

        this.loading = false
        return ResponseUtil.minimal(res)
      })
    },
    async fetchPlans(): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.tenantLogic.getAllPlans()

        if (res.status === StatusConstants.SUCCESS && res.data) {
          this.plans = res.data
        }

        this.loading = false
        return ResponseUtil.minimal(res)
      })
    },
  },
})
