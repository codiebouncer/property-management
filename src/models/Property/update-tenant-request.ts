export default class UpdatePropertyTenantRequest {
  public propertyTenantId!: string
  public planId!: string
  public startDate!: string | null
  public durationValue!: number
  public durationUnit!: string
}
