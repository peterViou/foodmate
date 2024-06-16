import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiUrl: string = 'https://api.openai.com/v1';
  private apiKey: string = environment.openaiApiKey; // Remplace par ta clé API

  constructor(private errorHandler: ErrorHandlerService) {}

  /**
   * Analyzes the text to determine if it is related to a meal.
   *
   * @param {string} message - The message to be analyzed.
   * @returns {Promise<any>}
   */

  async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/embeddings`,
        {
          model: 'text-embedding-ada-002',
          input: text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Error getting embedding:', error);
      throw error;
    }
  }

  async analyzeText(message: string): Promise<boolean> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          prompt: `Is the following message related to a meal? Respond with 'yes' or 'no'.\nMessage: "${message}"`,
          max_tokens: 10,
          model: 'text-davinci-003',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
      const result = response.data.choices[0].text.trim().toLowerCase();
      return result === 'yes';
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    }
  }

  async analyzeText_old(message: string): Promise<any> {
    try {
      const data = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a text analysis assistant. Determine if the following message is related to a meal.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
      };
      console.log('Sending request to OpenAI:', data);
      const response = await axios.post(this.apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      console.log('Analyse Message : ', message);
      console.log('Analyse Reponse : ', response.data);
      return response.data;
    } catch (error) {
      console.error('Error analyzing text:', error);
      this.errorHandler.handleError(error);
      throw error; // Re-throw the error after handling it
    }
  }

  /**
   * Extracts meal information from the description.
   *
   * @param {string} description - The description of the meal.
   * @returns {Promise<any>}
   */
  extractMealInfo(description: string): Promise<any> {
    return axios
      .post(
        this.apiUrl,
        { description },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error extracting meal info:', error);
        throw error;
      });
  }

  async extractMealDetails(
    message: string
  ): Promise<{ meal: string; mealType: string; datetime: string } | null> {
    try {
      const prompt = `
        Extract the following details from the message: 
        1. The meal (e.g., steak, salad)
        2. The type of meal (e.g., breakfast, lunch, dinner)
        3. The date and time of the meal.
        
        Message: "${message}"
        
        Provide the details in the following format:
        {
          "meal": "meal_description",
          "mealType": "type_of_meal",
          "datetime": "date_and_time"
        }
      `;

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      const result = response.data.choices[0].message.content.trim();
      const parsedResult = JSON.parse(result);

      if (
        !parsedResult.meal ||
        !parsedResult.mealType ||
        !parsedResult.datetime
      ) {
        return null; // Return null if any of the required fields are missing
      }

      return parsedResult;
    } catch (error) {
      console.error('Error extracting meal details:', error);
      return null; // Return null in case of an error
    }
  }

  /**
   * Gets a chat response based on the conversation history.
   *
   * @param {Array<{ role: string; content: string }>} conversationHistory - The conversation history.
   * @returns {Promise<string>}
   */
  async getChatResponse(
    conversationHistory: { role: string; content: string }[]
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: conversationHistory,
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
