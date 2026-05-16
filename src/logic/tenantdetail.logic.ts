import { api } from '@/boot/axios'
import ApiResponse from '@/models/ApiResponse.model'
import Invoice from '@/models/TenantDetail/invoice.model'
import type FetchDataRecords from '@/models/Pagination/FetchDataRecords.model'
import type Payment from '@/models/TenantDetail/payments.model'
import type TenantProperty from '@/models/TenantDetail/property.model'
import type TenantDetailsRequest from '@/models/TenantDetail/tenantdetailsredquest.model'
import type MakePaymentRequest from '@/models/payments-request.model'

export default class TenantDetailLogic {
  async getTenantInvoices(
    id: string,
    params: TenantDetailsRequest,
  ): Promise<ApiResponse<FetchDataRecords<Invoice>>> {
    const res = await api.get(`/Tenant/invoices/${id}`, {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    })
    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }

  async getTenantPayments(
    id: string,
    params: TenantDetailsRequest,
  ): Promise<ApiResponse<FetchDataRecords<Payment>>> {
    const res = await api.get(`/Tenant/payments/${id}`, {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    })
    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }
  async getTenantProperties(
    id: string,
    params: TenantDetailsRequest,
  ): Promise<ApiResponse<FetchDataRecords<TenantProperty>>> {
    const res = await api.get(`/Property/property/${id}`, {
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    })
    return new ApiResponse(res.data.status, res.data.message, res.data.data)
  }
  async makePayment(model: MakePaymentRequest): Promise<ApiResponse<void>> {
    const res = await api.post('/Tenant/make-payment', model)
    const result = res.data

    return new ApiResponse<void>(result.status, result.message, result.data)
  }
}
