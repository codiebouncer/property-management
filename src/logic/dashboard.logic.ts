import Dashboard from '@/models/Dashboard/Dasboard.model'
import ApiResponse from '@/models/ApiResponse.model'
import { api } from '@/boot/axios'
export default class DashboardLogic {
  public async fetchDasboard(): Promise<ApiResponse<Dashboard>> {
    const response = await api.post('/Property/dashboard-summary')
    const result = response.data

    console.log(response.data)

    return new ApiResponse<Dashboard>(result.status, result.message, result.data)
  }
}
