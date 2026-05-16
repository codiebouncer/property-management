<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import LoginRequest from '../models/Auth/LoginRequest.model'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import StatusConstants from '../constants/status.constants'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { watch } from 'vue'
import type RegisterUser from '@/models/Auth/RegisterUser.model'
import type CreateCompany from '@/models/Auth/CreateCompany.model'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from '@/components/ui/select'

// Pinia store + router
const authStore = useAuthStore()
const router = useRouter()

const alert = ref({
  show: false,
  type: '',
  title: '',
  message: '',
})

// Form data
const form = ref<LoginRequest>({
  username: '',
  password: '',
})
const showRegisterModal = ref(false)
const showCompanyModal = ref(false)

watch(showRegisterModal, async (open) => {
  if (open) {
    await authStore.loadCompanies() // call your API here
  }
})

const registerForm = ref<RegisterUser>({
  name: '',
  email: '',
  password: '',
  phoneNumber: '',
  role: '',
  companyId: '',
})

const companyForm = ref<CreateCompany>({
  name: '',
  email: '',
})

const loading = ref(false)

const login = async () => {
  alert.value = { show: false, type: '', title: '', message: '' }

  if (!form.value.username || !form.value.password) {
    alert.value = {
      show: true,
      type: 'error',
      title: 'Missing Fields',
      message: 'Please enter both username and password.',
    }
    return
  }
  watch(alert, (val) => {
    if (val.type === 'error') {
      setTimeout(() => {
        alert.value = { show: false, type: '', title: '', message: '' }
      }, 3000)
    }
  })

  loading.value = true
  try {
    const response = await authStore.login(form.value)
    if (response.status === StatusConstants.SUCCESS) {
      await router.push('/home')
    }
  } finally {
    loading.value = false
  }
}
const registerUser = async () => {
  const response = await authStore.register(registerForm.value)
  if (response.status === StatusConstants.SUCCESS) {
    showRegisterModal.value = false
  }
}

const createCompany = async () => {
  const response = await authStore.createCompany(companyForm.value)
  if (response.status === StatusConstants.SUCCESS) {
    showCompanyModal.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 space-y-4"
  >
    <!-- Show Alert only when inputs are missing -->

    <Card
      class="w-full max-w-md p-6 shadow-lg border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900"
    >
      <CardHeader class="text-center space-y-1">
        <CardTitle class="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Property Management
        </CardTitle>
        <CardDescription class="text-slate-500 dark:text-slate-400">
          Sign in to manage your properties
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-5 mt-2">
        <Transition name="fade-slide">
          <Alert
            v-if="alert.show"
            class="rounded-xl text-red-600 font-semibold bg-red-50 border-red-200"
          >
            <AlertTitle>{{ alert.title }}</AlertTitle>
            <AlertDescription>{{ alert.message }}</AlertDescription>
          </Alert>
        </Transition>
        <!-- Username -->
        <div class="grid gap-2">
          <Label for="username">Username</Label>
          <Input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Enter your username"
            class="h-11 text-base"
            required
          />
        </div>

        <!-- Password -->
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="h-11 text-base"
            required
          />
        </div>

        <!-- Login Button -->
        <Button
          type="button"
          class="w-full h-11 text-base font-medium mt-4"
          :disabled="loading"
          @click="login"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </Button>
        <div class="flex justify-between text-sm mt-2">
          <button class="text-blue-600 hover:underline" @click="showRegisterModal = true">
            Register User
          </button>

          <button class="text-green-600 hover:underline" @click="showCompanyModal = true">
            Create Company
          </button>
        </div>
      </CardContent>
    </Card>
    <Dialog v-model:open="showRegisterModal">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register User</DialogTitle>
        </DialogHeader>

        <div class="space-y-3">
          <Input v-model="registerForm.name" placeholder="Full Name" />
          <Input v-model="registerForm.email" placeholder="Email" />
          <Input v-model="registerForm.phoneNumber" placeholder="Phone Number" />
          <Input v-model="registerForm.password" type="password" placeholder="Password" />
        </div>
        <div class="space-y-2">
          <Label>Company</Label>
          <Select v-model="registerForm.companyId" :disabled="authStore.companies.length === 0">
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="u in authStore.companies" :key="u.companyId" :value="u.companyId">
                {{ u.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter class="mt-4">
          <Button variant="secondary" @click="showRegisterModal = false">Cancel</Button>
          <Button @click="registerUser">Register</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Dialog v-model:open="showCompanyModal">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Company</DialogTitle>
        </DialogHeader>

        <div class="space-y-3">
          <Input v-model="companyForm.name" placeholder="Company Name" />
          <Input v-model="companyForm.email" placeholder="Company Email" />
        </div>

        <DialogFooter class="mt-4">
          <Button variant="secondary" @click="showCompanyModal = false">Cancel</Button>
          <Button @click="createCompany">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
/* Smooth slide-down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.45s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
