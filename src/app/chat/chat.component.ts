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

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Initialize the conversation state and subscribe to the message observable to fetch chat history.
   */
  ngOnInit(): void {
    console.log('ngOnInit called');
    this.contextService.setContext('conversationState', 'greeting');
    this.subscribeToMessages();
  }

  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Unsubscribe from the message observable to avoid memory leaks.
   */
  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.unsubscribeFromMessages();
  }

  /**
   * Subscribes to the message observable to fetch and update chat history.
   */
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

  /**
   * Unsubscribes from the message observable to avoid memory leaks.
   */
  private unsubscribeFromMessages(): void {
    console.log('unsubscribeFromMessages called');
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  /**
   * Sends a user message and handles the chat state.
   */
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
      });

      this.userInput = '';
      this.isTyping = true;

      this.handleState(
        this.contextService.getContext('conversationState'),
        userMessage.content
      );
    }
  }

  /**
   * Handles different states of the conversation.
   * @param state The current state of the conversation.
   * @param userInput The user's input.
   */
  private handleState(state: string, userInput: string): void {
    console.log(
      'handleState called with state:',
      state,
      'and userInput:',
      userInput
    );
    switch (state) {
      case 'greeting':
        this.handleGreeting(userInput);
        break;
      // Add other states as needed
      default:
        this.handleDefault(userInput);
    }
  }

  /**
   * Handles the greeting state.
   * @param userInput The user's input.
   */
  private handleGreeting(userInput: string): void {
    this.openaiService.getChatResponse(userInput).then((response) => {
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

  /**
   * Handles the default state.
   * @param userInput The user's input.
   */
  private handleDefault(userInput: string): void {
    this.openaiService.getChatResponse(userInput).then((response) => {
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
