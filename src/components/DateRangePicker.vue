<script setup lang="ts">
import { ref, watch } from 'vue'
import { CalendarDate, parseDate } from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: { start: string | null; end: string | null }
}>()

const emit = defineEmits(['update:modelValue', 'apply'])

const fromDate = ref<CalendarDate | undefined>()
const toDate = ref<CalendarDate | undefined>()

// Sync props → internal UI
watch(
  () => props.modelValue,
  (val) => {
    fromDate.value = val.start ? parseDate(val.start) : undefined
    toDate.value = val.end ? parseDate(val.end) : undefined
  },
  { immediate: true },
)

function apply() {
  const startISO = fromDate.value ? new Date(fromDate.value.toString()).toISOString() : null

  const endISO = toDate.value ? new Date(toDate.value.toString()).toISOString() : null

  emit('update:modelValue', { start: startISO, end: endISO })
  emit('apply')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- FROM -->
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline" class="w-[170px] justify-start">
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ fromDate ? fromDate.toString() : 'From date' }}
        </Button>
      </PopoverTrigger>

      <PopoverContent class="w-auto p-0">
        <Calendar v-model="fromDate" />
      </PopoverContent>
    </Popover>

    <!-- TO -->
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline" class="w-[170px] justify-start">
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ toDate ? toDate.toString() : 'To date' }}
        </Button>
      </PopoverTrigger>

      <PopoverContent class="w-auto p-0">
        <Calendar v-model="toDate" />
      </PopoverContent>
    </Popover>

    <Button @click="apply">Apply</Button>
  </div>
</template>
