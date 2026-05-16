export default class ApiResponse<Type> {
  constructor(status: number, message: string, data: Type | null) {
    this.status = status
    this.message = message
    this.data = data
  }

  public status!: number
  public message!: string
  public data!: Type | null
}
