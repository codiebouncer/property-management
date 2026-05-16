import type { StringMappingType } from 'typescript'

export default class TenantProperty {
  public propertyName!: string
  public propertyUnit!: string
  public status!: string
  public propertyType!: StringMappingType
}
