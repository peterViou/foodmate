import { Component, OnInit, OnDestroy } from '@angular/core';
import { OpenAIService } from '../shared/services/openai.service';
import { ChatService } from '../shared/services/chat.service';
import { Message } from './message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextService } from '../shared/services/context.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  userInput: string = '';
  chatHistory: Message[] = [];
  isTyping: boolean = false;
  private messagesSubscription!: Subscription;

  constructor(
    private openaiService: OpenAIService,
    private contextService: ContextService,
    private chatService: ChatService
  ) {
    console.log('ChatComponent initialized');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.contextService.setContext('conversationState', 'greeting');
    this.subscribeToMessages();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.unsubscribeFromMessages();
  }

  private subscribeToMessages(): void {
    console.log('subscribeToMessages called');
    this.messagesSubscription = this.chatService.getMessages().subscribe(
      (messages: Message[]) => {
        console.log('Messages received:', messages);
        this.chatHistory = messages; // Ensure messages is an array of Message
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  private unsubscribeFromMessages(): void {
    console.log('unsubscribeFromMessages called');
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  sendMessage(): void {
    console.log('sendMessage called');
    if (this.userInput.trim()) {
      const userMessage: Message = {
        type: 'user',
        content: this.userInput,
        timestamp: new Date(),
      };
      console.log('User message created:', userMessage);

      this.chatService.saveMessage(userMessage).then(() => {
        console.log('User message saved');
        this.chatHistory.push(userMessage);

        // Collect the conversation history
        const conversationHistory = this.chatHistory.map((message) => ({
          role: message.type === 'user' ? 'user' : 'assistant',
          content: message.content,
        }));

        this.isTyping = true;

        this.handleState(
          this.contextService.getContext('conversationState'),
          conversationHistory
        );
      });

      this.userInput = '';
    }
  }

  private handleState(
    state: string,
    conversationHistory: { role: string; content: string }[]
  ): void {
    console.log(
      'handleState called with state:',
      state,
      'and conversationHistory:',
      conversationHistory
    );
    switch (state) {
      case 'greeting':
        this.handleGreeting(conversationHistory);
        break;
      default:
        this.handleDefault(conversationHistory);
    }
  }

  private handleGreeting(
    conversationHistory: { role: string; content: string }[]
  ): void {
    this.openaiService.getChatResponse(conversationHistory).then((response) => {
      const botMessage: Message = {
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      this.chatService.saveMessage(botMessage).then(() => {
        this.chatHistory.push(botMessage);
        this.isTyping = false;
        this.contextService.setContext('conversationState', 'collectingInfo');
      });
    });
  }

  private handleDefault(
    conversationHistory: { role: string; content: string }[]
  ): void {
    this.openaiService.getChatResponse(conversationHistory).then((response) => {
      const botMessage: Message = {
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      this.chatService.saveMessage(botMessage).then(() => {
        this.chatHistory.push(botMessage);
        this.isTyping = false;
      });
    });
  }
}
