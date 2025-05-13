import { TestBed } from '@angular/core/testing';
import { TicketsService } from './tickets.service';
import { DocumentReference, Firestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';

jest.mock('@angular/fire/firestore');

describe('TicketsService', () => {
  let service: TicketsService;
  let firestore: jest.Mocked<Firestore>;

  beforeEach(() => {
    firestore = {
      collection: jest.fn().mockReturnValue('mockCollection'),
    } as unknown as jest.Mocked<Firestore>;

    TestBed.configureTestingModule({
      providers: [TicketsService, { provide: Firestore, useValue: firestore }],
    });

    service = TestBed.inject(TicketsService);
  });

  it('should fetch tickets from Firestore', (done) => {
    const mockTicketData = [{ id: '1', title: 'Test Ticket' }];
    const mockCollection = jest.fn().mockReturnValue(mockTicketData);
    (collectionData as jest.Mock).mockReturnValue(from([mockTicketData]));

    service.getTickets().subscribe((tickets) => {
      expect(tickets).toEqual(mockTicketData);
      expect(collection).toHaveBeenCalledWith(firestore, 'tickets');
      done();
    });
  });

  it('should delete a document from Firestore', (done) => {
    const mockId = 'ticket-id';
    const mockDocRef = { id: mockId };
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (deleteDoc as jest.Mock).mockReturnValue(Promise.resolve());
    service.deleteDocument(mockId).subscribe(() => {
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
      done();
    });
    expect(doc).toHaveBeenCalledWith(firestore, `tickets/${mockId}`);
  });

  it('should update a document in Firestore', (done) => {
    const mockUserId = 'ticket-id';
    const mockData = { title: 'Updated Ticket' };
    const mockDocRef = { id: mockUserId };
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (updateDoc as jest.Mock).mockReturnValue(Promise.resolve());
    service.updateDocument(mockUserId, mockData).subscribe(() => {
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, mockData);
      done();
    });
    expect(doc).toHaveBeenCalledWith(firestore, `tickets/${mockUserId}`);
  });

  it('should add a document to Firestore', (done) => {
    const mockData = { title: 'New Ticket' };
    const mockAddDocResponse: DocumentReference<any> = {
      id: 'new-ticket-id',
    } as DocumentReference<any>;

    (collection as jest.Mock).mockReturnValue('mockCollection');
    (addDoc as jest.Mock).mockResolvedValue(mockAddDocResponse);

    // Call the createDocument method
    service.createDocument(mockData).subscribe((res) => {
      expect(res).toEqual(mockAddDocResponse);
      expect(addDoc).toHaveBeenCalledWith('mockCollection', mockData);
      done();
    });
    expect(collection).toHaveBeenCalledWith(firestore, 'tickets');
  });

    it('should get tickets by assigned fullname', (done) => {
    const mockFullnames = ['John Doe', 'Jane Smith'];
    const mockTickets = [
      { id: '1', assigned: { fullname: 'John Doe' }, title: 'Ticket 1' },
      { id: '2', assigned: { fullname: 'Jane Smith' }, title: 'Ticket 2' },
    ];

    const mockCollectionRef = {};
    const mockQuery = {};

    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
    (query as jest.Mock).mockReturnValue(mockQuery);
    (where as jest.Mock).mockImplementation(() => 'whereCondition'); // not really used, just mocked
    (collectionData as jest.Mock).mockReturnValue(from([mockTickets]));

    service.getTicketsByAssignedFullname(mockFullnames).subscribe((tickets) => {
      expect(tickets).toEqual(mockTickets);
      expect(collection).toHaveBeenCalledWith(firestore, 'tickets');
      expect(where).toHaveBeenCalledWith('assigned.fullname', 'in', mockFullnames);
      expect(query).toHaveBeenCalledWith(mockCollectionRef, 'whereCondition');
      expect(collectionData).toHaveBeenCalledWith(mockQuery, { idField: 'id' });
      done();
    });
  });

});
