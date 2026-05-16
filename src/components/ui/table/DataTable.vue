<script setup lang="ts" generic="T">
import { useVueTable, getCoreRowModel } from '@tanstack/vue-table'
import type { ColumnDef } from '@tanstack/vue-table'

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { computed } from 'vue'
import { FlexRender } from '@tanstack/vue-table'

interface Props {
  columns: ColumnDef<T>[]
  data: T[]
  loading: boolean

  page: number
  pageSize: number
  totalCount: number

  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void

  enableExport?: boolean
}

const props = defineProps<Props>()

function exportExcel() {
  const ws = XLSX.utils.json_to_sheet(props.data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buffer]), 'table.xlsx')
}

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
})

const totalPages = computed(() => Math.ceil(props.totalCount / props.pageSize))

// Page sizes available
const pageSizes = [10, 20, 50, 100]

// Emit page-size change

function handlePageSizeChange(e: Event) {
  const target = e.target as HTMLSelectElement | null
  if (!target) return

  props.onPageSizeChange?.(Number(target.value))
}
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex justify-between items-center mb-4">
      <slot name="toolbar"></slot>

      <Button v-if="props.enableExport" @click="exportExcel" class="px-3 py-2 ml-4">
        Export
      </Button>
    </div>

    <!-- Table -->
    <div class="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="col in props.columns" :key="col.id">
              {{ col.header }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <!-- Loading skeleton -->
          <template v-if="props.loading">
            <TableRow v-for="n in 8" :key="n">
              <TableCell v-for="col in props.columns" :key="col.id">
                <Skeleton class="h-4 w-full" />
              </TableCell>
            </TableRow>
          </template>

          <!-- Data -->
          <template v-else>
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>

            <TableRow v-if="props.data.length === 0">
              <TableCell :colspan="props.columns.length" class="text-center py-4">
                No records found
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6">
      <!-- Page info -->
      <div>Page {{ props.page }} of {{ totalPages }}</div>

      <!-- Page size selector -->
      <div class="flex items-center gap-3">
        <label class="text-sm text-slate-600">Rows per page:</label>

        <select
          class="border rounded-md px-2 py-1 bg-white text-sm"
          :value="props.pageSize"
          @change="handlePageSizeChange"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Prev/Next -->
      <div class="flex gap-2">
        <Button
          variant="outline"
          :disabled="props.page === 1"
          @click="props.onPageChange(props.page - 1)"
        >
          Previous
        </Button>

        <Button
          variant="outline"
          :disabled="props.page === totalPages"
          @click="props.onPageChange(props.page + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
