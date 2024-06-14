import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiUrl: string = 'https://api.openai.com/v1/chat/completions';
  private apiKey: string = environment.openaiApiKey; // Remplace par ta clé API

  async getChatResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching data from OpenAI:', error);
      return 'Error fetching data from OpenAI';
    }
  }
}
