import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private firestore: Firestore) {}

  getTickets(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'tickets');
    return collectionData(usersCollection, { idField: 'id' });
  }
}
