export default class TenantPaginationRequest {
  public search!: string | undefined
  public page!: number
  public pageSize!: number
  public startDate!: string | undefined
  public endDate!: string | undefined
}
