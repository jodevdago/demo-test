import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
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
import { Subject, takeUntil } from 'rxjs';
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
export class TicketsComponent implements OnInit, OnDestroy {
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

  user$;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private service: TicketsService,
    public createDialog: MatDialog,
    private userService: UserService
  ) {
    this.user$ = this.userService.userConnected$;
  }

  ngOnInit(): void {
    this.service
      .getTickets()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((tickets) => {
        this.dataSource = new MatTableDataSource(tickets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClickCreate(data?: any): void {
    const dialogRef = this.createDialog.open(CreateTicketComponent, {
      width: '500px',
      height: '600px',
      data: data
    });
  }

  onDeleteTicket(id: string): void {
    this.service.deleteDocument(id).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(x => {
      console.log(x);
    })
  }
}
