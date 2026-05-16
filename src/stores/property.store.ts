import { defineStore } from 'pinia'
import ApiResponse from '@/models/ApiResponse.model'
import PropertyLogic from '@/logic/property.logic'
import ResponseUtil from '@/utils/ResponseUtils'
import StatusConstants from '@/constants/status.constants'
import Property from '@/models/Property/Property'
import CreateProperty from '@/models/Property/CreateProperty'
import type CreateUnit from '@/models/Property/CreateUnit'
import FetchDataRecords from '@/models/Pagination/FetchDataRecords.model'
import type AllUnits from '@/models/Property/inits.model'
import TenantDetailsRequest from '@/models/TenantDetail/tenantdetailsredquest.model'
import RepairRequest from '@/models/Property/repairrequest.model'
import TenantPropertyAssignment from '@/models/Assignment/assignment.model'

export const usePropertyStore = defineStore('properties', {
  state: () => ({
    loading: false,

    /** Filters */
    search: '',
    type: 'All', // Rent | Work & Pay | All
    status: 'All', // Occupied | Vacant | Sold | All

    /** Data */
    properties: [] as Property[],
    createModel: new CreateProperty(),
    units: [] as CreateUnit[],
    allunits: new FetchDataRecords<AllUnits>(),
    createModalOpen: false,
    assignModel: new TenantPropertyAssignment(),
    repairreq: new RepairRequest(),
    logic: new PropertyLogic(),
  }),

  actions: {
    async fetchProperties(): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.logic.fetchProperties(this.search, this.type, this.status)

        if (response.status === StatusConstants.SUCCESS && response.data) {
          this.properties = response.data
        }

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },
    async createProperty(payload: CreateProperty): Promise<ApiResponse<void>> {
      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.logic.createProperty(payload)

        if (res.status === StatusConstants.SUCCESS) {
          this.createModalOpen = false
          this.createModel = new CreateProperty()
          await this.fetchProperties()
        }

        return ResponseUtil.minimal(res)
      })
    },
    async createUnit(model: CreateUnit) {
      this.loading = true
      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.logic.createUnit(model)

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },
    async fetchUnits(propertyId: string) {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const params = new TenantDetailsRequest()
        params.page = this.allunits.page || 1
        params.pageSize = this.allunits.pageSize || 10

        const response = await this.logic.fetchUnits(propertyId, params)

        if (response.status === StatusConstants.SUCCESS && response.data) {
          this.allunits = response.data
        }

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },
    async createRepair(model: RepairRequest): Promise<ApiResponse<void>> {
      return ResponseUtil.handleAxiosCall(async () => {
        const res = await this.logic.createRepair(model)
        this.loading = false
        return ResponseUtil.minimal(res)
      })
    },
    async assignProperty(): Promise<ApiResponse<void>> {
      this.loading = true

      return ResponseUtil.handleAxiosCall(async () => {
        const response = await this.logic.assignProperty(this.assignModel)

        this.loading = false
        return ResponseUtil.minimal(response)
      })
    },
    reset() {
      this.assignModel = new TenantPropertyAssignment()
    },

    setSearch(value: string) {
      this.search = value
      this.fetchProperties()
    },

    setType(type: string) {
      this.type = type
      this.fetchProperties()
    },

    setStatus(status: string) {
      this.status = status
      this.fetchProperties()
    },
    addPictures(files: File[]) {
      this.createModel.pictures.push(...files)
    },

    removePicture(index: number) {
      this.createModel.pictures.splice(index, 1)
    },
    async changePage(page: number) {
      this.allunits.page = page
    },

    async changePageSize(size: number) {
      this.allunits.pageSize = size
      this.allunits.page = 1
    },

    resetFilters() {
      this.search = ''
      this.type = 'All'
      this.status = 'All'
      this.fetchProperties()
    },
  },
})
