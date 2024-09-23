import { TestBed } from '@angular/core/testing';
import { collection, collectionData, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { of, throwError } from 'rxjs';

jest.mock('firebase/auth');
jest.mock('@angular/fire/firestore');

describe('AuthService', () => {
  let userService: UserService;
  let mockFirestore: Firestore;

  // Mock data for users
  const mockUsers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
  ];

  // Mocking Firestore collection and collectionData
  const mockCollection = {
    id: 'users',
    data: jest.fn(() => of(mockUsers)), // Mock the data returned from collectionData
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: Firestore, useValue: {} },
      ],
    });

    userService = TestBed.inject(UserService);
    mockFirestore = TestBed.inject(Firestore);
  });

  it('should fetch users collection data', (done) => {
    // Mock collection and collectionData methods
    (collection as jest.Mock).mockReturnValue(mockCollection);
    (collectionData as jest.Mock).mockReturnValue(of(mockUsers));

    userService.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
      expect(collection).toHaveBeenCalledWith(mockFirestore, 'users');
      done();
    });
  });

  it('should update user auth field successfully', (done) => {
    const userId = '123';
    const fieldValue = true;

    const mockDocRef = { id: userId }; // Mock document reference
    (doc as jest.Mock).mockReturnValue(mockDocRef); // Mock the doc method
    (updateDoc as jest.Mock).mockImplementation(() => of(void 0)); // Mock the updateDoc method

    userService.updateUserField(userId, fieldValue).subscribe(() => {
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { auth: fieldValue }); // Verify update was called
      done();
    });
  });

  it('should handle error when updating user auth field', (done) => {
    const userId = '123';
    const fieldValue = true;
    const error = new Error('Update failed');

    const mockDocRef = { id: userId }; // Mock document reference
    (doc as jest.Mock).mockReturnValue(mockDocRef); // Mock the doc method
    (updateDoc as jest.Mock).mockImplementation(() => throwError(() => error)); // Mock error on updateDoc

    userService.updateUserField(userId, fieldValue).subscribe({
      next: () => {},
      error: (err) => {
        expect(err).toEqual(error);
        done();
      },
    });
  });
});
