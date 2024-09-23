import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userConnected$ = new BehaviorSubject<any>({});

  constructor(private firestore: Firestore) {}

  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' });
  }

  updateUserField(userId: string, fieldValue: boolean): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    const updateData = { auth: fieldValue };
    return from(updateDoc(userDocRef, updateData));
  }
}
