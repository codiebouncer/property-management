<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUnitTenantStore } from '@/stores/unitTenant.store'
import DataTable from '@/components/ui/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import UnitWithTenant from '@/models/Property/unitwithtenant.model'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from 'date-fns'
import { h } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import UpdateTenantModal from '@/components/UpdateTenantModal.vue'

const router = useRouter()

// Store & Route
const store = useUnitTenantStore()
const route = useRoute()
const openUpdate = ref(false)
const selectedId = ref<string | null>(null)

function openUpdateModal(id: string) {
  selectedId.value = id
  openUpdate.value = true
}

onMounted(() => {
  const propertyId = route.params.id as string
  if (propertyId) {
    store.fetchUnits(propertyId)
  }
})

/* ===========================
   TABLE COLUMNS
=========================== */
const columns: ColumnDef<UnitWithTenant>[] = [
  {
    header: '#',
    cell: ({ row }) => (store.units.page - 1) * store.units.pageSize + row.index + 1,
  },

  {
    accessorKey: 'unitName',
    header: 'Unit',
  },
  {
    accessorKey: 'tenantName',
    header: 'Tenant',
  },
  {
    accessorKey: 'tenantEmail',
    header: 'Email',
  },
  {
    accessorKey: 'tenantPhone',
    header: 'Phone',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => formatDate(row.original.startDate, 'dd/MM/yyyy'),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => formatDate(row.original.endDate, 'dd/MM/yyyy'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'amountDue',
    header: 'Amount Due',
  },
  {
    accessorKey: 'initialDeposit',
    header: 'Initial Deposit',
  },
  {
    accessorKey: 'installmentAmount',
    header: 'Installment Amount',
  },
  {
    accessorKey: 'totalInstallments',
    header: 'Total Installments',
  },
  {
    accessorKey: 'planName',
    header: 'Plan Name',
  },
  {
    accessorKey: 'tenantCredit',
    header: 'Tenant Credit',
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const record = row.original

      return h(
        DropdownMenu,
        {},
        {
          default: () => [
            h(
              DropdownMenuTrigger,
              { asChild: true },
              {
                default: () =>
                  h(
                    Button,
                    { variant: 'ghost', class: 'h-8 w-8 p-0' },
                    { default: () => h(MoreHorizontal, { class: 'h-4 w-4' }) },
                  ),
              },
            ),

            h(
              DropdownMenuContent,
              { align: 'end' },
              {
                default: () => [
                  // View History
                  h(
                    DropdownMenuItem,
                    {
                      onClick: () =>
                        router.push(`/property-tenant/${record.propertyTenantId}/history`),
                    },
                    { default: () => 'View History' },
                  ),

                  // Update Tenant
                  h(
                    DropdownMenuItem,
                    {
                      onClick: () => openUpdateModal(record.propertyTenantId),
                    },
                    { default: () => 'Update Tenant' },
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
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-3xl font-bold tracking-tight">Units & Tenants</h1>
    <p class="text-muted-foreground">Active tenants assigned to units in this property.</p>

    <Card>
      <CardHeader>
        <CardTitle>Assignments</CardTitle>
      </CardHeader>

      <CardContent>
        <template v-if="store.loading">
          <Skeleton class="h-6 w-full" />
          <Skeleton class="h-6 w-full mt-2" />
        </template>

        <template v-else>
          <div class="w-full overflow-x-auto">
            <DataTable
              :columns="columns"
              :data="store.units.data ?? []"
              :loading="store.loading"
              :page="store.units.page ?? 1"
              :pageSize="store.units.pageSize ?? 10"
              :totalCount="store.units.totalCount ?? 0"
              :onPageChange="store.changePage"
              :onPageSizeChange="store.changePageSize"
            >
              <template>
                <div class="text-center p-6 text-muted-foreground">
                  No units with active tenants found.
                </div>
              </template>

              <template #toolbar>
                <h2 class="text-xl font-semibold">Units & Tenants</h2>
              </template>
            </DataTable>
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
  <UpdateTenantModal
    v-model:open="openUpdate"
    :propertyTenantId="selectedId"
    @updated="store.fetchUnits(store.propertyId!)"
  />
</template>
