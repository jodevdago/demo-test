import { inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { catchError, from, map, Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';

export const AuthGuard = () => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);
  const userService = inject(UserService);

  return new Observable<boolean>((observer) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(firestore, `users/${user.uid}`);
        from(getDoc(userDocRef))
          .pipe(
            map((userDoc) => {
              if (userDoc.exists()) {
                const userData = userDoc.data();
                userService.userConnected$.next(userData);
                return userData && userData['auth'] === true;
              } else {
                return false;
              }
            }),
            catchError((error) => {
              console.error('Error retrieving Firestore document', error);
              return of(false);
            })
          )
          .subscribe((authValid) => {
            if (authValid) {
              observer.next(true);
            } else {
              router.navigate(['./unauthorized']);
              observer.next(false);
            }
            observer.complete();
          });
      } else {
        router.navigate(['./login']);
        observer.next(false);
        observer.complete();
      }
    });
  });
};
