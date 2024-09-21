import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  animations: [
    trigger('expandCollapse', [
      state('login', style({
        height: '*',
        opacity: 1
      })),
      state('signup', style({
        height: '*',
        opacity: 1
      })),
      transition('login <=> signup', [
        style({ height: 0, opacity: 0 }),
        animate('750ms ease-in-out', style({ height: '*', opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isSignUpMode = signal(false);

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: (''),
      password: (''),
      confirmPassword: (''),
      level: (1)
    })
  }

  clickEvent(event: MouseEvent, hidePassword: boolean): void {
    if(hidePassword) {
      this.hidePassword.set(!this.hidePassword());
    } else {
      this.hideConfirmPassword.set(!this.hideConfirmPassword());
    }
    event.stopPropagation();
  }

  onSignUp(): void {
    this.isSignUpMode.set(true);
  }

  onLogin(): void {
    this.isSignUpMode.set(false);
  }

  submit(): void {
    console.log('[submit]', this.form.value);
  }
}
