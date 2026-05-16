export default class Tenant {
  public tenantId!: string
  public fullName!: string
  public email!: string
  public phoneNumber!: string
  public nationalId!: string
  public isActive!: boolean
  public isAssigned!: boolean
  public propertyName!: string | null
  public unitName!: string | null
  public propertyTenantId!: string | null
}
