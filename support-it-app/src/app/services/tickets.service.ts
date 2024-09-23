import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  constructor(private firestore: Firestore) {}

  getTickets(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'tickets');
    return collectionData(usersCollection, { idField: 'id' });
  }

  createDocument(data: any) {
    const usersCollection = collection(this.firestore, 'tickets');
    return from(addDoc(usersCollection, data));
  }

  deleteDocument(id: string): Observable<void> {
    const ticketDocRef = doc(this.firestore, `tickets/${id}`);
    return from(deleteDoc(ticketDocRef));
  }

  updateDocument(userId: string, data: any): Observable<void> {
    const userDocRef = doc(this.firestore, `tickets/${userId}`);
    return from(updateDoc(userDocRef, data));
  }
}
