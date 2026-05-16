export default class FetchDataRecords<T> {
  public totalCount!: number
  public search!: string | undefined
  public page!: number
  public pageSize!: number
  public startDate!: string | null
  public endDate!: string | null
  public data!: T[]
}
