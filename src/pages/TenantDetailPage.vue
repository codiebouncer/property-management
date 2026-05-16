<script setup lang="ts">
import { onMounted, h, ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import type { DateValue } from 'reka-ui'
import DataTable from '@/components/ui/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon, MoreVertical } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useTenantDetailsStore } from '@/stores/tenantdetail.store'
import { formatDate } from '@/utils/DateUtils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import MakePaymentRequest from '@/models/payments-request.model'
import type TenantInvoice from '@/models/Tenant/tenant-invoice'

// --------------------- STORE ---------------------
const store = useTenantDetailsStore()
const route = useRoute()
const showPaymentModal = ref(false)
const loading = ref(false)

const paymentModel = ref(new MakePaymentRequest())
function openPaymentModal(invoice: TenantInvoice) {
  paymentModel.value.invoiceId = invoice.invoiceId
  paymentModel.value.tenantId = store.tenantId
  paymentModel.value.propertyTenantId = invoice.propertyTenantId
  paymentModel.value.paymentDate = new Date().toISOString().slice(0, 16) // datetime-local format
  showPaymentModal.value = true
}

// Fetch all tenant-related data
onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await Promise.all([
      store.fetchTenantProperties(id),
      store.fetchTenantInvoices(id),
      store.fetchTenantPayments(id),
    ])
  }
})

/* =====================================================
   PROPERTY TABLE COLUMNS
===================================================== */
const propertyColumns: ColumnDef<any>[] = [
  {
    id: 'sn',
    header: '#',
    cell: ({ row }) => {
      const page = store.properties.page ?? 1
      const pageSize = store.properties.pageSize ?? 10

      return (page - 1) * pageSize + row.index + 1
    },
  },
  { accessorKey: 'propertyUnit', header: 'Unit' },
  { accessorKey: 'propertyName', header: 'Property Name' },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(
        Badge,
        {
          class:
            row.original.status === 'Occupied'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700',
        },
        { default: () => row.original.status },
      ),
  },
]

