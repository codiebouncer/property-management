<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.store'
import router from '@/router'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const store = useDashboardStore()
const loading = ref(true)

onMounted(async () => {
  await store.fetchDashboardSummary()
  loading.value = false
})
</script>

<template>
  <div class="w-full h-full flex flex-col gap-6">
    <!-- Summary Cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Units -->
      <Card>
        <CardHeader><CardTitle>Total Properties</CardTitle></CardHeader>
        <CardContent>
          <Skeleton v-if="loading" class="h-10 w-20" />
          <p v-else class="text-3xl font-semibold">
            {{ store.dashSummary.totalProperties }}
          </p>
        </CardContent>
      </Card>

      <!-- Occupied Units -->
      <Card>
        <CardHeader><CardTitle>Occupied Units</CardTitle></CardHeader>
        <CardContent>
          <Skeleton v-if="loading" class="h-10 w-20" />
          <p v-else class="text-3xl font-semibold text-emerald-600">
            {{ store.dashSummary.occupiedUnits }}
          </p>
        </CardContent>
      </Card>

      <!-- Vacant Units -->
      <Card>
        <CardHeader><CardTitle>Vacant Units</CardTitle></CardHeader>
        <CardContent>
          <Skeleton v-if="loading" class="h-10 w-20" />
          <p v-else class="text-3xl font-semibold text-amber-500">
            {{ store.dashSummary.vacantUnits }}
          </p>
        </CardContent>
      </Card>

      <!-- Pending Repairs -->
      <Card>
        <CardHeader><CardTitle>Pending Repairs</CardTitle></CardHeader>
        <CardContent>
          <Skeleton v-if="loading" class="h-10 w-20" />
          <p v-else class="text-3xl font-semibold text-rose-600">
            {{ store.dashSummary.pendingRepairs }}
          </p>
        </CardContent>
      </Card>
    </section>

    <!-- Recent Properties & Tenants -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Properties -->
      <Card>
        <CardHeader><CardTitle>Recent Properties</CardTitle></CardHeader>
        <CardContent>
          <ul class="divide-y divide-slate-200">
            <template v-if="loading">
              <li class="py-2"><Skeleton class="h-4 w-full" /></li>
              <li class="py-2"><Skeleton class="h-4 w-full" /></li>
              <li class="py-2"><Skeleton class="h-4 w-full" /></li>
            </template>

            <template v-else>
              <li
                v-for="item in store.dashSummary.recentProperties"
                :key="item.propertyId"
                class="py-2 flex justify-between"
              >
                <span>{{ item.propertyName }}</span>
                <span>{{ item.unitCount }} units</span>
              </li>
            </template>
          </ul>
        </CardContent>
      </Card>

      <!-- Recent Tenants -->
      <Card>
        <CardHeader><CardTitle>Recent Tenants</CardTitle></CardHeader>
        <CardContent>
          <ul class="divide-y divide-slate-200">
            <template v-if="loading">
              <li class="py-2"><Skeleton class="h-4 w-full" /></li>
              <li class="py-2"><Skeleton class="h-4 w-full" /></li>
              <li class="py-2"><Skeleton class="h-4 w-full" /></li>
            </template>

            <template v-else>
              <li
                v-for="item in store.dashSummary.recentTenants"
                :key="item.tenantId"
                class="py-2 flex justify-between"
              >
                <span>{{ item.fullName }}</span>
                <span>{{ item.propertyName }}</span>
              </li>
            </template>
          </ul>
        </CardContent>
      </Card>
    </section>

    <!-- Action Buttons -->
    <section class="flex gap-4 mt-6">
      <Button @click="router.push('/assign')">Assign Property</Button>
      <RouterLink to="/alltenants" custom v-slot="{ navigate }">
        <Button variant="outline" @click="navigate" as-child>
          <span>View All Tenants</span>
        </Button>
      </RouterLink>

      <Button variant="secondary">Generate Report</Button>
    </section>
  </div>
</template>
