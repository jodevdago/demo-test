import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  @Input() isExpanded = false;
  @Output() toggleMenu = new EventEmitter();

  userService = inject(UserService);
  authService = inject(AuthService);

  user$ = this.userService.userConnected$;

  routeLinksAdmin = [
    { link: './tickets', name: 'Tickets', icon: 'view_agenda' },
    { link: './users', name: 'Users', icon: 'supervised_user_circle' },
  ];

  routeLinks = [
    { link: './tickets', name: 'Tickets', icon: 'view_agenda' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
