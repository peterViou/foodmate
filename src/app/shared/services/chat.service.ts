// src/app/shared/services/chat.service.ts

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

/**
 * ChatService handles operations related to chat messages.
 * This includes saving messages, retrieving messages, and deleting all messages.
 */
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  /**
   * Saves a message to the Firestore database.
   * Associates the message with the current user's UID.
   *
   * @param {Message} message - The message to be saved.
   * @returns {Promise<void>}
   */
  async saveMessage(message: Message): Promise<void> {
    const user = await this.authService.getUser();
    if (user) {
      message.userId = user.uid;
    }
    const messagesCollection = collection(this.firestore, 'messages');
    await addDoc(messagesCollection, message);
  }

  /**
   * Retrieves all messages from the Firestore database.
   * Messages are ordered by their timestamp.
   *
   * @returns {Observable<Message[]>} - An observable stream of messages.
   */
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
      })
    );
  }

  /**
   * Deletes all messages from the Firestore database.
   *
   * @returns {Promise<void>}
   */
  async deleteAllMessages(): Promise<void> {
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
  }
}
