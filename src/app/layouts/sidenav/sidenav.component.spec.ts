import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let mockAuthService: any;
  let mockUserService: any;

  beforeEach(async () => {
    // Mock the services
    mockAuthService = {
      logout: jest.fn(),
    };

    mockUserService = {
      userConnected$: of({ name: 'Test User' }),
    };

    await TestBed.configureTestingModule({
      imports: [
        SidenavComponent,
        MatListModule,
        MatIconModule,
        MatTooltipModule,
        RouterLink,
        CommonModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  // Test if the component is created successfully
  it('should create the SidenavComponent', () => {
    expect(component).toBeTruthy();
  });

  // Test the Input binding for 'isExpanded'
  it('should have isExpanded as false by default', () => {
    expect(component.isExpanded).toBe(false);
  });

  // Test the Output EventEmitter 'toggleMenu'
  it('should emit toggleMenu when called', () => {
    jest.spyOn(component.toggleMenu, 'emit');

    component.toggleMenu.emit();

    expect(component.toggleMenu.emit).toHaveBeenCalled();
  });

  // Test the logout method
  it('should call authService.logout when logout is invoked', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  // Test that the routeLinks are initialized correctly if the user is an admin
  it('should have correct routeLinks', () => {
    const expectedLinks = [
      { link: './tickets', name: 'Tickets', icon: 'view_agenda' },
      { link: './users', name: 'Users', icon: 'supervised_user_circle' },
    ];
    expect(component.routeLinksAdmin).toEqual(expectedLinks);
  });

  // Test that the routeLinks are initialized correctly if the user is not an admin
  it('should have correct routeLinks', () => {
    const expectedLinks = [
      { link: './tickets', name: 'Tickets', icon: 'view_agenda' },
    ];
    expect(component.routeLinks).toEqual(expectedLinks);
  });

  // Test user$ subscription from UserService
  it('should subscribe to user$ and get the user data', (done) => {
    component.user$.subscribe((user) => {
      expect(user).toEqual({ name: 'Test User' });
      done();
    });
  });
});
