import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTicketComponent } from './create-ticket.component';
import { UserService } from '../../../services/user.service';
import { Firestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('CreateTicketComponent', () => {
  let component: CreateTicketComponent;
  let fixture: ComponentFixture<CreateTicketComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTicketComponent],
      providers: [
        { provide: UserService, useValue: userService },
        {
          provide: MatDialogRef,
          useValue: { close: jest.fn() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        {
          provide: Firestore,
          useValue: {},
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userService = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
