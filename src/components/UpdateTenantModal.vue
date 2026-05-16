<script setup lang="ts">
import { CalendarIcon } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { CalendarDate } from '@internationalized/date'

import { ref, watch, onMounted } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUnitTenantStore } from '@/stores/unitTenant.store'
import UpdatePropertyTenantRequest from '@/models/Property/update-tenant-request'
import { useDropdownStore } from '@/stores/dropdown.store'

/* =========================
   PROPS
========================= */
const props = defineProps<{
  open: boolean
  propertyTenantId: string | null
}>()

const emit = defineEmits(['update:open', 'updated'])

/* =========================
   STORE
========================= */
const store = useUnitTenantStore()
const dropdownStore = useDropdownStore()
onMounted(async () => {
  await dropdownStore.fetchPlans()
})

/* =========================
   STATE
========================= */
const form = ref<UpdatePropertyTenantRequest>(new UpdatePropertyTenantRequest())
const errors = ref<Record<string, string>>({})
const startDate = ref<CalendarDate | undefined>()
const loading = ref(false)

/* =========================
   VALIDATION
========================= */
function validate() {
  errors.value = {}

  if (!form.value.planId) errors.value.planId = 'Plan is required'
  if (!form.value.startDate) errors.value.startDate = 'Start date is required'
  if (!form.value.durationValue || form.value.durationValue <= 0)
    errors.value.durationValue = 'Duration must be greater than 0'
  if (!form.value.durationUnit) errors.value.durationUnit = 'Duration unit required'

  return Object.keys(errors.value).length === 0
}

/* =========================
   SUBMIT
========================= */
async function submit() {
  if (!validate()) return

  loading.value = true

  const res = await store.updatePropertyTenant(form.value)

  loading.value = false

  if (res?.status === 200) {
    emit('updated')
    emit('update:open', false)
  }
}

/* =========================
   WATCH OPEN
========================= */
watch(
  () => props.open,
  (val) => {
    if (val && props.propertyTenantId) {
      form.value = new UpdatePropertyTenantRequest()
      form.value.propertyTenantId = props.propertyTenantId
    }
  },
)
watch(startDate, (val) => {
  form.value.startDate = val ? new Date(val.toString()).toISOString() : null
})
</script>

<template>
  <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Update Tenant</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Plan -->
        <div class="space-y-2">
          <Label>Plan</Label>
          <Select v-model="form.planId">
            <SelectTrigger>
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="p in dropdownStore.plans" :key="p.planId" :value="p.planId">
                {{ p.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.planId" class="text-sm text-red-500">{{ errors.planId }}</p>
        </div>

        <!-- Start Date -->
        <div class="space-y-2">
          <Label>Start Date</Label>

          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                class="w-full justify-start text-left font-normal"
                type="button"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />

                <span v-if="startDate">
                  {{ startDate.toString() }}
                </span>

                <span v-else class="text-muted-foreground"> Select start date </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent class="w-auto p-0">
              <Calendar v-model="startDate" initial-focus />
            </PopoverContent>
          </Popover>

          <p v-if="errors.startDate" class="text-sm text-red-500">
            {{ errors.startDate }}
          </p>
        </div>

        <!-- Duration -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Duration Value</Label>
            <Input type="number" v-model.number="form.durationValue" />
            <p v-if="errors.durationValue" class="text-sm text-red-500">
              {{ errors.durationValue }}
            </p>
          </div>

          <div class="space-y-2">
            <Label>Duration Unit</Label>
            <Select v-model="form.durationUnit">
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Days">Days</SelectItem>
                <SelectItem value="Weeks">Weeks</SelectItem>
                <SelectItem value="Months">Months</SelectItem>
                <SelectItem value="Years">Years</SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.durationUnit" class="text-sm text-red-500">
              {{ errors.durationUnit }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
          <Button variant="outline" @click="emit('update:open', false)"> Cancel </Button>
          <Button :disabled="loading" @click="submit">
            {{ loading ? 'Updating...' : 'Update Tenant' }}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
