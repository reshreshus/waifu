<script setup lang="ts">
import { ref } from "vue";
import { Bot, User, Copy, Check } from "@lucide/vue";
import type { Message } from "../types/chat";

defineProps<{
  message: Message;
}>();

const copied = ref(false);

async function copyMessage(content: string) {
  await navigator.clipboard.writeText(content);
  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 1500);
}
</script>

<template>
  <article class="group flex gap-4 py-6">
    <!-- Avatar -->
    <div
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
      :class="
        message.role === 'assistant'
          ? 'border-violet-500/20 bg-violet-500/10 text-violet-300'
          : 'border-white/10 bg-white/[0.05] text-zinc-400'
      "
    >
      <!-- <Bot
        v-if="message.role === 'assistant'"
        :size="17"
      /> -->
      <img 
        v-if="message.role === 'assistant'"
        src="@/assets/images/waifu-1.jpg" 
        class="rounded-[4px] overflow-hidden"
      />

      <User
        v-else
        :size="17"
      />
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <div class="mb-2 flex min-h-8 items-center gap-2">
        <span class="text-sm font-semibold text-zinc-200">
          {{ message.role === "assistant" ? "WAIfu" : "You" }}
        </span>

        <span
          v-if="message.model"
          class="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-zinc-500"
        >
          {{ message.model }}
        </span>

        <button
          class="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 opacity-0 transition hover:bg-white/[0.06] hover:text-zinc-200 group-hover:opacity-100"
          title="Copy message"
          @click="copyMessage(message.content)"
        >
          <Check
            v-if="copied"
            :size="14"
            class="text-emerald-400"
          />

          <Copy
            v-else
            :size="14"
          />
        </button>
      </div>

      <div class="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-400">
        {{ message.content }}
      </div>
    </div>
  </article>
</template>
