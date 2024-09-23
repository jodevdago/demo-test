import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { User } from '../types/user';
import { doc, setDoc } from '@angular/fire/firestore';

jest.mock('firebase/auth');
jest.mock('@angular/fire/firestore');

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuth: Auth;
  let mockFirestore: Firestore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: {} },
        { provide: Firestore, useValue: {} },
      ],
    });

    authService = TestBed.inject(AuthService);
    mockAuth = TestBed.inject(Auth);
    mockFirestore = TestBed.inject(Firestore);
  });

  it('should register a user', (done) => {
    const mockUserCredential: Partial<UserCredential> = {
      user: { uid: '123', email: 'test@example.com' } as any,
    };
    const mockRegistration: User = {
      auth: false,
      role: 1,
      level: 1,
      email: 'test@example.com',
      fullname: 'Full Name',
    };

    // Mock Firebase functions
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
      mockUserCredential
    );
    (setDoc as jest.Mock).mockResolvedValue(undefined);

    authService
      .register('Full Name', 'test@example.com', 'password', 1)
      .subscribe(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          mockAuth,
          'test@example.com',
          'password'
        );
        expect(setDoc).toHaveBeenCalledWith(
          doc(mockFirestore, `users/123`),
          mockRegistration,
          { merge: true }
        );
        done();
      });
  });

  it('should login a user', (done) => {
    const mockUserCredential: Partial<UserCredential> = {
      user: { uid: '123', email: 'test@example.com' } as any,
    };

    // Mock Firebase function
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
      mockUserCredential
    );

    authService.login('test@example.com', 'password').subscribe((res) => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password'
      );
      expect(res.user.uid).toEqual('123');
      done();
    });
  });

  it('should logout a user', (done) => {
    // Mock Firebase function
    (signOut as jest.Mock).mockResolvedValue(undefined);

    authService.logout().subscribe(() => {
      expect(signOut).toHaveBeenCalledWith(mockAuth);
      done();
    });
  });
});
