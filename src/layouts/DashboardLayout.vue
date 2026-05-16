<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <SidebarProvider>
    <div class="flex min-h-screen w-full">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <header
          class="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-slate-900"
        >
          <div class="flex items-center gap-3">
            <SidebarTrigger />

            <!-- BACK BUTTON -->
            <Button
              variant="ghost"
              size="sm"
              class="flex items-center gap-2"
              @click="router.back()"
            >
              <ArrowLeft class="h-4 w-4" />
              Back
            </Button>
          </div>

          <div>
            <h1 class="text-2xl font-bold">Property Dashboard</h1>
            <p class="text-sm text-slate-500">Overview of properties and tenants</p>
          </div>
        </header>

        <main class="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-950">
          <router-view />
        </main>
      </div>
    </div>
  </SidebarProvider>
</template>
