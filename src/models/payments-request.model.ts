export default class MakePaymentRequest {
  public invoiceId!: string
  public tenantId!: string
  public propertyTenantId!: string
  public paymentAmount!: number
  public paymentDate!: string
  public paymentMethod!: string
}
