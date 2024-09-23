import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAuthService {
  register = jest.fn().mockReturnValue(of(void 0));
  login = jest.fn().mockReturnValue(of({}));
}

class MockRouter {
  navigate = jest.fn();
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;

  beforeEach(() => {
    jest.useFakeTimers();
    mockAuthService = new MockAuthService();
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call register on AuthService and navigate to login on successful registration', () => {
    component.registrationForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      level: 1,
      fullname: 'Test User',
    });

    component.registration();

    expect(mockAuthService.register).toHaveBeenCalledWith(
      'Test User',
      'test@example.com',
      'password123',
      1
    );
    expect(component.isSignUpMode()).toBe(false);
  });

  it('should navigate to layout on successful login', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['./layout']);
  });

  it('should set error message on failed login', () => {
    const errorMessage = { code: 'auth/invalid-email' };
    mockAuthService.login = jest
      .fn()
      .mockReturnValue(throwError(() => errorMessage));

    component.loginForm.setValue({
      email: 'invalid-email',
      password: 'wrong-password',
    });

    component.login();

    expect(component.errorLoginMessage).toBe(errorMessage.code);
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // Ensure navigation does not occur
  });

  it('should toggle hidePassword state on clickEvent', () => {
    const initialHidePasswordState = component.hidePassword();

    component.clickEvent(new MouseEvent('click'), true);
    expect(component.hidePassword()).toBe(!initialHidePasswordState);
  });

  it('should toggle hideConfirmPassword state on clickEvent', () => {
    const initialHideConfirmPasswordState = component.hideConfirmPassword();

    component.clickEvent(new MouseEvent('click'), false);
    expect(component.hideConfirmPassword()).toBe(!initialHideConfirmPasswordState);
  });

  it('should reset forms and set signUpMode to true on onSignUp', () => {
    component.onSignUp();

    expect(component.isSignUpMode()).toBe(true);
    expect(component.registrationForm.value).toEqual({
      email: '',
      password: '',
      confirmPassword: '',
      level: null,
      fullname: '',
    });
    expect(component.loginForm.value).toEqual({
      email: null,
      password: null,
    });
  });

  it('should set error message on failed registration', () => {
    const errorMessage = { code: 'auth/email-already-in-use' };
    mockAuthService.register = jest
      .fn()
      .mockReturnValue(throwError(() => errorMessage));

    component.registrationForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      level: 1,
      fullname: 'Test User',
    });

    component.registration();

    expect(component.errorRegistrationMessage).toBe(errorMessage.code);

    jest.advanceTimersByTime(3000);

    expect(component.errorRegistrationMessage).toBe('');
  });

  it('should set error message on failed registration and reset after 3 seconds', () => {
    const errorMessage = { code: 'auth/email-already-in-use' };
    mockAuthService.register = jest
      .fn()
      .mockReturnValue(throwError(() => errorMessage));

    component.registrationForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      level: 1,
      fullname: 'Test User',
    });

    component.registration();

    expect(component.errorRegistrationMessage).toBe(errorMessage.code);

    jest.advanceTimersByTime(3000);

    expect(component.errorRegistrationMessage).toBe('');
  });

  it('should set error message on failed login and reset after 3 seconds', () => {
    const errorMessage = { code: 'auth/invalid-email' };
    mockAuthService.login = jest
      .fn()
      .mockReturnValue(throwError(() => errorMessage));

    component.loginForm.setValue({
      email: 'invalid-email',
      password: 'wrong-password',
    });

    component.login();

    expect(component.errorLoginMessage).toBe(errorMessage.code);

    jest.advanceTimersByTime(3000);

    expect(component.errorLoginMessage).toBe('');
  });

});
