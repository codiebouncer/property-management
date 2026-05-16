<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useDropdownStore } from '@/stores/dropdown.store'
import { usePropertyStore } from '@/stores/property.store'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-vue-next'

import { CalendarIcon } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { CalendarDate } from '@internationalized/date'

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

// STORES
const dropdownStore = useDropdownStore()
const assignStore = usePropertyStore()
const startDate = ref<CalendarDate | undefined>()
const propertySearch = ref('')
const tenantSearch = ref('')

// INITIAL LOAD
onMounted(() => {
  dropdownStore.fetchProperties()
  dropdownStore.fetchTenants()
  dropdownStore.fetchPlans()
  console.log('Plans:', dropdownStore.plans)
})

watch(
  () => assignStore.assignModel.propertyId,
  async (propId) => {
    propertySearch.value = ''
    if (!propId) return
    await dropdownStore.fetchUnits(propId)
  },
)
watch(startDate, (val) => {
  assignStore.assignModel.startDate = val ? new Date(val.toString()).toISOString() : null
})
const filteredProperties = computed(() => {
  if (!propertySearch.value) return dropdownStore.properties

  return dropdownStore.properties.filter((p) =>
    p.propertyName.toLowerCase().includes(propertySearch.value.toLowerCase()),
  )
})
const filteredTenants = computed(() => {
  if (!tenantSearch.value) return dropdownStore.tenants

  return dropdownStore.tenants.filter((t) =>
    `${t.fullName} ${t.phoneNumber}`.toLowerCase().includes(tenantSearch.value.toLowerCase()),
  )
})

// SUBMIT HANDLER
async function handleAssign() {
  const res = await assignStore.assignProperty()

  if (res.status === 1) {
    alert('Property assigned successfully!')
    assignStore.reset()
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
    <div class="max-w-5xl mx-auto space-y-10">
      <!-- PAGE HEADER -->
      <div class="space-y-2 text-center">
        <h1 class="text-4xl font-bold tracking-tight">Assign Property</h1>
        <p class="text-muted-foreground max-w-xl mx-auto">
          Assign a tenant to a property unit with a defined rental duration and payment plan.
        </p>
      </div>

      <!-- MAIN CARD -->
      <Card class="rounded-2xl shadow-sm border">
        <CardHeader class="pb-4">
          <CardTitle class="text-xl">Assignment Details</CardTitle>
          <CardDescription>
            Fill in the information below to complete the assignment.
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-10">
          <!-- SECTION: PROPERTY & TENANT -->
          <section class="space-y-4">
            <h3 class="text-sm font-semibold uppercase text-muted-foreground">Tenant & Property</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- PROPERTY -->
              <!-- PROPERTY -->
              <div class="space-y-2">
                <Label>Property</Label>

                <Select v-model="assignStore.assignModel.propertyId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>

                  <SelectContent>
                    <!-- 🔍 SEARCH INPUT -->
                    <div class="p-2 border-b" @mousedown.stop @click.stop @keydown.stop>
                      <Input
                        v-model="propertySearch"
                        placeholder="Search property..."
                        class="h-9"
                      />
                    </div>

                    <!-- RESULTS -->
                    <template v-if="filteredProperties.length > 0">
                      <SelectItem
                        v-for="p in filteredProperties"
                        :key="p.propertyId"
                        :value="p.propertyId"
                      >
                        {{ p.propertyName }}
                      </SelectItem>
                    </template>

                    <!-- EMPTY STATE -->
                    <div v-else class="p-3 text-sm text-muted-foreground text-center">
                      No properties found
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <!-- UNIT -->
              <div class="space-y-2">
                <Label>Unit</Label>
                <Select
                  v-model="assignStore.assignModel.unitId"
                  :disabled="dropdownStore.units.length === 0"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="u in dropdownStore.units" :key="u.unitId" :value="u.unitId">
                      {{ u.unitName }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- TENANT -->
              <div class="space-y-2">
                <Label>Tenant</Label>

                <Select v-model="assignStore.assignModel.tenantId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>

                  <SelectContent>
                    <!-- 🔍 SEARCH INPUT -->
                    <div class="p-2 border-b">
                      <Input v-model="tenantSearch" placeholder="Search tenant..." class="h-9" />
                    </div>

                    <!-- RESULTS -->
                    <template v-if="filteredTenants.length > 0">
                      <SelectItem
                        v-for="t in filteredTenants"
                        :key="t.tenantId"
                        :value="t.tenantId"
                      >
                        {{ t.fullName }} ({{ t.phoneNumber }})
                      </SelectItem>
                    </template>

                    <!-- EMPTY STATE -->
                    <div v-else class="p-3 text-sm text-muted-foreground text-center">
                      No tenants found
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <!-- PLAN -->
              <div class="space-y-2">
                <Label>Payment Plan</Label>
                <Select v-model="assignStore.assignModel.planId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="plan in dropdownStore.plans"
                      :key="plan.planId"
                      :value="plan.planId"
                    >
                      {{ plan.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <!-- SECTION: DURATION -->
          <section class="space-y-4">
            <h3 class="text-sm font-semibold uppercase text-muted-foreground">Duration</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>

              <div class="space-y-2">
                <Label>Duration</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 12"
                  v-model="assignStore.assignModel.durationValue"
                />
              </div>

              <div class="space-y-2">
                <Label>Unit</Label>
                <Select v-model="assignStore.assignModel.durationUnit">
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Days">Days</SelectItem>
                    <SelectItem value="Weeks">Weeks</SelectItem>
                    <SelectItem value="Months">Months</SelectItem>
                    <SelectItem value="Years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <!-- SECTION: PAYMENT -->
          <section class="space-y-4">
            <h3 class="text-sm font-semibold uppercase text-muted-foreground">Payment</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <Label>Initial Deposit</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  v-model="assignStore.assignModel.initialDeposit"
                />
              </div>
            </div>
          </section>

          <!-- SUBMIT -->
          <div class="pt-6">
            <Button
              class="w-full h-12 text-base rounded-xl"
              :disabled="assignStore.loading"
              @click="handleAssign"
            >
              <Loader2 v-if="assignStore.loading" class="h-5 w-5 mr-2 animate-spin" />
              Assign Property
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
