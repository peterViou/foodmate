import { Component, OnInit } from '@angular/core';
import { OpenAIService } from '../shared/services/openai.service';
import { ChatService } from '../shared/services/chat.service';
import { Message } from './message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextService } from '../shared/services/context.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  userInput: string = '';
  chatHistory: Message[] = [];
  isTyping: boolean = false;

  constructor(
    private openaiService: OpenAIService,
    private contextService: ContextService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.contextService.setContext('conversationState', 'greeting');

    this.chatService.getMessages().subscribe((messages) => {
      this.chatHistory = messages;
    });
  }

  sendMessage() {
    if (this.userInput.trim()) {
      const userMessage: Message = {
        type: 'user',
        content: this.userInput,
        timestamp: new Date(),
      };
      this.chatHistory.push(userMessage);
      this.chatService.saveMessage(userMessage);

      this.userInput = '';
      this.isTyping = true;

      this.handleState(
        this.contextService.getContext('conversationState'),
        userMessage.content
      );
    }
  }

  handleState(state: string, userInput: string) {
    switch (state) {
      case 'greeting':
        this.handleGreeting(userInput);
        break;
      // Add other states as needed
      default:
        this.handleDefault(userInput);
    }
  }

  handleGreeting(userInput: string) {
    this.openaiService.getChatResponse(userInput).then((response) => {
      const botMessage: Message = {
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };
      this.chatHistory.push(botMessage);
      this.chatService.saveMessage(botMessage);
      this.isTyping = false;
      this.contextService.setContext('conversationState', 'collectingInfo');
    });
  }

  handleDefault(userInput: string) {
    this.openaiService.getChatResponse(userInput).then((response) => {
      const botMessage: Message = {
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };
      this.chatHistory.push(botMessage);
      this.chatService.saveMessage(botMessage);
      this.isTyping = false;
    });
  }
}
