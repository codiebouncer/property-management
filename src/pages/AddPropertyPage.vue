<script setup lang="ts">
import { ref } from 'vue'
import { usePropertyStore } from '@/stores/property.store'

// UI
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { UploadCloud, Trash2, Home } from 'lucide-vue-next'

const store = usePropertyStore()

// Loading state for submit button
const isSubmitting = ref(false)

const form = ref({
  propertyName: '',
  propertyType: '',
  location: '',
  totalUnits: 0,
  costPrice: 0,
  sellingPrice: 0,
  occupancyStatus: '',
  pictures: [] as File[],
})

// IMAGE UPLOAD
function onFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  const selected = Array.from(files)

  // Avoid duplicates
  const existingNames = new Set(form.value.pictures.map((f) => f.name))
  const unique = selected.filter((f) => !existingNames.has(f.name))

  form.value.pictures.push(...unique)
}

function removeImage(index: number) {
  form.value.pictures.splice(index, 1)
}

// Generate preview URL safely
function preview(file: File) {
  return URL.createObjectURL(file)
}

function resetForm() {
  form.value = {
    propertyName: '',
    propertyType: '',
    location: '',
    totalUnits: 0,
    costPrice: 0,
    sellingPrice: 0,
    occupancyStatus: '',
    pictures: [],
  }
}

async function submit() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  await store.createProperty(form.value)

  // Small delay for UX smoothness
  setTimeout(() => {
    isSubmitting.value = false
    resetForm()
  }, 600)
}
</script>

<template>
  <div class="p-8 space-y-10 max-w-5xl mx-auto">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold">Add New Property</h1>
        <p class="text-slate-600">Create a new property listing with images and details.</p>
      </div>

      <Home class="w-12 h-12 text-slate-400" />
    </div>

    <!-- FORM CARD -->
    <div class="bg-white border rounded-2xl p-8 shadow-sm space-y-8">
      <!-- GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <Label>Property Name</Label>
          <Input class="h-11" v-model="form.propertyName" placeholder="Sunrise Apartments" />
        </div>

        <div class="space-y-2">
          <Label>Location</Label>
          <Input class="h-11" v-model="form.location" placeholder="East Legon, Accra" />
        </div>

        <div class="space-y-2">
          <Label>Property Type</Label>
          <Select v-model="form.propertyType">
            <SelectTrigger class="h-11">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Rent">Rent</SelectItem>
              <SelectItem value="WorkAndPay">Work & Pay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label>Status</Label>
          <Select v-model="form.occupancyStatus">
            <SelectTrigger class="h-11">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vacant">Vacant</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label>Total Units</Label>
          <Input class="h-11" type="number" v-model="form.totalUnits" />
        </div>

        <div class="space-y-2">
          <Label>Cost Price (GHS)</Label>
          <Input class="h-11" type="number" v-model="form.costPrice" />
        </div>

        <div class="space-y-2">
          <Label>Selling Price (GHS)</Label>
          <Input class="h-11" type="number" v-model="form.sellingPrice" />
        </div>
      </div>

      <!-- IMAGE UPLOAD -->
      <div class="space-y-4">
        <Label class="text-lg font-semibold">Property Pictures</Label>

        <label
          class="border-2 border-dashed rounded-xl p-8 cursor-pointer text-center flex flex-col items-center justify-center hover:bg-slate-50 transition"
        >
          <UploadCloud class="w-10 h-10 text-slate-500" />
          <span class="text-slate-500 text-sm mt-2">Click to upload images</span>

          <input type="file" class="hidden" multiple @change="onFileChange" />
        </label>

        <!-- PREVIEWS -->
        <div v-if="form.pictures.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(img, index) in form.pictures"
            :key="index"
            class="relative group border rounded-xl overflow-hidden"
          >
            <img :src="preview(img)" class="w-full h-32 object-cover rounded-lg shadow" />

            <button
              @click.prevent="removeImage(index)"
              class="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- SUBMIT -->
      <div class="flex justify-end pt-4">
        <Button
          class="px-8 py-2 text-base flex items-center gap-2"
          @click="submit"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Create Property</span>

          <!-- Spinner -->
          <span v-else class="flex items-center gap-2">
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Saving...
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>
