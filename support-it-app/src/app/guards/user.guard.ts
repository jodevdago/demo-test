import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export const userGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return new Observable<boolean>((observer) => {
    userService.userConnected$.subscribe((x) => {
      if (x.role == 0) {
        observer.next(true);
      } else {
        router.navigate(['./layout']);
        observer.next(false);
      }
    });
  });
};
