export interface Message {
  userId?: string;
  type: 'user' | 'bot';
  context: 'default' | 'meal'; // Ajoutez cette ligne pour inclure la propriété context
  content: string;
  timestamp: any;
}
