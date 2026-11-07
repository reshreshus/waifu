<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import {
  Send,
  Sparkles,
  ChevronDown,
  Paperclip,
  Mic,
} from "@lucide/vue";

import { useChatStore } from "../stores/chat";
import ChatMessage from "./ChatMessage.vue";
import { invoke } from "@tauri-apps/api/core"

const chat = useChatStore();

const input = ref("");
const messagesContainer = ref<HTMLElement | null>(null);

const suggestions = [
  {
    title: "Explore an idea",
    description: "Help me think through something",
    prompt: "Help me explore an idea: ",
  },
  {
    title: "Write some code",
    description: "Build something with me",
    prompt: "Help me build: ",
  },
  {
    title: "Learn something",
    description: "Explain a topic step by step",
    prompt: "Teach me about: ",
  },
  {
    title: "Analyze a problem",
    description: "Break down a complex issue",
    prompt: "Help me analyze: ",
  },
];

const apiKey = ref("");

// function sendMessage() {
//   const content = input.value.trim();
//   if (!content) return;
//   if (!chat.activeConversation) {
//     chat.createConversation();
//   }
//   chat.addMessage("user", content);
//   input.value = "";
//   // Temporary placeholder until OpenRouter integration.
//   setTimeout(() => {
//     chat.addMessage(
//       "assistant",
//       "Сообщение сохранено. Ждём пока ты уже интегрируешь OpenRouter апишку",
//     );
//   }, 300);
// }

async function sendMessage() {
  const content = input.value.trim();
  if (!content) return;
  if (!chat.activeConversation) {
    chat.createConversation();
  }
  chat.addMessage("user", content);
  input.value = "";
  try {
    // Temporary API key input for the first prototype.
    if (!apiKey.value) {
      apiKey.value = prompt("Enter your OpenRouter API key") ?? "";
      if (!apiKey.value) {
        throw new Error("API key is required");
      }
    }
    const conversation = chat.activeConversation;
    if (!conversation) return;
    const messages = conversation.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
    const response = await invoke<string>("openrouter_chat", {
      apiKey: apiKey.value,
      model: chat.selectedModel,
      messages,
    });
    chat.addMessage("assistant", response);
  } catch (error) {
    chat.addMessage(
      "assistant",
      `Error: ${String(error)}`,
    );
  }
}

function useSuggestion(prompt: string) {
  input.value = prompt;

  nextTick(() => {
    document.querySelector<HTMLTextAreaElement>(
      ".chat-input",
    )?.focus();
  });
}

watch(
  () => chat.activeConversation?.messages.length,
  async () => {
    await nextTick();

    if (messagesContainer.value) {
      messagesContainer.value.scrollTop =
        messagesContainer.value.scrollHeight;
    }
  },
);
</script>

