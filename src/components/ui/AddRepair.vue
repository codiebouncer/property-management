<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { usePropertyStore } from '@/stores/property.store'
import RepairRequest from '@/models/Property/repairrequest.model'

const emit = defineEmits(['close'])

const store = usePropertyStore()

const props = defineProps<{
  propertyId: string
}>()

const form = ref<RepairRequest>({
  propertyId: props.propertyId,
  description: '',
  status: '',
  cost: '',
})

async function submit() {
  await store.createRepair(form.value)
  emit('close')

  // Reset
  form.value.description = ''
  form.value.status = ''
  form.value.cost = ''
}
</script>
<template>
  <div class="space-y-4">
    <div>
      <Label>Description</Label>
      <Textarea v-model="form.description" />
    </div>

    <div>
      <Label>Status</Label>
      <Input v-model="form.status" placeholder="Pending / Completed" />
    </div>

    <div>
      <Label>Cost (GHS)</Label>
      <Input v-model="form.cost" />
    </div>

    <Button class="w-full" @click="submit">Submit Repair Request</Button>
  </div>
</template>
