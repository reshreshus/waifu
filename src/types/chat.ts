export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  folderId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
}
