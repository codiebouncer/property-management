import { api } from '@/boot/axios'
import ApiResponse from '@/models/ApiResponse.model'
import Repair from '@/models/Property/repair.model'
import FetchDataRecords from '@/models/Pagination/FetchDataRecords.model'
import type RepairFilterRequest from '@/models/Property/repair-filter.model'
import type TenantDetailsRequest from '@/models/TenantDetail/tenantdetailsredquest.model'
import type AllRepairs from '@/models/Property/all-repairs.model'

export default class RepairLogic {
  async getRepairs(model: RepairFilterRequest): Promise<ApiResponse<FetchDataRecords<Repair>>> {
    const res = await api.get(`/Property/repairs/${model.propertyId}`, {
      params: {
        page: model.page,
        pageSize: model.pageSize,
        startDate: model.startDate,
        endDate: model.endDate,
      },
    })

    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }
  async getAllRepairs(
    request: TenantDetailsRequest,
  ): Promise<ApiResponse<FetchDataRecords<AllRepairs>>> {
    const res = await api.get('/Property/all-repairs', {
      params: request,
    })

    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }
}
