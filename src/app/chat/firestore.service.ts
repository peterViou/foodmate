import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from './message.model'; // Adjust the path as necessary
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  async saveMessage(message: Message): Promise<void> {
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
}
