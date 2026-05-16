export default class PaginatedResponse<T> {
  public data!: T[]
  public page!: number
  public pageSize!: number
  public totalCount!: number
}
