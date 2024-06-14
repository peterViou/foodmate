export interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: any;
}
