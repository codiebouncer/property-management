/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'vue-sonner'
import StatusConstants from '../constants/status.constants'
import ApiResponse from '../models/ApiResponse.model'

export default class ResponseUtil {
  static minimal<Type>(response: ApiResponse<Type>): ApiResponse<void> {
    return new ApiResponse<void>(response.status, response.message, null)
  }

  static async handleAxiosCall<T>(func: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> {
    try {
      const result = await func()

      if (result.status === StatusConstants.SUCCESS) {
        toast.success(result.message || 'Operation completed successfully')
      } else {
        toast.error(result.message || 'Something went wrong')
      }

      return result
    } catch (error: any) {
      console.error('API error:', error)

      const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred. Please try again later.'

      toast.error(message)

      return new ApiResponse<any>(2, message, null)
    }
  }
}
