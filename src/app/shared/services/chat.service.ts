import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Message } from '../../chat/message.model'; // Adjust the path as necessary
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  where,
} from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { ContextService } from './context.service';
import { ErrorHandlerService } from './error-handler.service';
import { OpenAIService } from './openai.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private openaiService: OpenAIService,
    private contextService: ContextService,
    private errorHandler: ErrorHandlerService
  ) {}

  async saveMessage(message: Message): Promise<void> {
    try {
      const user = await this.authService.getUser();
      if (user) {
        message.userId = user.uid;
      }
      const messagesCollection = collection(this.firestore, 'messages');
      await addDoc(messagesCollection, message);
    } catch (error) {
      this.errorHandler.handleError(error).subscribe();
    }
  }

  getMessages(): Observable<Message[]> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not logged in');
        }
        const messagesCollection = collection(this.firestore, 'messages');
        const q = query(
          messagesCollection,
          where('userId', '==', user.uid),
          orderBy('timestamp')
        );
        return collectionData(q, { idField: 'id' }) as Observable<Message[]>;
      }),
      catchError((error) => {
        this.errorHandler.handleError(error).subscribe();
        return throwError(() => new Error('Error fetching messages'));
      })
    );
  }

  async deleteAllMessages(): Promise<void> {
    try {
      const user = await this.authService.getUser();
      if (!user) {
        throw new Error('User not logged in');
      }
      const messagesCollection = collection(this.firestore, 'messages');
      const q = query(messagesCollection, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      this.errorHandler.handleError(error).subscribe();
    }
  }

  async analyzeMessage(
    message: string
  ): Promise<{ meal: string; mealType: string; datetime: string } | null> {
    try {
      return await this.openaiService.extractMealDetails(message);
    } catch (error) {
      this.errorHandler.handleError(error).subscribe();
      return null;
    }
  }

  async analyzeMessage_old(message: string): Promise<boolean> {
    try {
      return await this.openaiService.analyzeText(message);
    } catch (error) {
      this.errorHandler.handleError(error).subscribe();
      return false;
    }
  }

  async handleState(
    state: string,
    conversationHistory: { role: string; content: string }[]
  ): Promise<Message> {
    console.log(
      'handleState called with state:',
      state,
      'and conversationHistory:',
      conversationHistory
    );
    switch (state) {
      case 'greeting':
        return this.handleChatResponse(
          conversationHistory,
          'default',
          'collectingInfo'
        );
      case 'processing':
        return this.handleChatResponse(conversationHistory, 'meal', 'greeting');
      default:
        return this.handleChatResponse(
          conversationHistory,
          'default',
          'greeting'
        );
    }
  }

  private async handleChatResponse(
    conversationHistory: { role: string; content: string }[],
    context: 'default' | 'meal',
    nextState: string
  ): Promise<Message> {
    try {
      const response = await this.openaiService.getChatResponse(
        conversationHistory
      );
      const botMessage: Message = {
        type: 'bot',
        content: response,
        timestamp: new Date(),
        context: context,
      };

      await this.saveMessage(botMessage);
      this.contextService.setContext('conversationState', nextState);
      return botMessage;
    } catch (error) {
      this.errorHandler.handleError(error).subscribe();
      throw error;
    }
  }
}
