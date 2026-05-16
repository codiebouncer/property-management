import { api } from '@/boot/axios'
import ApiResponse from '@/models/ApiResponse.model'
import type TenantPropertyAssignment from '@/models/Assignment/assignment.model'
import type PropertyLookup from '@/models/Assignment/property-dropdown.model'
import type UnitLookup from '@/models/Assignment/unit-dropdown.model'
import type FetchDataRecords from '@/models/Pagination/FetchDataRecords.model'
import type CreateProperty from '@/models/Property/CreateProperty'
import type CreateUnit from '@/models/Property/CreateUnit'
import type AllUnits from '@/models/Property/inits.model'
import Property from '@/models/Property/Property'
import type RepairRequest from '@/models/Property/repairrequest.model'
import type UnitWithTenant from '@/models/Property/unitwithtenant.model'
import type TenantDetailsRequest from '@/models/TenantDetail/tenantdetailsredquest.model'

export default class PropertyLogic {
  async fetchProperties(
    search?: string,
    type?: string,
    status?: string,
  ): Promise<ApiResponse<Property[]>> {
    const query: any = {}

    if (search && search.trim() !== '') query.search = search
    if (type && type !== 'All') query.type = type
    if (status && status !== 'All') query.status = status

    const response = await api.get('/Property/all-properties', { params: query })

    const result = response.data
    return new ApiResponse<Property[]>(result.status, result.message, result.data)
  }
  async createProperty(model: CreateProperty): Promise<ApiResponse<any>> {
    const formData = new FormData()

    formData.append('PropertyName', model.propertyName ?? '')
    formData.append('PropertyType', model.propertyType ?? '')
    formData.append('Location', model.location ?? '')
    formData.append('TotalUnits', model.totalUnits.toString())
    formData.append('CostPrice', model.costPrice.toString())
    formData.append('SellingPrice', model.sellingPrice?.toString() ?? '')
    formData.append('OccupancyStatus', model.occupancyStatus ?? '')

    model.pictures.forEach((file) => {
      formData.append('Pictures', file)
    })

    const res = await api.post('/Property/create-property', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }

  async createUnit(model: CreateUnit): Promise<ApiResponse<any>> {
    const response = await api.post('/Property/add-unit', model)
    const result = response.data
    return new ApiResponse<any>(result.status, result.message, result.data)
  }
  async fetchUnits(
    propertyId: string,
    params: TenantDetailsRequest,
  ): Promise<ApiResponse<FetchDataRecords<AllUnits>>> {
    const response = await api.get(`Property/all-units-by-property/${propertyId}`, {
      params,
    })

    const r = response.data
    return new ApiResponse(r.status, r.message, r.data)
  }
  async createRepair(model: RepairRequest): Promise<ApiResponse<any>> {
    const response = await api.post('/Property/add-repair', model)
    const result = response.data

    return new ApiResponse(result.status, result.message, result.data)
  }
  async getAllProperties(search?: string): Promise<ApiResponse<PropertyLookup[]>> {
    const res = await api.get('/Property/dropdown-properties', {
      params: { search },
    })
    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }
  async getAllUnits(propId: string): Promise<ApiResponse<UnitLookup[]>> {
    const res = await api.get(`/Property/dropdown-unit/${propId}`)

    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }
  async assignProperty(model: TenantPropertyAssignment): Promise<ApiResponse<void>> {
    const response = await api.post('/Property/assign-property', model)
    const result = response.data

    return new ApiResponse(result.status, result.message, result.data)
  }
  async getUnitsWithTenants(
    propertyId: string,
    page: number,
    pageSize: number,
  ): Promise<ApiResponse<FetchDataRecords<UnitWithTenant>>> {
    const res = await api.get(`/Property/units-with-tenants/${propertyId}`, {
      params: { page, pageSize },
    })

    const result = res.data
    return new ApiResponse(result.status, result.message, result.data)
  }
}
