import { Component, DestroyRef, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  animations: [
    trigger('expandCollapse', [
      state(
        'login',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      state(
        'signup',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('login <=> signup', [
        style({ height: 0, opacity: 0 }),
        animate('750ms ease-in-out', style({ height: '*', opacity: 1 })),
      ]),
    ]),
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isSignUpMode = signal(false);

  registrationForm: FormGroup;
  loginForm: FormGroup;

  errorRegistrationMessage: string | null = null;
  errorLoginMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {
    this.registrationForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      level: [1, Validators.required],
      fullname: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  clickEvent(event: MouseEvent, hidePassword: boolean): void {
    if (hidePassword) {
      this.hidePassword.set(!this.hidePassword());
    } else {
      this.hideConfirmPassword.set(!this.hideConfirmPassword());
    }
    event.stopPropagation();
  }

  onSignUp(): void {
    this.registrationForm.reset({
      email: '',
      password: '',
      confirmPassword: '',
      level: null,
      fullname: '',
    });
    this.loginForm.reset({
      email: null,
      password: null,
    });
    this.isSignUpMode.set(true);
  }

  onLogin(): void {
    this.registrationForm.reset({
      email: '',
      password: '',
      confirmPassword: '',
      level: null,
      fullname: '',
    });
    this.loginForm.reset({
      email: null,
      password: null,
    });
    this.isSignUpMode.set(false);
  }

  registration(): void {
    this.authService
      .register(
        this.registrationForm.get('fullname')?.value,
        this.registrationForm.get('email')?.value,
        this.registrationForm.get('password')?.value,
        this.registrationForm.get('level')?.value
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.onLogin();
        },
        error: (err) => {
          this.errorRegistrationMessage = err.code;
          timer(3000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.errorRegistrationMessage = '';
            });
        },
      });
  }

  login(): void {
    this.authService
      .login(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['./layout']);
        },
        error: (err) => {
          this.errorLoginMessage = err.code;
          timer(3000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.errorLoginMessage = '';
            });
        },
      });
  }

  passwordMatchValidator(form: FormGroup): {
    mismatch: boolean;
  } | null {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }
}
