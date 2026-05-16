<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
import { Building, Users, CreditCard, Wrench, Home, LogOut } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'

const props = defineProps<SidebarProps>()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/')
}

// Sidebar data for Property Management
const data = [
  {
    title: 'Dashboard',
    url: '/home',
    icon: Home,
    items: [],
  },
  {
    title: 'Properties',
    url: '/allproperties',
    icon: Building,
    items: [
      { title: 'All Properties', url: '/allproperties' },
      { title: 'Assign Property', url: '/assign' },
    ],
  },
  {
    title: 'Tenants',
    icon: Users,
    items: [
      { title: 'All Tenants', url: '/alltenants' },
      { title: 'Add Tenant', url: '/addtenant' },
    ],
  },
  {
    title: 'Payments',
    url: '#',
    icon: CreditCard,
    items: [{ title: 'Payment History', url: '/payments' }],
  },
  {
    title: 'Repairs',
    url: '#',
    icon: Wrench,
    items: [{ title: 'All Repairs', url: '/allrepairs' }],
  },
]
</script>

<template>
  <Sidebar v-bind="props">
    <!-- Top Logo -->
    <SidebarHeader>
      <RouterLink to="/home" class="flex items-center gap-2 px-4 py-3">
        <div
          class="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white"
        >
          <Building class="size-4" />
        </div>
        <span class="font-semibold text-lg">KofiProps</span>
      </RouterLink>
    </SidebarHeader>

    <!-- Sidebar Main Content -->
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <Collapsible
            v-for="(item, index) in data"
            :key="item.title"
            :default-open="index === 0"
            class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger as-child v-if="item.items.length">
                <SidebarMenuButton>
                  <component :is="item.icon" class="mr-2 size-4" />
                  {{ item.title }}
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <SidebarMenuButton v-else as-child>
                <RouterLink v-if="item.url" :to="item.url" class="flex items-center">
                  <component :is="item.icon" class="mr-2 size-4" />
                  {{ item.title }}
                </RouterLink>
              </SidebarMenuButton>

              <CollapsibleContent v-if="item.items.length">
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="child in item.items" :key="child.title">
                    <SidebarMenuSubButton as-child>
                      <RouterLink :to="child.url">{{ child.title }}</RouterLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <!-- Bottom Logout -->
    <SidebarContent class="mt-auto border-t border-gray-200 pt-3">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            type="button"
            class="text-red-600 hover:bg-red-50 hover:text-red-700"
            @click="handleLogout"
          >
            <LogOut class="mr-2 size-4" />
            Logout
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>

    <SidebarRail />
  </Sidebar>
</template>
