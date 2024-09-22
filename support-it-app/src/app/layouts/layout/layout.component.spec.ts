import { TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let authService: AuthService;

  beforeEach(() => {
    const authServiceMock = {
      logout: jest.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        LayoutComponent,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    component = TestBed.inject(LayoutComponent);
    authService = TestBed.inject(AuthService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout when logout is called', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['unsubscribe$'], 'next');
    const completeSpy = jest.spyOn(component['unsubscribe$'], 'complete');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalledWith();
    expect(completeSpy).toHaveBeenCalled();
  });
});
