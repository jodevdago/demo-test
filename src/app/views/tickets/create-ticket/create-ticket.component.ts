import { UserService } from './../../../services/user.service';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { User } from '../../../types/user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TicketsService } from '../../../services/tickets.service';
import { map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    CommonModule,
    ReactiveFormsModule,
    MatDividerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss',
})
export class CreateTicketComponent implements OnInit, OnDestroy {
  options: any[] = [];
  users$: Observable<any[]> = of([]);
  form: FormGroup;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usersService: UserService,
    private ticketService: TicketsService,
    private dialogRef: MatDialogRef<CreateTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      desc: [data?.desc || '', Validators.required],
      priority: [data?.priority || 0, Validators.required],
      title: [data?.title || '', Validators.required],
      assigned: [data?.assigned || {}, Validators.required],
      status: [data?.status || 'PENDING', Validators.required],
    });

    this.usersService.getUsers().subscribe(x => {
      this.options = x;
    });
  }

  ngOnInit(): void {
    this.users$ = this.form.get('assigned')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.fullname;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    )

    this.usersService.userConnected$.subscribe(x => {
      if (x.role == 0) {
        this.form.enable();
      } else {
        this.form.get('desc')?.disable();
        this.form.get('priority')?.disable();
        this.form.get('title')?.disable();
        this.form.get('assigned')?.disable();
        this.form.get('status')?.enable();
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  displayFn(user: User): string {
    return user && user.fullname ? user.fullname : '';
  }

  create(): void {
    const formdata = {
      ...this.form.value,
      createdOn: new Date(),
    };
    if (this.data) {
      this.ticketService.updateDocument(this.data.id, formdata).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(x => {
        this.form.patchValue({
          desc: '',
          priority: 0,
          title: '',
          assigned: {},
        });
        this.dialogRef.close();
      })
    } else {
      this.ticketService
      .createDocument(formdata)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((x) => {
        this.form.patchValue({
          desc: '',
          priority: 0,
          title: '',
          assigned: {},
        });
        this.dialogRef.close();
      });
    }
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.fullname.toLowerCase().includes(filterValue));
  }
}
