import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Ticket } from '../types/ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  constructor(private firestore: Firestore) {}

  getTickets(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'tickets');
    return collectionData(usersCollection, { idField: 'id' });
  }

  createDocument(data: any): Observable<DocumentReference<any, DocumentData>> {
    const ticketsCollection = collection(this.firestore, 'tickets');
    return from(addDoc(ticketsCollection, data));
  }

  deleteDocument(id: string): Observable<void> {
    const ticketDocRef = doc(this.firestore, `tickets/${id}`);
    return from(deleteDoc(ticketDocRef));
  }

  updateDocument(userId: string, data: any): Observable<void> {
    const userDocRef = doc(this.firestore, `tickets/${userId}`);
    return from(updateDoc(userDocRef, data));
  }

  getTicketsByAssignedFullname(fullname: string[]): Observable<Ticket[]> {
    const ticketsRef = collection(this.firestore, 'tickets');
    const q = query(ticketsRef, where('assigned.fullname', 'in', fullname));
    return collectionData(q, { idField: 'id' }) as Observable<Ticket[]>;
  }
}
