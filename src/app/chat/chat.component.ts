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
        context: 'default', // Default context
      };
      console.log('User message created:', userMessage);

      this.chatService
        .saveMessage(userMessage)
        .then(() => {
          console.log('User message saved');
          this.chatHistory.push(userMessage);

          // Collect the conversation history
          const conversationHistory = this.chatHistory.map((message) => ({
            role: message.type === 'user' ? 'user' : 'assistant',
            content: message.content,
          }));

          this.isTyping = true;

          this.chatService
            .analyzeMessage(userMessage.content)
            .then((mealDetails) => {
              if (mealDetails) {
                // Set context to meal if meal details are extracted
                this.chatHistory[this.chatHistory.length - 1].context = 'meal';
                this.contextService.setContext(
                  'conversationState',
                  'processing'
                );
                console.log('Meal details extracted:', mealDetails);
              } else {
                this.contextService.setContext('conversationState', 'greeting');
                console.log('No meal details extracted.');
              }

              this.chatService.handleState(
                this.contextService.getContext('conversationState'),
                conversationHistory
              );
            })
            .catch((error) => {
              console.error('Error analyzing message:', error);
            });
        })
        .catch((error) => {
          console.error('Error saving message:', error);
        });

      this.userInput = '';
    }
  }

  sendMessag_old(): void {
    console.log('sendMessage called');
    if (this.userInput.trim()) {
      const userMessage: Message = {
        type: 'user',
        content: this.userInput,
        timestamp: new Date(),
        context: 'default', // Default context
      };
      console.log('User message created:', userMessage);

      this.chatService
        .saveMessage(userMessage)
        .then(() => {
          console.log('User message saved');
          this.chatHistory.push(userMessage);

          // Collect the conversation history
          const conversationHistory = this.chatHistory.map((message) => ({
            role: message.type === 'user' ? 'user' : 'assistant',
            content: message.content,
          }));

          this.isTyping = true;

          this.chatService
            .analyzeMessage(userMessage.content)
            .then((isMealRelated) => {
              if (isMealRelated) {
                // Set context to meal
                this.chatHistory[this.chatHistory.length - 1].context = 'meal';
                this.contextService.setContext(
                  'conversationState',
                  'processing'
                );
              } else {
                this.contextService.setContext('conversationState', 'greeting');
              }

              this.chatService
                .handleState(
                  this.contextService.getContext('conversationState'),
                  conversationHistory
                )
                .then((botMessage) => {
                  this.chatHistory.push(botMessage);
                  this.isTyping = false;
                })
                .catch((error) => {
                  console.error('Error handling state:', error);
                });
            })
            .catch((error) => {
              console.error('Error analyzing message:', error);
            });
        })
        .catch((error) => {
          console.error('Error saving message:', error);
        });

      this.userInput = '';
    }
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.unsubscribeFromMessages();
  }
}
