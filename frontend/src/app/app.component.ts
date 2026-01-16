import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav *ngIf="isLoggedIn">
      <a routerLink="/clock-in">Clock In</a> |
      <a routerLink="/leave">Leave Request</a> |
      <a routerLink="/admin" *ngIf="isManager">Manager Dashboard</a> |
      <button (click)="logout()">Logout</button>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav { padding: 10px; background: #eee; margin-bottom: 20px; }
    nav a { margin-right: 15px; text-decoration: none; font-weight: bold; }
    nav button { float: right; }
  `]
})
export class AppComponent {
  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  get isManager() {
    return localStorage.getItem('role') === 'manager';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.reload();
  }
}
