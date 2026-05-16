export default class RepairFilterRequest {
  public propertyId!: string
  public page: number
  public pageSize: number
  public startDate: string | null
  public endDate: string | null

  constructor() {
    this.page = 1
    this.pageSize = 10
    this.startDate = null
    this.endDate = null
  }
}
