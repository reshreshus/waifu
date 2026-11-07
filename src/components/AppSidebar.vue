<script setup lang="ts">
import { computed } from "vue";
import {
  Plus,
  Search,
  Folder,
  MessageSquare,
  Settings,
  PanelLeftClose,
  Sparkles,
} from "@lucide/vue";

import { useChatStore } from "../stores/chat";

const chat = useChatStore();

const emit = defineEmits<{
  toggle: [];
}>();

const groupedConversations = computed(() =>
  chat.folders.map((folder) => ({
    ...folder,
    conversations: chat.conversations.filter(
      (conversation) => conversation.folderId === folder.id,
    ),
  })),
);
</script>

<template>
  <aside class="flex h-full w-[270px] shrink-0 flex-col border-r border-white/[0.07] bg-white px-3 py-4 max-sm:w-[220px]">
    <!-- Brand -->
    <div class="mb-8 flex items-center justify-between px-2">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/30">
          <Sparkles :size="18" class="text-white" />
        </div>

        <span class="text-lg font-semibold tracking-tight text-white">
          WAIfu
        </span>
      </div>

      <button
        class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
        @click="emit('toggle')"
      >
        <PanelLeftClose :size="17" />
      </button>
    </div>

    <!-- New conversation -->
    <button
      class="mb-3 flex h-10 items-center gap-2.5 rounded-xl bg-violet-600 px-3 text-sm font-medium text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 active:scale-[0.98]"
      @click="chat.createConversation()"
    >
      <Plus :size="17" />
      <span>New conversation</span>
      <kbd class="ml-auto rounded border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px] text-violet-100">
        Ctrl + K
      </kbd>
    </button>

    <button
      class="mb-7 flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-100"
    >
      <Search :size="16" />
      Search conversations
    </button>

    <!-- Workspace -->
    <div class="min-h-0 flex-1 overflow-y-auto">
      <div class="mb-3 flex items-center justify-between px-2">
        <span class="text-[10px] font-semibold tracking-[0.15em] text-zinc-600">
          WORKSPACE
        </span>

        <button
          class="flex h-6 w-6 items-center justify-center rounded-md text-zinc-600 transition hover:bg-white/[0.06] hover:text-white"
          title="Create folder"
          @click="
            (() => {
              const name = prompt('Folder name');
              if (name?.trim()) chat.createFolder(name.trim());
            })()
          "
        >
          <Plus :size="15" />
        </button>
      </div>

      <div
        v-for="folder in groupedConversations"
        :key="folder.id"
        class="mb-5"
      >
        <div class="mb-1 flex h-8 items-center gap-2 rounded-lg px-2 text-sm text-zinc-400">
          <Folder
            :size="15"
            :style="{ color: folder.color }"
          />

          <span class="truncate">{{ folder.name }}</span>

          <span class="ml-auto text-xs tabular-nums text-zinc-600">
            {{ folder.conversations.length }}
          </span>
        </div>

        <button
          v-for="conversation in folder.conversations"
          :key="conversation.id"
          class="group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition cursor-pointer"
          :class="
            conversation.id === chat.activeConversationId
              ? 'bg-violet-500/10 text-black'
              : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-900'
          "
          @click="chat.selectConversation(conversation.id)"
        >
          <MessageSquare
            :size="14"
            class="shrink-0 opacity-70"
          />

          <span class="truncate">{{ conversation.title }}</span>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-4 border-t border-white/[0.07] pt-3">
      <button
        class="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
      >
        <Settings :size="16" />
        Settings
      </button>

      <div class="mt-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 text-sm font-semibold text-violet-200 ring-1 ring-violet-400/20">
          R
        </div>

        <div class="min-w-0">
          <div class="truncate text-xs font-medium text-zinc-200">
            Local workspace
          </div>
          <div class="mt-0.5 text-[11px] text-zinc-600">
            Personal AI
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
