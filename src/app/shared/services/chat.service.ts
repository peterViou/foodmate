// src/app/shared/services/chat.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    const currentUser = await this.authService.getUser();
    if (currentUser) {
      message.userId = currentUser.uid; // Assign the user's UID to the message
    }
    const messagesRef = collection(this.firestore, 'messages');
    await addDoc(messagesRef, message);
  }

  /**
   * Retrieves all messages from the Firestore database.
   * Messages are ordered by their timestamp.
   *
   * @returns {Observable<Message[]>} - An observable stream of messages.
   */
  getMessages(): Observable<Message[]> {
    const messagesRef = collection(this.firestore, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp'));
    return collectionData(messagesQuery, { idField: 'id' }).pipe(
      map((data) => data as Message[])
    );
  }

  /**
   * Deletes all messages from the Firestore database.
   *
   * @returns {Promise<void>}
   */
  async deleteAllMessages(): Promise<void> {
    // TODO: Add alert message to confirm deletion
    // TODO: Add notification message that messages have been deleted
    const messagesRef = collection(this.firestore, 'messages');
    const messagesQuery = query(messagesRef);
    const messagesSnapshot = await getDocs(messagesQuery);
    messagesSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }
}
