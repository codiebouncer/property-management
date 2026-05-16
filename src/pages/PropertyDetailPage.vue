<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePropertyStore } from '@/stores/property.store'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MapPin, BedDouble, Image as Img } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import router from '@/router'

const route = useRoute()
const store = usePropertyStore()
const showAddUnitModal = ref(false)
// find property in store
const property = computed(() => store.properties.find((p) => p.propertyId === route.params.id))
const form = ref({
  propertyId: route.params.id as string,
  unitName: '',
  description: '',
  status: 'Vacant',
  rentPrice: 0,
})
async function submitUnit() {
  await store.createUnit(form.value)
  showAddUnitModal.value = false

  form.value.unitName = ''
  form.value.description = ''
  form.value.status = 'Vacant'
  form.value.rentPrice = 0
}
</script>

<template>
  <div class="p-8 space-y-8 max-w-6xl mx-auto" v-if="property">
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">{{ property.propertyName }}</h1>
        <p class="text-slate-600 text-sm">{{ property.location }}</p>
      </div>

      <Badge
        :class="
          property.occupancyStatus === 'Vacant'
            ? 'bg-green-100 text-green-700'
            : property.occupancyStatus === 'Occupied'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
        "
      >
        {{ property.occupancyStatus }}
      </Badge>
    </div>

    <!-- IMAGES -->
    <Card class="overflow-hidden">
      <CardHeader>
        <CardTitle>Property Images</CardTitle>
      </CardHeader>

      <CardContent>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="pic in property.pictures"
            :key="pic.pictureId"
            class="rounded-lg overflow-hidden border shadow-sm"
          >
            <img :src="pic.filePath" class="h-48 w-full object-cover" alt="Property Image" />
          </div>

          <div
            v-if="property.pictures.length === 0"
            class="h-48 w-full bg-slate-200 flex items-center justify-center rounded-lg"
          >
            <Img class="w-10 h-10 text-slate-500" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- DETAILS SECTION -->
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>

      <CardContent class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-700">
        <div class="flex items-center gap-2">
          <MapPin class="w-5 h-5 text-slate-500" />
          <span>{{ property.location }}</span>
        </div>

        <div class="flex items-center gap-2">
          <BedDouble class="w-5 h-5 text-slate-500" />
          <span>{{ property.totalUnits }} Units</span>
        </div>

        <p><strong>Type:</strong> {{ property.propertyType }}</p>

        <p v-if="property.sellingPrice">
          <strong>Price:</strong> GHS {{ property.sellingPrice.toLocaleString() }}
        </p>
      </CardContent>
    </Card>

    <!-- ACTIONS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <Button
        class="w-full"
        variant="outline"
        @click="router.push({ name: 'AllUnits', params: { id: property.propertyId } })"
        >View Units</Button
      >
      <Button class="w-full" @click="showAddUnitModal = true">Create Unit</Button>
      <Button
        class="w-full"
        variant="outline"
        @click="router.push(`/userrepairs/${property.propertyId}`)"
        >View Repairs</Button
      >
      <Button class="w-full" @click="router.push(`/userTenants/${property.propertyId}`)"
        >Tenants</Button
      >
    </div>
  </div>

  <!-- LOADING / NOT FOUND -->
  <div v-else class="text-center py-20 text-slate-500">Loading property details...</div>
  <!-- ADD UNIT MODAL -->
  <Dialog v-model:open="showAddUnitModal">
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

        <div class="space-y-2">
          <Label>Status</Label>

          <Select v-model="form.status">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Vacant">Vacant</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Rent Price (GHS)</Label>
          <Input type="number" v-model="form.rentPrice" />
        </div>

        <Button class="w-full mt-2" @click="submitUnit"> Add Unit </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
