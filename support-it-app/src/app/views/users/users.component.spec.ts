import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../../types/user';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockUserService {
  getUsers = jest.fn().mockReturnValue(of([{ id: '1', email: 'test@example.com', fullname: 'Test User', level: 1, role: 'User', auth: true }]));
  updateUserField = jest.fn().mockReturnValue(of(void 0));
}

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockUserService: MockUserService;

  beforeEach(() => {
    mockUserService = new MockUserService();

    TestBed.configureTestingModule({
      imports: [UsersComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', () => {
    component.ngOnInit();
    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(1);
  });

  it('should apply filter correctly', () => {
    component.ngOnInit();
    component.applyFilter({ target: { value: 'Test' } } as unknown as Event);
    expect(component.dataSource.filter).toBe('test');
  });

  it('should toggle auth status on change', () => {
    const user: User = { id: '1', email: 'test@example.com', fullname: 'Test User', level: 1, role: 1, auth: true };
    component.change(user);
    expect(mockUserService.updateUserField).toHaveBeenCalledWith('1', false);
  });

  it('should reset paginator to first page after filtering', () => {
    const paginatorSpy = jest.spyOn(MatPaginator.prototype, 'firstPage');
    component.ngOnInit();
    component.applyFilter({ target: { value: 'Test' } } as unknown as Event);
    expect(paginatorSpy).toHaveBeenCalled();
  });
});
