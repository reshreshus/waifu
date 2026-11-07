
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type {
  Conversation,
  Folder,
  Message,
  AIModel,
} from "../types/chat";

const now = () => new Date().toISOString();

const createId = () => crypto.randomUUID();

export const useChatStore = defineStore("chat", () => {
  const folders = ref<Folder[]>([
    { id: "inbox", name: "Inbox", color: "#8b5cf6" },
    { id: "development", name: "Development", color: "#38bdf8" },
    { id: "learning", name: "Learning", color: "#f59e0b" },
  ]);

  const conversations = ref<Conversation[]>([]);
  const activeConversationId = ref<string | null>(null);

  const models = ref<AIModel[]>([
    {
      id: "openai/gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
    },
    {
      id: "anthropic/claude-sonnet-4",
      name: "Claude Sonnet",
      provider: "Anthropic",
    },
    {
      id: "google/gemini-2.5-pro",
      name: "Gemini Pro",
      provider: "Google",
    },
  ]);

  const selectedModel = ref(models.value[0].id);

  const activeConversation = computed(() =>
    conversations.value.find(
      (conversation) =>
        conversation.id === activeConversationId.value,
    ) ?? null,
  );

  const createConversation = (folderId = "inbox") => {
    const timestamp = now();

    const conversation: Conversation = {
      id: createId(),
      title: "New conversation",
      folderId,
      messages: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    conversations.value.unshift(conversation);
    activeConversationId.value = conversation.id;

    return conversation;
  };

  const selectConversation = (id: string) => {
    activeConversationId.value = id;
  };

  const addMessage = (
    role: Message["role"],
    content: string,
  ) => {
    const conversation = activeConversation.value;

    if (!conversation) return;

    const message: Message = {
      id: createId(),
      role,
      content,
      model: role === "assistant" ? selectedModel.value : undefined,
      createdAt: now(),
    };

    conversation.messages.push(message);
    conversation.updatedAt = now();

    if (
      conversation.messages.length === 1 &&
      role === "user"
    ) {
      conversation.title =
        content.slice(0, 48) +
        (content.length > 48 ? "…" : "");
    }
  };

  const deleteConversation = (id: string) => {
    conversations.value = conversations.value.filter(
      (conversation) => conversation.id !== id,
    );

    if (activeConversationId.value === id) {
      activeConversationId.value =
        conversations.value[0]?.id ?? null;
    }
  };

  const createFolder = (name: string) => {
    const folder: Folder = {
      id: createId(),
      name,
      color: "#8b5cf6",
    };

    folders.value.push(folder);

    return folder;
  };

  const moveConversation = (
    conversationId: string,
    folderId: string,
  ) => {
    const conversation = conversations.value.find(
      (item) => item.id === conversationId,
    );

    if (conversation) {
      conversation.folderId = folderId;
    }
  };

  return {
    folders,
    conversations,
    activeConversationId,
    activeConversation,
    models,
    selectedModel,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation,
    createFolder,
    moveConversation,
  };
});

