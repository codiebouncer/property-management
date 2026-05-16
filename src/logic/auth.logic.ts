import LoginRequest from '../models/Auth/LoginRequest.model'

import TokenResponse from '../models/Auth/TokenResponse.model'
import ApiResponse from '../models/ApiResponse.model'
import { api } from '../boot/axios'
import type RegisterUser from '@/models/Auth/RegisterUser.model'
import type CreateCompany from '@/models/Auth/CreateCompany.model'
import type AllCompanies from '@/models/Auth/AllCompanies.model'

export default class AuthLogic {
  public async login(model: LoginRequest): Promise<ApiResponse<TokenResponse>> {
    const response = await api.post('/Auth/login', model)
    const result = response.data

    console.log(response.data)

    return new ApiResponse<TokenResponse>(result.status, result.message, result.data)
  }
  public async register(model: RegisterUser): Promise<ApiResponse<void>> {
    const response = await api.post('/Auth/register', model)
    return new ApiResponse(response.data.status, response.data.message, response.data.data)
  }

  public async createCompany(model: CreateCompany): Promise<ApiResponse<void>> {
    const response = await api.post('/Company/create-company', model)
    return new ApiResponse(response.data.status, response.data.message, response.data.data)
  }
  async getAllCompanies(): Promise<ApiResponse<AllCompanies[]>> {
    const response = await api.get('/Company/get-all-companies')

    return new ApiResponse(response.data.status, response.data.message, response.data.data)
  }
}
