<template>
  <router-view />
  <Toaster position="top-right" />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>
