<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useRepairStore } from '@/stores/repair.store'
import DataTable from '@/components/ui/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import type { DateValue } from '@internationalized/date'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-vue-next'
import { format } from 'date-fns'

import Label from '@/components/ui/label/Label.vue'

const store = useRepairStore()

const fromDate = ref<DateValue | undefined>()
const endDate = ref<DateValue | undefined>()

onMounted(() => {
  store.fetchAllRepairs()
})

async function applyFilters() {
  store.dateRange.start = fromDate.value ? fromDate.value.toDate('UTC').toISOString() : null

  store.dateRange.end = endDate.value ? endDate.value.toDate('UTC').toISOString() : null

  await store.fetchAllRepairs()
}

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'Property',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(
        Badge,
        {
          class:
            row.original.status === 'Completed'
              ? 'bg-green-200 text-green-700'
              : 'bg-yellow-200 text-yellow-700',
        },
        { default: () => row.original.status },
      ),
  },
  {
    accessorKey: 'cost',
    header: 'Cost (GHS)',
  },
  {
    accessorKey: 'completedDate',
    header: 'Completed',
    cell: ({ row }) => format(new Date(row.original.completedDate), 'dd/MM/yyyy'),
  },
]
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-3xl font-bold">All Repairs</h1>
    <Card>
      <CardHeader>
        <CardTitle>Repairs</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-end gap-6">
          <!-- DATE FILTERS -->
          <div class="flex items-end gap-4">
            <!-- FROM -->
            <div class="flex flex-col">
              <Label class="text-sm mb-1">From</Label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" class="w-[180px] justify-start text-left">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ fromDate ? fromDate.toString() : 'From date' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar v-model="fromDate" />
                </PopoverContent>
              </Popover>
            </div>

            <!-- TO -->
            <div class="flex flex-col">
              <Label class="text-sm mb-1">To</Label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" class="w-[180px] justify-start text-left">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ endDate ? endDate.toString() : 'To date' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar v-model="endDate" />
                </PopoverContent>
              </Popover>
            </div>

            <Button class="h-[40px]" @click="applyFilters">Apply</Button>
          </div>
        </div>

        <DataTable
          :columns="columns"
          :data="store.allRepairs?.data ?? []"
          :loading="store.loading"
          :page="store.allRepairs?.page ?? 1"
          :pageSize="store.allRepairs?.pageSize ?? 10"
          :totalCount="store.allRepairs?.totalCount ?? 0"
          :onPageChange="store.changeAllRepairsPage"
          :onPageSizeChange="store.changeAllRepairsPageSize"
        />
      </CardContent>
    </Card>
  </div>
</template>
