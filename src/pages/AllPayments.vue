<script setup lang="ts">
import { onMounted, h, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant.store'
import DataTable from '@/components/ui/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import Payment from '@/models/TenantDetail/payments.model'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/utils/DateUtils'
import { CalendarIcon } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import type { CalendarDate } from '@internationalized/date'

// Store
const store = useTenantStore()

onMounted(async () => {
  await store.AllPayments()
})
const fromDate = ref<CalendarDate | undefined>()
const toDate = ref<CalendarDate | undefined>()

function applyDateRange() {
  store.dateRange.start = fromDate.value
    ? new Date(fromDate.value.toString()).toISOString()
    : undefined

  store.dateRange.end = toDate.value ? new Date(toDate.value.toString()).toISOString() : undefined

  // reset pagination when filtering
  store.allpayments.page = 1
  store.AllPayments()
}

/* ================================
   TABLE COLUMNS
================================ */
const paymentColumns: ColumnDef<Payment>[] = [
  { accessorKey: 'paymentId', header: 'Payment ID' },

  {
    accessorKey: 'amountPaid',
    header: 'Amount (GHS)',
  },

  {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
    cell: ({ row }) => formatDate(row.original.paymentDate),
  },

  {
    accessorKey: 'paymentMethod',
    header: 'Method',
    cell: ({ row }) =>
      h(
        Badge,
        { class: 'bg-blue-100 text-blue-800' },
        { default: () => row.original.paymentMethod },
      ),
  },

  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
]

function handlePageChange(page: number) {
  store.allpayments.page = page
  store.AllPayments()
}

function handlePageSizeChange(size: number) {
  store.allpayments.pageSize = size
  store.allpayments.page = 1
  store.AllPayments()
}
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-3xl font-bold tracking-tight">All Payments</h1>
    <p class="text-sm text-muted-foreground">View every payment across the system.</p>

    <Card>
      <CardHeader>
        <CardTitle>Payment Records</CardTitle>
      </CardHeader>

      <CardContent>
        <template v-if="store.loading">
          <Skeleton class="h-6 w-full" />
        </template>

        <template v-else>
          <div class="flex items-center gap-2 mb-4">
            <!-- FROM DATE -->
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-[170px] justify-start text-left font-normal"
                  type="button"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ fromDate ? fromDate.toString() : 'From date' }}
                </Button>
              </PopoverTrigger>

              <PopoverContent class="w-auto p-0">
                <Calendar v-model="fromDate" initial-focus />
              </PopoverContent>
            </Popover>

            <!-- TO DATE -->
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-[170px] justify-start text-left font-normal"
                  type="button"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ toDate ? toDate.toString() : 'To date' }}
                </Button>
              </PopoverTrigger>

              <PopoverContent class="w-auto p-0">
                <Calendar v-model="toDate" initial-focus />
              </PopoverContent>
            </Popover>

            <!-- APPLY -->
            <Button type="button" @click="applyDateRange"> Apply </Button>
          </div>

          <DataTable
            :columns="paymentColumns"
            :data="store.allpayments.data ?? []"
            :loading="store.loading"
            :page="store.allpayments.page ?? 1"
            :pageSize="store.allpayments.pageSize ?? 10"
            :totalCount="store.allpayments.totalCount ?? 0"
            :onPageChange="handlePageChange"
            :onPageSizeChange="handlePageSizeChange"
            enableExport
            ><template>
              <div class="py-10 text-center text-muted-foreground">
                No payments found for the selected date range.
              </div>
            </template>
            <template #toolbar>
              <h2 class="text-xl font-semibold">All Payments</h2>
            </template>
          </DataTable>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
