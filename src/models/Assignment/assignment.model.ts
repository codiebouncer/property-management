export default class TenantPropertyAssignment {
  public unitId!: string
  public propertyId!: string
  public tenantId!: string
  public planId!: string

  public startDate!: string | null
  public durationValue!: number
  public durationUnit!: 'Days' | 'Weeks' | 'Months' | 'Years'

  public initialDeposit!: number

  public isPrimaryTenant!: boolean
}
