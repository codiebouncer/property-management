import type PropertyPicture from './PropertyPicture'

export default class Property {
  public propertyId!: string
  public companyId!: string

  public propertyName!: string
  public propertyType!: string
  public location!: string

  public totalUnits!: number
  public occuppiedUnits!: number
  public vacantUnits!: number

  public costPrice!: number
  public sellingPrice?: number | null

  public occupancyStatus!: string
  public isActive!: boolean

  public createdBy!: string
  public createdAt!: string
  public updatedAt!: string

  public pictures!: PropertyPicture[]
}
