export default class TenantInvoice {
  public invoiceId!: string
  public propertyTenantId!: string
  public dueDate!: string
  public invoiceDate!: string
  public lastPaymentDate!: string
  public status!: string
  public amount!: number
  public amountPaid!: number
  public balance!: number
}
