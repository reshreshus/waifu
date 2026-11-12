<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { invoke } from '@tauri-apps/api/core'

const openRouterKey = ref('')
const showOpenRouterKey = ref(false)
const savingKey = ref(false)
const keyError = ref('')

const hasOpenRouterKey = ref(false)
onMounted(async () => {
  try {
    hasOpenRouterKey.value = await invoke<boolean>('has_api_key', {
      provider: 'openrouter'
    })
  } catch (error) {
    keyError.value = String(error)
  }
})

async function saveOpenRouterKey() {
  if (!openRouterKey.value.trim()) return

  savingKey.value = true
  keyError.value = ''

  try {
    await invoke('save_api_key', {
      provider: 'openrouter',
      key: openRouterKey.value.trim()
    })

    hasOpenRouterKey.value = true
    openRouterKey.value = ''
  } catch (error) {
    keyError.value = String(error)
  } finally {
    savingKey.value = false
  }
}

async function removeOpenRouterKey() {
  try {
    await invoke('delete_api_key', {
      provider: 'openrouter'
    })

    hasOpenRouterKey.value = false
    openRouterKey.value = ''
  } catch (error) {
    keyError.value = String(error)
  }
}
</script>

<template>
  <div>
    <RouterLink to="/">Chat</RouterLink>

    <section class="space-y-4">
      <div>
        <h3 class="text-sm font-semibold text-white">
          API Providers
        </h3>
        <p class="text-xs text-zinc-500 mt-1">
          Configure API keys for your AI providers.
        </p>
      </div>

      <div class="rounded-xl border border-white/10 bg-[#0e0e14] p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-white">
              OpenRouter
            </h4>
            <p class="text-xs text-zinc-500 mt-1">
              Access multiple AI models through one API.
            </p>
          </div>

          <span
            class="text-xs px-2 py-1 rounded-full"
            :class="hasOpenRouterKey
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-zinc-800 text-zinc-400'"
          >
            {{ hasOpenRouterKey ? 'Configured' : 'Not configured' }}
          </span>
        </div>

        <div class="space-y-2">
          <label class="text-xs text-zinc-400">
            OpenRouter API Key <span v-if="hasOpenRouterKey">(...{{  openRouterKey.substring(openRouterKey.length - 4) }})</span>
          </label>

          <div class="flex gap-2">
            <input
              v-model="openRouterKey"
              :type="showOpenRouterKey ? 'text' : 'password'"
              placeholder="sk-or-v1-..."
              autocomplete="off"
              class="flex-1 min-w-0 rounded-lg bg-black/30 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 placeholder:text-zinc-600"
            />

            <button
              @click="showOpenRouterKey = !showOpenRouterKey"
              class="px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-400"
            >
              {{ showOpenRouterKey ? 'Hide' : 'Show' }}
            </button>
          </div>

          <p class="text-xs text-zinc-500">
            {{ hasOpenRouterKey
              ? 'A key is saved. Enter a new one to replace it.'
              : 'Your key is stored in your system credential manager.' }}
          </p>
        </div>

        <p v-if="keyError" class="text-xs text-red-400">
          {{ keyError }}
        </p>

        <div class="flex items-center justify-end gap-2">
          <button
            v-if="hasOpenRouterKey"
            @click="removeOpenRouterKey"
            class="px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10"
          >
            Remove key
          </button>

          <button
            @click="saveOpenRouterKey"
            :disabled="!openRouterKey.trim() || savingKey"
            class="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-white"
          >
            {{ savingKey ? 'Saving...' : 'Save key' }}
          </button>
        </div>
      </div>
  </section>
  </div>
</template>
