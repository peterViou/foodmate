import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenAIService } from './openai.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  userInput: string = '';
  chatResponse: string = '';

  constructor(private openAIService: OpenAIService) {}

  async sendMessage() {
    this.chatResponse = await this.openAIService.getChatResponse(
      this.userInput
    );
    this.userInput = '';
  }
}
