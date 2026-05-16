<script setup lang="ts">
import { ref, shallowRef, onMounted, h } from 'vue'
import { useRoute } from 'vue-router'
import { useRepairStore } from '@/stores/repair.store'
import DataTable from '@/components/ui/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Loader2, CalendarIcon, Plus } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { formatDate } from '@/utils/DateUtils'
import type { DateValue } from 'reka-ui'
import { usePropertyStore } from '@/stores/property.store'

// Store
const store = useRepairStore()
const propstore = usePropertyStore()
const route = useRoute()

// Filters
const fromDate = shallowRef<DateValue>()
const toDate = shallowRef<DateValue>()

// Modal state
const showModal = ref(false)
const submitting = ref(false)

// Create repair model
const repairModel = ref({
  propertyId: route.params.id as string,
  description: '',
  cost: '',
  completedDate: '',
})

onMounted(() => {
  const id = route.params.id as string
  if (id) store.fetchRepairs(id)
})

/* ===========================
   APPLY FILTER
=========================== */
async function applyDateFilter() {
  store.dateRange.start = fromDate.value ? new Date(fromDate.value.toString()).toISOString() : null
  store.dateRange.end = toDate.value ? new Date(toDate.value.toString()).toISOString() : null

  await store.fetchRepairs(route.params.id as string)
}

/* ===========================
   SUBMIT REPAIR
=========================== */
async function submitRepair() {
  submitting.value = true

  // Build model
  const payload = {
    propertyId: repairModel.value.propertyId,
    description: repairModel.value.description,
    cost: repairModel.value.cost,
    completedDate: repairModel.value.completedDate,
  }

  const res = await propstore.createRepair(payload)
  submitting.value = false

  if (res.status === 1) {
    showModal.value = false
    repairModel.value.description = ''
    repairModel.value.cost = ''
    repairModel.value.completedDate = ''
    store.fetchRepairs(route.params.id as string)
  }
}

/* ===========================
   TABLE COLUMNS
=========================== */
const columns: ColumnDef<any>[] = [
  {
    id: 'sn',
    header: '#',
    cell: ({ row }) => {
      const page = store.repairs.page ?? 1
      const pageSize = store.repairs.pageSize ?? 10

      return (page - 1) * pageSize + row.index + 1
    },
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
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700',
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
    cell: ({ row }) => formatDate(row.original.completedDate),
  },
]
</script>

<template>
  <div class="p-6 space-y-6 max-w-5xl mx-auto">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Repair Records</h1>
        <p class="text-muted-foreground">Repairs associated with this property.</p>
      </div>

      <Button @click="showModal = true"> <Plus class="h-4 w-4 mr-2" /> Add Repair </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Repairs List</CardTitle>
      </CardHeader>

      <CardContent>
        <!-- Loading Skeleton -->
        <template v-if="store.loading">
          <Skeleton class="h-6 w-full" />
          <Skeleton class="h-6 w-full mt-2" />
          <Skeleton class="h-6 w-full mt-2" />
        </template>

        <template v-else>
          <!-- DATE FILTER -->
          <div class="flex items-end gap-4 py-3">
            <!-- FROM DATE -->
            <div class="flex flex-col">
              <label class="text-sm text-muted-foreground mb-1">From date</label>

              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" class="w-[180px] justify-start text-left">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ fromDate ? fromDate.toString() : 'Select date' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="fromDate" />
                </PopoverContent>
              </Popover>
            </div>

            <!-- TO DATE -->
            <div class="flex flex-col">
              <label class="text-sm text-muted-foreground mb-1">To date</label>

              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" class="w-[180px] justify-start text-left">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ toDate ? toDate.toString() : 'Select date' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="toDate" />
                </PopoverContent>
              </Popover>
            </div>

            <Button @click="applyDateFilter">Apply</Button>
          </div>

          <!-- TABLE -->
          <DataTable
            :columns="columns"
            :data="store.repairs?.data ?? []"
            :loading="store.loading"
            :page="store.repairs?.page ?? 1"
            :pageSize="store.repairs?.pageSize ?? 10"
            :totalCount="store.repairs?.totalCount ?? 0"
            :onPageChange="store.changePage"
            :onPageSizeChange="store.changePageSize"
          >
            <template>
              <div class="text-center p-6 text-muted-foreground">
                No repairs found for this property.
              </div>
            </template>

            <template #toolbar>
              <h2 class="text-xl font-semibold">Property Repairs</h2>
            </template>
          </DataTable>
        </template>
      </CardContent>
    </Card>

    <!-- ===========================
         CREATE REPAIR MODAL
    =========================== -->
    <Dialog v-model:open="showModal">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Repair</DialogTitle>
        </DialogHeader>

        <div class="space-y-4">
          <div>
            <Label>Description</Label>
            <Input v-model="repairModel.description" placeholder="Enter repair details" />
          </div>

          <div>
            <Label>Cost (GHS)</Label>
            <Input type="number" v-model="repairModel.cost" />
          </div>

          <div>
            <Label>Completed Date</Label>
            <Input type="datetime-local" v-model="repairModel.completedDate" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showModal = false">Cancel</Button>

          <Button @click="submitRepair" :disabled="submitting">
            <Loader2 v-if="submitting" class="h-4 w-4 animate-spin mr-2" />
            Save Repair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
