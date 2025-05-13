import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TicketsComponent } from './tickets.component';
import { TicketsService } from '../../services/tickets.service';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let ticketsService: jest.Mocked<TicketsService>;
  let userService: jest.Mocked<UserService>;
  let matDialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    // Mock services
    ticketsService = {
      getTickets: jest.fn(),
      deleteDocument: jest.fn(),
    } as unknown as jest.Mocked<TicketsService>;

    userService = {
      userConnected$: of({ id: '123', name: 'Test User' }),
      getUsers: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<UserService>;

    matDialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    // Configure TestBed
    await TestBed.configureTestingModule({
      imports: [TicketsComponent],
      providers: [
        { provide: TicketsService, useValue: ticketsService },
        { provide: UserService, useValue: userService },
        { provide: MatDialog, useValue: matDialog },
      ],
    }).compileComponents();

    // Create component instance
    const fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tickets on init', () => {
    const mockTickets = [{ id: '1', title: 'Test Ticket', priority: 0 }];
    ticketsService.getTickets.mockReturnValue(of(mockTickets));

    component.ngOnInit();

    expect(ticketsService.getTickets).toHaveBeenCalled();
    expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
    expect(component.dataSource.data).toEqual(mockTickets);
  });

  it('should filter tickets based on input', () => {
    const mockEvent = { target: { value: 'test' } } as unknown as Event;
    component.dataSource = new MatTableDataSource([
      { id: '1', title: 'Test Ticket' },
      { id: '2', title: 'Another Ticket' },
    ]);

    component.applyFilter(mockEvent);

    expect(component.dataSource.filter).toBe('test');
  });
});
