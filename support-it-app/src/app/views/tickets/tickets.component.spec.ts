import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsComponent } from './tickets.component';
import { TicketsService } from '../../services/tickets.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;
  let ticketsService: TicketsService;
  let dialog: MatDialog;

  beforeEach(async () => {
    ticketsService = {
      getTickets: jest.fn(),
      deleteDocument: jest.fn(),
    } as unknown as jest.Mocked<TicketsService>;

    const dialogMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TicketsComponent],
      providers: [
        { provide: TicketsService, useValue: ticketsService },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    ticketsService = TestBed.inject(TicketsService);
    dialog = TestBed.inject(MatDialog);

    component.dataSource = new MatTableDataSource([
      {
        desc: 'eret',
        priority: '1',
        assigned: {
          email: 'tantely.ramananarivo09@gmail.com',
          auth: true,
          level: 3,
          fullname: 'tantely ramananarivo',
          role: 1,
          id: 'EVXLgwzwuVUUIHctMgleS3INOsc2',
        },
        createdOn: {
          seconds: 1727050415,
          nanoseconds: 860000000,
        },
        title: 'test',
        id: '9hoAIqsGE3MvWL8z4u2h',
      },
      {
        createdOn: {
          seconds: 1727041165,
          nanoseconds: 239000000,
        },
        title: 'Network error',
        desc: 'No internet',
        priority: 0,
        assigned: {
          email: 'jogasy.rabefialy@gmail.com',
          level: 3,
          fullname: 'jonathan rabefialy',
        },
        id: 'achgpHkpHdrMdO1ZgkS4',
      },
    ]) as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tickets on init', () => {
    const mockTickets = [
      {
        id: '1',
        title: 'Test Ticket',
        priority: 0,
        assigned: 'User',
        createdOn: new Date(),
      },
    ];
    (ticketsService.getTickets as jest.Mock).mockReturnValue(of(mockTickets));

    component.ngOnInit();

    expect(ticketsService.getTickets).toHaveBeenCalled();
    expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
    expect(component.dataSource.data).toHaveLength(1);
    expect(component.dataSource.data[0]).toEqual(mockTickets[0]);
  });
});
