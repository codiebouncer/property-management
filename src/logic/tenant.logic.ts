import { api } from '@/boot/axios'
import ApiResponse from '@/models/ApiResponse.model'
import FetchDataRecords from '@/models/Pagination/FetchDataRecords.model'
import Tenant from '@/models/Tenant/tenant.model'
import type AddTenantRequest from '@/models/Tenant/AddTenant.model'
import type UpdateTenantRequest from '@/models/Tenant/UpdateTenant.model'
import type TenantPaginationRequest from '@/models/Pagination/pagination.model'
import type TenantDetailsRequest from '@/models/TenantDetail/tenantdetailsredquest.model'
import type TenantLookup from '@/models/Assignment/tenant-dropdown.model'
import type Plan from '@/models/Assignment/plan.model'
import type UpdatePropertyTenantRequest from '@/models/Property/update-tenant-request'
import type Payment from '@/models/TenantDetail/payments.model'

export default class TenantLogic {
  public async fetchTenants(
    params: TenantPaginationRequest,
  ): Promise<ApiResponse<FetchDataRecords<Tenant>>> {
    const query: any = {
      page: params.page,
      pageSize: params.pageSize,
    }

    if (params.search) query.search = params.search
    if (params.startDate) query.startDate = params.startDate
    if (params.endDate) query.endDate = params.endDate

    const response = await api.get('/Tenant/all-tenants', { params: query })

    return new ApiResponse(response.data.status, response.data.message, response.data.data)
  }

  public async addTenant(payload: AddTenantRequest): Promise<ApiResponse<Tenant>> {
    const response = await api.post('/Tenant/create-tenant', payload)

    const result = response.data

    return new ApiResponse<Tenant>(result.status, result.message, result.data)
  }
  async deleteTenant(tenantId: string): Promise<ApiResponse<void>> {
    const response = await api.post(`/Tenant/delete-tenant/${tenantId}`)
    const result = response.data

    return new ApiResponse<void>(result.status, result.message, null)
  }
  async updateTenant(model: UpdateTenantRequest): Promise<ApiResponse<void>> {
    const response = await api.put('/Tenant/update-tenant', model)
    const result = response.data

    return new ApiResponse<void>(result.status, result.message, null)
  }
  async allPayments(params: TenantDetailsRequest): Promise<ApiResponse<FetchDataRecords<Payment>>> {
    const query: any = {
      page: params.page,
      pageSize: params.pageSize,
      startDate: params.startDate,
      endDate: params.endDate,
    }

    if (params.startDate) query.startDate = params.startDate
    if (params.endDate) query.endDate = params.endDate
    const response = await api.get('/Tenant/all-payments', { params: query })
    const result = response.data

    return new ApiResponse<FetchDataRecords<Payment>>(result.status, result.message, result.data)
  }
  async getAllTenants(): Promise<ApiResponse<TenantLookup[]>> {
    const res = await api.get('/Tenant/dropdown-tenant')
    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }
  async getAllPlans(): Promise<ApiResponse<Plan[]>> {
    const res = await api.get('/Tenant/all-plans')
    const result = res.data

    return new ApiResponse(result.status, result.message, result.data)
  }
  async updatePropertyTenant(payload: UpdatePropertyTenantRequest) {
    const res = await api.post('/Property/update-property-tenant', payload)

    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }
}
