<script setup lang="ts">
import { ref } from "vue";
import { PanelLeftOpen } from "@lucide/vue";

import AppSidebar from "./components/AppSidebar.vue";
import ChatView from "./components/ChatView.vue";

const sidebarVisible = ref(true);
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-red text-white gap-[12px] space-x-[12px]">
    <AppSidebar
      v-if="sidebarVisible"
      @toggle="sidebarVisible = false"
    />

    <button
      v-else
      class="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#15151c] text-zinc-400 transition hover:border-violet-500/40 hover:text-white"
      @click="sidebarVisible = true"
    >
      <PanelLeftOpen :size="18" />
    </button>

    <!-- <ChatView /> -->
    <RouterView />
  </div>
</template>
