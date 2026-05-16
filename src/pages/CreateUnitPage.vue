<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePropertyStore } from '@/stores/property.store'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const route = useRoute()
const store = usePropertyStore()

const showAddModal = ref(false)

const form = ref({
  propertyId: route.params.id as string,
  unitName: '',
  description: '',
  status: 'Vacant',
  rentPrice: 0,
})

async function submit() {
  await store.createUnit(form.value)
  showAddModal.value = false

  form.value.unitName = ''
  form.value.description = ''
  form.value.status = 'Vacant'
  form.value.rentPrice = 0
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Property Units</h1>
      <Button @click="showAddModal = true">+ Add Unit</Button>
    </div>

    <!-- SKELETON -->
    <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton v-for="i in 6" :key="i" class="h-40 rounded-xl" />
    </div>

    <!-- UNIT GRID -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="unit in store.units"
        :key="unit.unitName"
        class="rounded-xl shadow hover:shadow-lg transition"
      >
        <CardHeader>
          <CardTitle>{{ unit.unitName }}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-slate-600">
          <p>Status: {{ unit.status }}</p>
          <p>Rent: GHS {{ unit.rentPrice }}</p>
          <p class="text-sm">{{ unit.description }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- ADD UNIT MODAL -->
    <Dialog v-model:open="showAddModal">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Unit</DialogTitle>
        </DialogHeader>

        <div class="space-y-4 mt-4">
          <div>
            <Label>Unit Name</Label>
            <Input v-model="form.unitName" />
          </div>

          <div>
            <Label>Description</Label>
            <Input v-model="form.description" />
          </div>

          <div>
            <Label>Status</Label>
            <Input v-model="form.status" />
          </div>

          <div>
            <Label>Rent Price (GHS)</Label>
            <Input type="number" v-model="form.rentPrice" />
          </div>

          <Button class="w-full mt-2" @click="submit"> Add Unit </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
