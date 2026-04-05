import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data?.['roles'] as string[] | undefined;
    if (allowedRoles && allowedRoles.length > 0) {
      const role = localStorage.getItem('role') || '';
      if (!allowedRoles.includes(role)) {
        if (role === 'manager') {
          this.router.navigate(['/admin']);
        } else if (role === 'instructor') {
          this.router.navigate(['/instructor/dashboard']);
        } else {
          this.router.navigate(['/clock-in']);
        }
        return false;
      }
    }

    return true;
  }
}
