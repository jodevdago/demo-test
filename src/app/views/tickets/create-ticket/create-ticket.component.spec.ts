import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CreateTicketComponent } from './create-ticket.component';
import { UserService } from '../../../services/user.service';
import { TicketsService } from '../../../services/tickets.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateTicketComponent', () => {
  let component: CreateTicketComponent;
  let fixture: ComponentFixture<CreateTicketComponent>;
  let mockUserService: any;
  let mockTicketsService: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockUserService = {
      getUsers: jest.fn().mockReturnValue(of([{ id: '1', fullname: 'John Doe' }])),
      userConnected$: of({ role: 0 }),
    };

    mockTicketsService = {
      createDocument: jest.fn().mockReturnValue(of({})),
      updateDocument: jest.fn().mockReturnValue(of({})),
    };

    mockDialogRef = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CreateTicketComponent, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: mockUserService },
        { provide: TicketsService, useValue: mockTicketsService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null }, // Mock the input data
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values when no data is provided', () => {
    expect(component.form.value).toEqual({
      desc: '',
      priority: 0,
      title: '',
      assigned: {},
      status: 'PENDING',
    });
  });

  it('should call createDocument on ticket creation when no data is provided', () => {
    component.create();
    expect(mockTicketsService.createDocument).toHaveBeenCalledWith({
      desc: '',
      priority: 0,
      title: '',
      assigned: {},
      status: 'PENDING',
      createdOn: expect.any(Date),
    });
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should filter users based on the assigned input', () => {
    component.options = [
      { id: '1', fullname: 'John Doe' },
      { id: '2', fullname: 'Jane Smith' },
    ];

    const filteredUsers = component['_filter']('John');
    expect(filteredUsers).toEqual([{ id: '1', fullname: 'John Doe' }]);
  });

  it('should enable the form fields for users with role 0', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.enabled).toBeTruthy();
  });

  it('should disable the form fields except status for users with non-role 0', () => {
    mockUserService.userConnected$ = of({ role: 1 });
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.get('desc')?.disabled).toBe(true);
    expect(component.form.get('priority')?.disabled).toBe(true);
    expect(component.form.get('title')?.disabled).toBe(true);
    expect(component.form.get('assigned')?.disabled).toBe(true);
    expect(component.form.get('status')?.enabled).toBe(true);
  });
});