/* =====================================================
   INVOICE TABLE COLUMNS
===================================================== */
const invoiceColumns: ColumnDef<any>[] = [
  {
    id: 'sn',
    header: '#',
    cell: ({ row }) => {
      const page = store.invoices.page ?? 1
      const pageSize = store.invoices.pageSize ?? 10

      return (page - 1) * pageSize + row.index + 1
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => formatDate(row.original.dueDate),
  },

  {
    accessorKey: 'invoiceDate',
    header: 'Issued On',
    cell: ({ row }) => formatDate(row.original.invoiceDate),
  },

  {
    accessorKey: 'lastPaymentDate',
    header: 'Last Payment',
    cell: ({ row }) => formatDate(row.original.lastPaymentDate),
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(
        Badge,
        {
          class:
            row.original.status === 'Paid'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700',
        },
        { default: () => row.original.status },
      ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'amountPaid',
    header: 'Amount Paid',
  },
  {
    accessorKey: 'balance',
    header: 'Balance',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      h(
        DropdownMenu,
        {},
        {
          default: () => [
            h(
              DropdownMenuTrigger,
              { asChild: true },
              {
                default: () =>
                  h('button', { class: 'p-2 rounded-md hover:bg-muted', type: 'button' }, [
                    h(MoreVertical, { class: 'h-4 w-4' }),
                  ]),
              },
            ),
            h(
              DropdownMenuContent,
              { class: 'w-40' },
              {
                default: () => [
                  h(
                    DropdownMenuItem,
                    {
                      type: 'button',
                      onClick: () => openPaymentModal(row.original),
                    },
                    { default: () => 'Make Payment' },
                  ),
                ],
              },
            ),
          ],
        },
      ),
  },
]

/* =====================================================
   PAYMENT TABLE COLUMNS
===================================================== */
const paymentColumns: ColumnDef<any>[] = [
  {
    id: 'sn',
    header: '#',
    cell: ({ row }) => {
      const page = store.payments.page ?? 1
      const pageSize = store.payments.pageSize ?? 10

      return (page - 1) * pageSize + row.index + 1
    },
  },
  { accessorKey: 'amountPaid', header: 'Amount (GHS)' },

  {
    accessorKey: 'paymentDate',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.paymentDate),
  },

  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
]
const fromDate = ref<CalendarDate | undefined>()
const toDate = ref<CalendarDate | undefined>()

function applyDateRange() {
  store.dateRange.start = fromDate.value
    ? fromDate.value.toDate(getLocalTimeZone()).toISOString()
    : null

  store.dateRange.end = toDate.value ? toDate.value.toDate(getLocalTimeZone()).toISOString() : null

  store.fetchTenantInvoices(route.params.id as string)
}

function applyPaymentDateRange() {
  store.payments.page = 1

  store.dateRange.start = fromDate.value
    ? fromDate.value.toDate(getLocalTimeZone()).toISOString()
    : null

  store.dateRange.end = toDate.value ? toDate.value.toDate(getLocalTimeZone()).toISOString() : null

  store.fetchTenantPayments(route.params.id as string)
}

async function submitPayment() {
  loading.value = true

  const response = await store.makePayment(paymentModel.value)

  loading.value = false

  if (response.status === 0) {
    showPaymentModal.value = false
    store.fetchTenantInvoices(store.tenantId)
    store.fetchTenantPayments(store.tenantId)
  }
}
</script>

<template>
  <div class="w-full p-6 space-y-6">
    <!-- HEADER -->
    <h1 class="text-3xl font-bold">Tenant Details</h1>
    <p class="text-slate-600">Properties • Invoices • Payments</p>

    <!-- TABS -->
    <Tabs default-value="properties" class="w-full">
      <TabsList>
        <TabsTrigger value="properties">Properties</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>

      <!-- ===================================================== -->
      <!-- PROPERTIES TAB -->
      <!-- ===================================================== -->
      <TabsContent value="properties">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Properties</CardTitle>
          </CardHeader>

          <CardContent>
            <template v-if="store.loading">
              <Skeleton class="h-6 w-full" />
            </template>

            <template v-else>
              <DataTable
                :columns="propertyColumns"
                :data="store.properties.data ?? []"
                :loading="store.loading"
                :page="store.properties.page ?? 1"
                :pageSize="store.properties.pageSize ?? 10"
                :totalCount="store.properties.totalCount ?? 0"
                :onPageChange="store.changePropertyPage"
                :onPageSizeChange="store.changePropertyPageSize"
              >
                <template #toolbar>
                  <h2 class="text-xl font-semibold">Assigned Properties</h2>
                </template>
              </DataTable>
            </template>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ===================================================== -->
      <!-- INVOICES TAB -->
      <!-- ===================================================== -->
      <TabsContent value="invoices">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>

          <CardContent>
            <template v-if="store.loading">
              <Skeleton class="h-6 w-full" />
            </template>

            <template v-else>
              <div class="flex items-end gap-4 py-2">
                <!-- FROM DATE -->
                <div class="flex flex-col">
                  <label class="text-sm text-muted-foreground mb-1">From date</label>

                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-[180px] justify-start text-left font-normal"
                        type="button"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />

                        {{ fromDate ? fromDate.toString() : 'Select date' }}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="fromDate" initial-focus />
                    </PopoverContent>
                  </Popover>
                </div>

                <!-- TO DATE -->
                <div class="flex flex-col">
                  <label class="text-sm text-muted-foreground mb-1">To date</label>

                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-[180px] justify-start text-left font-normal"
                        type="button"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ toDate ? toDate.toString() : 'Select date' }}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="toDate" initial-focus />
                    </PopoverContent>
                  </Popover>
                </div>

                <!-- APPLY BUTTON -->
                <div class="flex flex-col">
                  <label class="text-sm text-transparent mb-1">.</label>
                  <Button type="button" @click="applyDateRange">Apply</Button>
                </div>
              </div>

              <DataTable
                :columns="invoiceColumns"
                :data="store.invoices.data ?? []"
                :loading="store.loading"
                :page="store.invoices.page ?? 1"
                :pageSize="store.invoices.pageSize ?? 10"
                :totalCount="store.invoices.totalCount ?? 0"
                :onPageChange="store.changeInvoicePage"
                :onPageSizeChange="store.changeInvoicePageSize"
                enableExport
              >
                <template>
                  <div class="text-center p-6 text-muted-foreground">
                    No payments found for selected date range.
                  </div>
                </template>
                <template #toolbar>
                  <h2 class="text-xl font-semibold">Tenant Invoices</h2>
                </template>
              </DataTable>
            </template>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ===================================================== -->
      <!-- PAYMENTS TAB -->
      <!-- ===================================================== -->
      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>

          <CardContent>
            <template v-if="store.loading">
              <Skeleton class="h-6 w-full" />
            </template>

            <template v-else>
              <div class="flex items-end gap-4 py-2">
                <!-- FROM DATE -->
                <div class="flex flex-col">
                  <label class="text-sm text-muted-foreground mb-1">From date</label>

                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-[180px] justify-start text-left font-normal"
                        type="button"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />

                        {{ fromDate ? fromDate.toString() : 'Select date' }}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="fromDate" initial-focus />
                    </PopoverContent>
                  </Popover>
                </div>

                <!-- TO DATE -->
                <div class="flex flex-col">
                  <label class="text-sm text-muted-foreground mb-1">To date</label>

                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-[180px] justify-start text-left font-normal"
                        type="button"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ toDate ? toDate.toString() : 'Select date' }}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="toDate" initial-focus />
                    </PopoverContent>
                  </Popover>
                </div>

                <!-- APPLY BUTTON -->
                <div class="flex flex-col">
                  <label class="text-sm text-transparent mb-1">.</label>
                  <Button type="button" @click="applyPaymentDateRange">Apply</Button>
                </div>
              </div>
              <DataTable
                :columns="paymentColumns"
                :data="store.payments.data ?? []"
                :loading="store.loading"
                :page="store.payments.page ?? 1"
                :pageSize="store.payments.pageSize ?? 10"
                :totalCount="store.payments.totalCount ?? 0"
                :onPageChange="store.changePaymentsPage"
                :onPageSizeChange="store.changePaymentsPageSize"
              >
                <template #toolbar>
                  <h2 class="text-xl font-semibold">Payment History</h2>
                </template>
              </DataTable>
            </template>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
  <!-- MAKE PAYMENT MODAL -->
  <Dialog v-model:open="showPaymentModal">
    <DialogContent class="max-w-md space-y-4">
      <DialogHeader>
        <DialogTitle class="text-lg font-semibold">Make Payment</DialogTitle>
      </DialogHeader>

      <!-- FORM -->
      <div class="space-y-3">
        <div>
          <label class="text-sm">Amount</label>
          <Input v-model="paymentModel.paymentAmount" type="number" />
        </div>

        <div class="space-y-2">
          <Label>Payment Method</Label>

          <Select v-model="paymentModel.paymentMethod">
            <SelectTrigger>
              <SelectValue placeholder="Cash / Momo / Bank" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Momo">Momo</SelectItem>
              <SelectItem value="Bank">Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label class="text-sm">Payment Date</label>
          <Input v-model="paymentModel.paymentDate" type="datetime-local" />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="showPaymentModal = false">Cancel</Button>

        <!-- SUBMIT WITH LOADING SPINNER -->
        <Button :disabled="loading" @click="submitPayment">
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16z"
              />
            </svg>
            Processing...
          </span>

          <span v-else>Submit</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
