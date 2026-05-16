import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import HomePage from '@/pages/HomePage.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AllProperties from '@/pages/AllProperties.vue'
import NewProperty from '@/pages/NewProperty.vue'
import AllTenantsPage from '@/pages/AllTenantsPage.vue'
import AddTenant from '@/pages/AddTenant.vue'
import TenantDetailPage from '@/pages/TenantDetailPage.vue'
import AddPropertyPage from '@/pages/AddPropertyPage.vue'
import PropertyDetailPage from '@/pages/PropertyDetailPage.vue'
import CreateUnitPage from '@/pages/CreateUnitPage.vue'
import PropertyUnitsPage from '@/pages/PropertyUnitsPage.vue'
import AllPayments from '@/pages/AllPayments.vue'
import AssignPropertyPage from '@/pages/AssignPropertyPage.vue'
import UserRepairs from '@/pages/UserRepairs.vue'
import AllRepairsPage from '@/pages/AllRepairsPage.vue'
import UserTenantsPage from '@/pages/UnitsWithTenantPage.vue'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },

    {
      path: '/home',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Home',
          component: HomePage,
        },
        {
          path: '/allproperties',
          name: 'AllProperties',
          component: AllProperties,
        },
        {
          path: 'assignproperty',
          name: 'NewProperty',
          component: NewProperty,
        },
        {
          path: '/alltenants',
          name: 'AllTenants',
          component: AllTenantsPage,
        },
        {
          path: '/addtenant',
          name: 'AddTenant',
          component: AddTenant,
        },
        {
          path: 'tenantdetail/:id',
          name: 'TenantDetail',
          component: TenantDetailPage,
          props: true,
        },
        {
          path: '/addproperty',
          name: 'AddProperty',
          component: AddPropertyPage,
        },
        {
          path: 'propertydetail/:id',
          name: 'PropertyDetail',
          component: PropertyDetailPage,
          props: true,
        },
        {
          path: '/addunit',
          name: 'AddUnit',
          component: CreateUnitPage,
        },
        {
          path: '/allunits/:id',
          name: 'AllUnits',
          component: PropertyUnitsPage,
        },
        {
          path: '/payments',
          name: 'AllPayments',
          component: AllPayments,
        },
        {
          path: '/assign',
          name: 'AssignProperty',
          component: AssignPropertyPage,
        },
        {
          path: '/userrepairs/:id',
          name: 'UserRepairs',
          component: UserRepairs,
          props: true,
        },
        {
          path: '/allrepairs',
          name: 'AllRepairs',
          component: AllRepairsPage,
        },
        {
          path: '/userTenants/:id',
          name: 'UserTenants',
          component: UserTenantsPage,
          props: true,
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
