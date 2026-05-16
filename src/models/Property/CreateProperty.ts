export default class CreateProperty {
  public propertyName!: string | null
  public propertyType!: string | null
  public location!: string | null
  public totalUnits!: number
  public costPrice!: number
  public sellingPrice!: number | null
  public occupancyStatus!: string | null
  pictures: File[] = []
}
