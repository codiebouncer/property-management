export default class RepairRequest {
  public propertyId!: string
  public description!: string
  public status?: string
  public cost!: string | number | undefined
}
