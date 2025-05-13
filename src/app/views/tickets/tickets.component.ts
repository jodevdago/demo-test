import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TicketsService } from '../../services/tickets.service';
import { switchMap } from 'rxjs';
import { Ticket } from '../../types/ticket';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FirestoreTimestampToDatePipe } from '../../pipes/firestore-timestamp-to-date.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { UserService } from '../../services/user.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InitialsPipe } from '../../pipes/initials.pipe';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    FirestoreTimestampToDatePipe,
    MatDialogModule,
    DragDropModule,
    MatButtonToggleModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatGridListModule,
    InitialsPipe
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketsComponent implements OnInit {
  columnsToDisplay: string[] = [
    'id',
    'title',
    'priority',
    'assigned',
    'createdOn',
    'status'
  ];
  dataSource!: MatTableDataSource<any>;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Ticket | null = null;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  tickets = signal<Ticket[]>([]);
  pending = computed(() => this.tickets().filter(t => t.status === 'PENDING'));
  inProgress = computed(() => this.tickets().filter(t => t.status === 'INPROGRESS'));
  finished = computed(() => this.tickets().filter(t => t.status === 'FINISHED'));
  closed = computed(() => this.tickets().filter(t => t.status === 'CLOSED'));


  displayTable = true;
  isAdmin = false;
  user$;
  usersList$;

  assignedTo = new FormControl([]);

  constructor(
    private service: TicketsService,
    public createDialog: MatDialog,
    private userService: UserService,
    private destroyRef: DestroyRef,
  ) {
    this.user$ = this.userService.userConnected$;
    this.usersList$ = this.userService.getUsers();
  }

  ngOnInit(): void {
    this.assignedTo.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(users => {
        if (users && users.length > 0) {
          return this.service.getTicketsByAssignedFullname([...users]);
        } else {
          return this.service.getTickets();
        }
      })
    ).subscribe((tickets) => {
      this.dataSource = new MatTableDataSource(tickets);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.tickets.set(tickets);
    });
    this.assignedTo.setValue([]);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClickCreate(data?: Ticket): void {
    const dialogRef = this.createDialog.open(CreateTicketComponent, {
      width: '500px',
      height: '600px',
      data: data
    });
  }

  onDeleteTicket(id: string): void {
    this.service.deleteDocument(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  drop(event: CdkDragDrop<Ticket[]>): void {
    if (event.previousContainer.id === event.container.id) {
      // 🟡 same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const ticket = event.previousContainer.data[event.previousIndex];
      // update status
      ticket.status = event.container.id.toUpperCase() as Ticket['status'];
      // move
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // 🔥 Update Firestore
      const ticketId = ticket.id ? ticket.id : null;
      if (ticketId) {
        this.service.updateDocument(ticketId, ticket).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
          this.tickets.set([...this.tickets()]);
        });
      }
    }
  }

  getListByName(list: string): Ticket[] {
    switch (list) {
      case 'pending': return this.pending();
      case 'inProgress': return this.inProgress();
      case 'finished': return this.finished();
      case 'closed': return this.closed();
      default: return [];
    }
  }
}
