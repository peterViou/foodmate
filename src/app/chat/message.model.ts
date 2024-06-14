export interface Message {
  userId?: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: any;
}
