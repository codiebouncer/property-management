export default class Invoice {
  invoiceId!: string
  propertyTenantId!: string
  companyId!: string
  invoiceDate!: string
  dueDate!: string
  amount!: number
  amountPaid!: number
  balance!: number
  status!: 'Paid' | 'Unpaid' | 'Overdue'
  reminderSent!: boolean
  lastPaymentDate!: string
  createdAt!: string
}
