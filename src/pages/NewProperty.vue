<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface PropertyForm {
  name: string
  type: 'Rent' | 'Work & Pay'
  status: 'Occupied' | 'Vacant' | 'Sold'
  units: number | null
  costPrice: number | null
  sellingPrice: number | null
  location: string
}

const property = ref<PropertyForm>({
  name: '',
  type: 'Rent',
  status: 'Vacant',
  units: null,
  costPrice: null,
  sellingPrice: null,
  location: '',
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Add New Property</h1>

    <Card class="max-w-3xl mx-auto shadow-md border rounded-2xl">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-slate-700 dark:text-slate-200">
          Property Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Property Name -->
          <div>
            <label class="block mb-1 font-medium text-sm text-slate-600 dark:text-slate-300">
              Property Name
            </label>
            <Input v-model="property.name" placeholder="e.g. Sunrise Apartments" />
          </div>

          <!-- Location -->
          <div>
            <label class="block mb-1 font-medium text-sm text-slate-600 dark:text-slate-300">
              Location
            </label>
            <Input v-model="property.location" placeholder="e.g. East Legon, Accra" />
          </div>

          <!-- Property Type -->
          <div>
            <label class="block mb-1 font-medium text-sm text-slate-600 dark:text-slate-300">
              Property Type
            </label>
            <Select v-model="property.type">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Work & Pay">Work & Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Status -->
          <div>
            <label class="block mb-1 font-medium text-sm text-slate-600 dark:text-slate-300">
              Status
            </label>
            <Select v-model="property.status">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Occupied">Occupied</SelectItem>
                <SelectItem value="Vacant">Vacant</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Number of Units -->
          <div>
            <label class="block mb-1 font-medium text-sm text-slate-600 dark:text-slate-300">
              Number of Units
            </label>
            <Input type="number" placeholder="e.g. 10" />
          </div>

          <!-- Cost Price -->
          <div>
            <label class="block mb-1 font-medium text-sm text-slate-600 dark:text-slate-300">
              Cost Price ($)
            </label>
            <Input type="number" placeholder="e.g. 50000" />
          </div>

          <!-- Selling Price -->
          <div>
            <label class="block mb-1 font-medium text-sm text-slate-600 dark:text-slate-300">
              Selling Price ($)
            </label>
            <Input type="number" placeholder="e.g. 65000" />
          </div>
        </form>

        <!-- Submit -->
        <div class="mt-6 flex justify-end">
          <Button class="px-6 py-2 font-medium">Add Property</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
