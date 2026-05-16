<script setup lang="ts">
import { onMounted, h } from 'vue'
import { useRoute } from 'vue-router'
import { usePropertyStore } from '@/stores/property.store'

import DataTable from '@/components/ui/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Badge } from '@/components/ui/badge'

const route = useRoute()
const store = usePropertyStore()

// Load units on mount
onMounted(() => {
  store.fetchUnits(route.params.id as string) // ✔ correct usage
})

// Table Columns
const columns: ColumnDef<any>[] = [
  {
    id: 'sn',
    header: '#',
    cell: ({ row }) => {
      const page = store.allunits.page ?? 1
      const pageSize = store.allunits.pageSize ?? 10

      return (page - 1) * pageSize + row.index + 1
    },
  },
  { accessorKey: 'unitName', header: 'Unit Name' },
  { accessorKey: 'rentPrice', header: 'Rent Price (GHS)' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(
        Badge,
        {
          class:
            row.original.status === 'Vacant'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700',
        },
        { default: () => row.original.status },
      ),
  },
]
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Property Units</h1>

    <DataTable
      :columns="columns"
      :data="store.allunits.data ?? []"
      :loading="store.loading"
      :page="store.allunits.page ?? 1"
      :pageSize="store.allunits.pageSize ?? 10"
      :totalCount="store.allunits.totalCount ?? 0"
      :onPageChange="store.changePage"
      :onPageSizeChange="store.changePageSize"
    />
  </div>
</template>
