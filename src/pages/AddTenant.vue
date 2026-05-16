<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { useTenantStore } from '@/stores/tenant.store'

import AddTenantRequest from '@/models/Tenant/AddTenant.model'
import StatusConstants from '@/constants/status.constants'

// UI Components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'

const store = useTenantStore()

const form = ref<AddTenantRequest>({
  fullName: '',
  email: '',
  phoneNumber: '',
  nationalId: '',
})

async function submitForm() {
  if (!form.value.fullName || !form.value.email) {
    alert('Please fill all required fields')
    return
  }

  const response = await store.addTenant(form.value)
  if (response.status == StatusConstants.SUCCESS) {
    await router.push('/alltenants')
  }
}
</script>
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Add New Tenant</h1>

    <Card class="max-w-3xl mx-auto shadow-md border rounded-2xl">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-slate-700 dark:text-slate-200">
          Tenant Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Full Name -->
          <div>
            <Label class="mb-1 block">Full Name</Label>
            <Input v-model="form.fullName" placeholder="Enter full name" />
          </div>

          <!-- Email -->
          <div>
            <Label class="mb-1 block">Email</Label>
            <Input type="email" v-model="form.email" placeholder="Enter email" />
          </div>

          <!-- Phone Number -->
          <div>
            <Label class="mb-1 block">Phone Number</Label>
            <Input v-model="form.phoneNumber" placeholder="Enter phone number" />
          </div>

          <!-- National ID -->
          <div>
            <Label class="mb-1 block">National ID</Label>
            <Input v-model="form.nationalId" placeholder="Ghana Card / National ID" />
          </div>
        </form>

        <!-- Submit -->
        <div class="mt-6 flex justify-end">
          <Button
            class="px-6 py-2 font-medium flex items-center gap-2"
            :disabled="store.loading"
            @click="submitForm"
          >
            <Loader2 v-if="store.loading" class="h-4 w-4 animate-spin" />
            <span>{{ store.loading ? 'Adding...' : 'Add Tenant' }}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
