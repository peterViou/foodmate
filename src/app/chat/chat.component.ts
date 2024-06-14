import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenAIService } from './openai.service';
import { FirestoreService } from './firestore.service';
import { Message } from './message.model'; // Ajustez le chemin si nécessaire

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
    private openAIService: OpenAIService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.firestoreService.getMessages().subscribe((messages: Message[]) => {
      this.chatHistory = messages;
    });
  }

  async sendMessage() {
    if (this.userInput.trim()) {
      const userMessage: Message = {
        type: 'user',
        content: this.userInput,
        timestamp: new Date(),
      };
      this.chatHistory.push(userMessage);
      this.firestoreService.saveMessage(userMessage);

      this.isTyping = true;

      try {
        const response = await this.openAIService.getChatResponse(
          this.userInput
        );
        const botMessage: Message = {
          type: 'bot',
          content: response,
          timestamp: new Date(),
        };
        this.chatHistory.push(botMessage);
        this.firestoreService.saveMessage(botMessage);
      } catch (error) {
        const errorMessage: Message = {
          type: 'bot',
          content: 'Error fetching data from OpenAI',
          timestamp: new Date(),
        };
        this.chatHistory.push(errorMessage);
        this.firestoreService.saveMessage(errorMessage);
      } finally {
        this.isTyping = false;
      }

      this.userInput = '';
    }
  }
}
