import { Component } from '@angular/core';
import { OpenAIService } from './openai.service';
import { FirestoreService } from './firestore.service';
import { Message } from './message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  userInput: string = '';
  chatHistory: Message[] = [];
  isTyping: boolean = false;

  constructor(
    private openaiService: OpenAIService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.firestoreService.getMessages().subscribe((messages) => {
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
      this.firestoreService.saveMessage(userMessage);

      this.userInput = '';
      this.isTyping = true;

      this.openaiService
        .getChatResponse(userMessage.content)
        .then((response) => {
          const botMessage: Message = {
            type: 'bot',
            content: response,
            timestamp: new Date(),
          };
          this.chatHistory.push(botMessage);
          this.firestoreService.saveMessage(botMessage);
          this.isTyping = false;
        });
    }
  }
}
