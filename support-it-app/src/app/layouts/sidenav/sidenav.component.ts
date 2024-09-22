import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterLink, MatTooltipModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  @Input() isExpanded = false;
  @Output() toggleMenu = new EventEmitter();

  routeLinks = [
    { link: './', name: 'Tickets', icon: 'view_agenda' },
    { link: './users', name: 'Users', icon: 'supervised_user_circle' },
  ];
}
