<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePropertyStore } from '@/stores/property.store'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

import { Home, MapPin, BedDouble, PlusCircle } from 'lucide-vue-next'
import router from '@/router'

const store = usePropertyStore()

const search = ref('')
const filterType = ref<string | null>(null)
const filterStatus = ref<string | null>(null)

onMounted(() => {
  store.fetchProperties()
})

const filteredProperties = computed(() => {
  return store.properties.filter((p) => {
    const matchesSearch =
      p.propertyName.toLowerCase().includes(search.value.toLowerCase()) ||
      p.location.toLowerCase().includes(search.value.toLowerCase())

    const matchesType = filterType.value ? p.propertyType === filterType.value : true
    const matchesStatus = filterStatus.value ? p.occupancyStatus === filterStatus.value : true

    return matchesSearch && matchesType && matchesStatus
  })
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">All Properties</h1>
        <p class="text-sm text-muted-foreground">Manage and explore all properties</p>
      </div>

      <!-- FIXED BUTTON -->
      <Button class="flex items-center gap-2" @click="router.push('/addproperty')">
        <PlusCircle class="w-4 h-4" />
        Add Property
      </Button>
    </div>

    <!-- FILTERS -->
    <div class="flex flex-wrap gap-4 items-center">
      <Input v-model="search" placeholder="Search by name or location..." class="max-w-xs" />

      <Select v-model="filterType">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Property Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Rent">Rent</SelectItem>
          <SelectItem value="Work & Pay">Work & Pay</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="filterStatus">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Vacant">Vacant</SelectItem>
          <SelectItem value="Occupied">Occupied</SelectItem>
          <SelectItem value="Sold">Sold</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- PROPERTY GRID -->
    <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      <Skeleton v-for="n in 6" :key="n" class="h-[280px] w-full rounded-xl" />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      <Card
        v-for="property in filteredProperties"
        :key="property.propertyId"
        class="overflow-hidden rounded-xl hover:shadow-lg transition border"
      >
        <img
          v-if="property.pictures.length > 0"
          :src="property.pictures?.[0]?.filePath || '/images/placeholder.png'"
          class="h-40 w-full object-cover"
        />

        <div
          v-else
          class="h-40 w-full bg-slate-200 flex items-center justify-center text-slate-500"
        >
          <Home class="w-10 h-10" />
        </div>

        <CardHeader class="pb-2">
          <CardTitle class="flex justify-between items-center">
            {{ property.propertyName }}
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
          </CardTitle>
        </CardHeader>

        <CardContent class="space-y-2 text-sm text-slate-600">
          <div class="flex items-center gap-2">
            <MapPin class="w-4 h-4 text-slate-500" />
            <span>{{ property.location }}</span>
          </div>

          <div class="flex items-center gap-2">
            <BedDouble class="w-4 h-4 text-slate-500" />
            <span>{{ property.totalUnits }} Units • {{ property.vacantUnits }} Vacant</span>
          </div>

          <p class="font-semibold text-slate-700">
            GHS {{ property.sellingPrice?.toLocaleString() }}
          </p>
          <CardFooter>
            <Button
              class="w-full mt-2"
              variant="outline"
              @click="
                router.push({
                  name: 'PropertyDetail',
                  params: { id: property.propertyId },
                })
              "
            >
              View Details
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="!store.loading && filteredProperties.length === 0" class="text-center py-10">
      <p class="text-lg text-slate-500">No properties found.</p>
    </div>
  </div>
</template>

<style>
.slide-in-from-right {
  animation: slideInRight 0.35s ease-out;
}
@keyframes slideInRight {
  from {
    transform: translateX(60px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
