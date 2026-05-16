<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant.store'
import DataTable from '@/components/ui/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import Tenant from '@/models/Tenant/tenant.model'
import { CalendarDate } from '@internationalized/date'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { h } from 'vue'
import { MoreVertical } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { CalendarIcon } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

import router from '@/router'
import StatusConstants from '@/constants/status.constants'

// STORE
const store = useTenantStore()
const selectedTenant = ref<Tenant | null>(null)

const showDeleteModal = ref(false)
const showEditModal = ref(false)

onMounted(() => {
  store.fetchTenants()
})

async function confirmDelete() {
  if (!selectedTenant.value) return

  await store.deleteTenant(selectedTenant.value.tenantId)
  showDeleteModal.value = false
  store.fetchTenants()
}

function runSearch() {
  store.tenants.page = 1
  store.fetchTenants()
}

// -------------------- COLUMNS --------------------

const columns: ColumnDef<Tenant>[] = [
  {
    id: 'sn',
    header: '#',
    cell: ({ row }) => {
      const page = store.tenants.page ?? 1
      const pageSize = store.tenants.pageSize ?? 10

      return (page - 1) * pageSize + row.index + 1
    },
  },
  { accessorKey: 'fullName', header: 'Full Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phoneNumber', header: 'Phone' },

  {
    accessorKey: 'isAssigned',
    header: 'Assignment',
    cell: ({ row }) =>
      h(
        Badge,
        {
          class: row.original.isAssigned
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800',
        },
        { default: () => (row.original.isAssigned ? 'Assigned' : 'Unassigned') },
      ),
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const tenant = row.original

      return h(
        DropdownMenu,
        {},
        {
          default: () => [
            // Trigger button (IMPORTANT FIX: type="button")
            h(
              DropdownMenuTrigger,
              { asChild: true },
              {
                default: () =>
                  h(
                    'button',
                    {
                      class: 'p-2 rounded-md hover:bg-muted transition',
                      type: 'button',
                    },
                    [h(MoreVertical, { class: 'h-4 w-4' })],
                  ),
              },
            ),

            // Menu content
            h(
              DropdownMenuContent,
              { class: 'w-40' },
              {
                default: () => [
                  h(
                    DropdownMenuItem,
                    {
                      type: 'button',
                      onClick: () => {
                        selectedTenant.value = tenant
                        router.push({
                          name: 'TenantDetail',
                          params: { id: tenant.tenantId },
                        })
                      },
                    },
                    { default: () => 'View' },
                  ),

                  h(
                    DropdownMenuItem,
                    {
                      type: 'button',
                      onClick: () => {
                        selectedTenant.value = { ...tenant }
                        showEditModal.value = true
                      },
                    },
                    { default: () => 'Edit' },
                  ),

                  h(
                    DropdownMenuItem,
                    {
                      type: 'button',
                      class: 'text-red-600',
                      onClick: () => {
                        selectedTenant.value = tenant
                        showDeleteModal.value = true
                      },
                    },
                    { default: () => 'Delete' },
                  ),
                ],
              },
            ),
          ],
        },
      )
    },
  },
]

async function saveEdit() {
  if (!selectedTenant.value) return

  const model = {
    tenantId: selectedTenant.value.tenantId,
    fullName: selectedTenant.value.fullName,
    email: selectedTenant.value.email,
    phoneNumber: selectedTenant.value.phoneNumber,
    nationalId: selectedTenant.value.nationalId,
  }

  const response = await store.updateTenant(model)

  if (response.status === StatusConstants.SUCCESS) {
    showEditModal.value = false
    await router.push('/alltenants')
  }
}

function handlePageChange(page: number) {
  store.tenants.page = page
  store.fetchTenants()
}

function handlePageSizeChange(size: number) {
  store.tenants.pageSize = size
  store.tenants.page = 1
  store.fetchTenants()
}
// DATE RANGE STATES
const fromDate = ref<CalendarDate | undefined>()
const toDate = ref<CalendarDate | undefined>()

function applyDateRange() {
  store.dateRange.start = fromDate.value ? new Date(fromDate.value.toString()).toISOString() : null

  store.dateRange.end = toDate.value ? new Date(toDate.value.toString()).toISOString() : null

  runSearch()
}
</script>

<!-- TEMPLATE -->
<template>
  <div class="p-6 space-y-6">
    <!-- PAGE HEADER -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Tenants</h1>
        <p class="text-sm text-muted-foreground">
          Manage and review all tenant records in your system.
        </p>
      </div>

      <Button type="button" variant="default" @click="router.push('/addtenant')">
        Add Tenant
      </Button>
    </div>

    <div class="flex items-center gap-3">
      <!-- SEARCH -->
      <Input v-model="store.tenants.search" placeholder="Search tenants..." class="max-w-xs" />

      <!-- DATE RANGE FILTER -->
      <!-- (This was your original placeholder before rewriting everything) -->
      <!-- DATE RANGE PICKER (SHADCN 2 INPUTS) -->
      <!-- DATE RANGE PICKER (SHADCN 2 INPUTS) -->
      <!-- DATE RANGE PICKER -->

      <div class="flex items-center gap-2">
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
        <Button type="button" @click="applyDateRange">Apply</Button>
      </div>
    </div>

    <!-- TABLE -->
    <DataTable
      :columns="columns"
      :data="store.tenants.data"
      :loading="store.loading"
      :page="store.tenants.page"
      :pageSize="store.tenants.pageSize"
      :totalCount="store.tenants.totalCount"
      :onPageChange="handlePageChange"
      :onPageSizeChange="handlePageSizeChange"
      enableExport
    >
      <template #toolbar>
        <h2 class="text-xl font-semibold">Tenant List</h2>
      </template>
    </DataTable>
  </div>

  <!-- DELETE MODAL -->
  <Dialog v-model:open="showDeleteModal">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
      </DialogHeader>

      <p>
        Are you sure you want to delete <strong>{{ selectedTenant?.fullName }}</strong
        >?
      </p>

      <DialogFooter>
        <Button type="button" variant="outline" @click="showDeleteModal = false">Cancel</Button>
        <Button type="button" variant="destructive" @click="confirmDelete">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- EDIT MODAL -->
  <Dialog v-model:open="showEditModal">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>Edit Tenant</DialogTitle>
      </DialogHeader>

      <div class="space-y-3">
        <div>
          <Label>Full Name</Label>
          <Input v-model="selectedTenant!.fullName" />
        </div>

        <div>
          <Label>Email</Label>
          <Input v-model="selectedTenant!.email" />
        </div>

        <div>
          <Label>Phone</Label>
          <Input v-model="selectedTenant!.phoneNumber" />
        </div>

        <div>
          <Label>National ID</Label>
          <Input v-model="selectedTenant!.nationalId" />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" @click="showEditModal = false">Cancel</Button>
        <Button type="button" @click="saveEdit">Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
