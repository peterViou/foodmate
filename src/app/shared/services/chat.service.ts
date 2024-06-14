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

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async saveMessage(message: Message): Promise<void> {
    const user = await this.authService.getUser();
    if (user) {
      message.userId = user.uid; // Assign the user's UID to the message
    }
    const messagesCollection = collection(this.firestore, 'messages');
    await addDoc(messagesCollection, message);
  }

  getMessages(): Observable<Message[]> {
    const messagesCollection = collection(this.firestore, 'messages');
    const q = query(messagesCollection, orderBy('timestamp'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((actions) => actions as Message[])
    );
  }

  async deleteAllMessages(): Promise<void> {
    // TODO: aleter message to confirm
    // TODO: notification message have been deleted
    const messagesCollection = collection(this.firestore, 'messages');
    const q = query(messagesCollection);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }
}
