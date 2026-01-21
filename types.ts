
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  content?: string; 
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachments?: FileInfo[];
  processingSteps?: string[];
}

export interface DocumentSource {
  id: string;
  name: string;
  type: 'law' | 'circular' | 'decree' | 'template';
  content: string;
  fileName: string;
}

export interface GeneratedDoc {
  id: string;
  title: string;
  content: string;
  type: string;
  status: 'draft' | 'complete';
}
