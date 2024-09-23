import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../types/user';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firebaseAuth: Auth, private firestore: Firestore) {}

  register(
    fullname: string,
    email: string,
    password: string,
    level: number
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((res) => {
      const user = res.user;
      return this.saveUser(user.uid, {
        auth: false,
        role: 1,
        level: level,
        email: <string>user.email,
        fullname: fullname,
      });
    });

    return from(promise);
  }

  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );

    return from(promise);
  }

  logout(): Observable<void> {
    const logout = signOut(this.firebaseAuth);
    return from(logout);
  }

  private saveUser(userId: string, data: User) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return setDoc(userDocRef, data, { merge: true });
  }
}