<template>
  <main class="relative flex min-w-0 flex-1 flex-col bg-[#09090d]">
    <!-- Header -->
    <header class="flex h-[60px] shrink-0 items-center justify-between border-b border-white/[0.06] px-6">
      <div class="flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400">
          <Sparkles :size="15" />
        </div>

        <div class="relative flex items-center">
          <select
            v-model="chat.selectedModel"
            class="cursor-pointer appearance-none bg-transparent py-1 pl-1 pr-6 text-sm font-medium text-zinc-200 outline-none transition hover:text-white"
          >
            <option
              v-for="model in chat.models"
              :key="model.id"
              :value="model.id"
              class="bg-[#15151c]"
            >
              {{ model.name }}
            </option>
          </select>

          <ChevronDown
            :size="14"
            class="pointer-events-none absolute right-1 text-zinc-500"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.05] px-3 py-1.5">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"></span>
        <span class="text-[11px] font-medium text-emerald-400/80">
          Local workspace
        </span>
      </div>
    </header>

    <!-- Messages -->
    <div
      ref="messagesContainer"
      class="flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      <template v-if="chat.activeConversation">
        <!-- Welcome -->
        <div
          v-if="chat.activeConversation.messages.length === 0"
          class="flex flex-1 flex-col items-center justify-center px-6 py-12"
        >
          <div class="relative mb-7">
            <div class="absolute inset-0 rounded-3xl bg-violet-600/20 blur-2xl"></div>
            <div class="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-indigo-500/10 text-violet-300 shadow-2xl shadow-violet-950/30">
              <Sparkles :size="28" />
            </div>
          </div>

          <h1 class="text-center text-3xl font-semibold tracking-tight text-white max-sm:text-2xl">
            What are we thinking about?
          </h1>

          <p class="mt-3 max-w-md text-center text-sm leading-6 text-zinc-500">
            Your personal AI workspace. Ask anything, explore ideas,
            and keep everything organized.
          </p>

          <div class="mt-10 grid w-full max-w-[580px] grid-cols-2 gap-3 max-sm:grid-cols-1">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion.title"
              class="group flex flex-col items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-violet-500/30 hover:bg-violet-500/[0.05]"
              @click="useSuggestion(suggestion.prompt)"
            >
              <strong class="text-sm font-medium text-zinc-200 transition group-hover:text-violet-200">
                {{ suggestion.title }}
              </strong>

              <span class="text-xs text-zinc-600 transition group-hover:text-zinc-400">
                {{ suggestion.description }}
              </span>
            </button>
          </div>
        </div>

        <!-- Conversation -->
        <div
          v-else
          class="mx-auto flex w-full max-w-3xl flex-col px-6 py-8"
        >
          <ChatMessage
            v-for="message in chat.activeConversation.messages"
            :key="message.id"
            :message="message"
          />
        </div>
      </template>

      <!-- Empty state -->
      <div
        v-else
        class="flex flex-1 flex-col items-center justify-center px-6"
      >
        <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
          <Sparkles :size="28" />
        </div>

        <h1 class="text-2xl font-semibold tracking-tight text-white">
          Your ideas, your workspace.
        </h1>

        <p class="mt-3 text-sm text-zinc-500">
          Start a conversation to begin.
        </p>

        <button
          class="mt-7 flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
          @click="chat.createConversation()"
        >
          <Sparkles :size="16" />
          Start a conversation
        </button>
      </div>
    </div>

    <!-- Composer -->
    <div class="shrink-0 px-6 pb-5 pt-3">
      <div class="mx-auto max-w-3xl">
        <div class="rounded-2xl border border-white/[0.09] bg-[#111118] shadow-xl shadow-black/20 transition focus-within:border-violet-500/30">
          <textarea
            v-model="input"
            class="chat-input block max-h-48 min-h-[65px] w-full resize-none bg-transparent px-5 pb-3 pt-4 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-600"
            placeholder="Message Waifu..."
            rows="1"
            @keydown.enter.exact.prevent="sendMessage"
          />

          <div class="flex items-center justify-between px-3 pb-3">
            <div class="flex items-center gap-1">
              <button
                class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
                title="Attach file"
              >
                <Paperclip :size="17" />
              </button>

              <button
                class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
                title="Voice input"
              >
                <Mic :size="17" />
              </button>

              <span class="ml-2 text-[10px] text-zinc-600 max-sm:hidden">
                Enter to send · Shift+Enter for newline
              </span>
            </div>

            <button
              class="flex h-9 w-9 items-center justify-center rounded-xl transition"
              :class="
                input.trim()
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500'
                  : 'cursor-not-allowed bg-white/[0.05] text-zinc-600'
              "
              :disabled="!input.trim()"
              @click="sendMessage"
            >
              <Send :size="16" />
            </button>
          </div>
        </div>

        <p class="mt-3 text-center text-[10px] text-zinc-600">
          AI responses may contain mistakes. Your conversations stay local for now.
        </p>
      </div>
    </div>
  </main>
</template>
