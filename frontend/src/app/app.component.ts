import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav *ngIf="isLoggedIn" class="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex-shrink-0 flex items-center group cursor-help relative">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex flex-col ml-2">
              <span class="text-xl font-bold text-white tracking-wider">NYAMPE</span>
              <span class="text-[10px] text-blue-200 leading-none hidden md:block">Nyaman Manajemen Presensi Elektronik</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-1">
            <a 
              routerLink="/clock-in" 
              routerLinkActive="bg-indigo-800"
              class="flex items-center px-4 py-2 rounded-lg text-white hover:bg-indigo-800 transition-all duration-200 font-medium">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Clock In
            </a>
            
            <a 
              *ngIf="!isManager"
              routerLink="/leave-request" 
              routerLinkActive="bg-indigo-800"
              class="flex items-center px-4 py-2 rounded-lg text-white hover:bg-indigo-800 transition-all duration-200 font-medium">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ajukan Cuti
            </a>
            
            <a 
              *ngIf="!isManager"
              routerLink="/leave-history" 
              routerLinkActive="bg-indigo-800"
              class="flex items-center px-4 py-2 rounded-lg text-white hover:bg-indigo-800 transition-all duration-200 font-medium">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Riwayat Cuti
            </a>
            
            <a 
              *ngIf="!isManager"
              routerLink="/my-attendance" 
              routerLinkActive="bg-indigo-800"
              class="flex items-center px-4 py-2 rounded-lg text-white hover:bg-indigo-800 transition-all duration-200 font-medium">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Riwayat Absensi
            </a>
            
            <a 
              *ngIf="isManager"
              routerLink="/admin" 
              routerLinkActive="bg-indigo-800"
              class="flex items-center px-4 py-2 rounded-lg text-white hover:bg-indigo-800 transition-all duration-200 font-medium">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard Manajer
            </a>
          </div>

          <!-- User Info & Logout -->
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex flex-col items-end px-3 py-1 bg-indigo-800 rounded-lg">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p class="text-sm text-white font-bold">{{ fullName || username }}</p>
                  <p class="text-xs text-indigo-200">{{ isManager ? 'Manajer' : 'Karyawan' }}</p>
                </div>
              </div>
            </div>
            
            <button 
              (click)="logout()" 
              class="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar
            </button>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button 
              (click)="toggleMobileMenu()"
              class="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path *ngIf="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div *ngIf="mobileMenuOpen" class="md:hidden bg-indigo-800">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a 
            routerLink="/clock-in" 
            routerLinkActive="bg-indigo-900"
            (click)="toggleMobileMenu()"
            class="flex items-center px-3 py-2 rounded-md text-white hover:bg-indigo-900 transition-all font-medium">
            <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Clock In
          </a>
          
          <a 
            *ngIf="!isManager"
            routerLink="/leave-request" 
            routerLinkActive="bg-indigo-900"
            (click)="toggleMobileMenu()"
            class="flex items-center px-3 py-2 rounded-md text-white hover:bg-indigo-900 transition-all font-medium">
            <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ajukan Cuti
          </a>
          
          <a 
            *ngIf="!isManager"
            routerLink="/leave-history" 
            routerLinkActive="bg-indigo-900"
            (click)="toggleMobileMenu()"
            class="flex items-center px-3 py-2 rounded-md text-white hover:bg-indigo-900 transition-all font-medium">
            <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Riwayat Cuti
          </a>
          
          <a 
            *ngIf="!isManager"
            routerLink="/my-attendance" 
            routerLinkActive="bg-indigo-900"
            (click)="toggleMobileMenu()"
            class="flex items-center px-3 py-2 rounded-md text-white hover:bg-indigo-900 transition-all font-medium">
            <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Riwayat Absensi
          </a>
          
          <a 
            *ngIf="isManager"
            routerLink="/admin" 
            routerLinkActive="bg-indigo-900"
            (click)="toggleMobileMenu()"
            class="flex items-center px-3 py-2 rounded-md text-white hover:bg-indigo-900 transition-all font-medium">
            <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard Manajer
          </a>

          <div class="px-3 py-2 border-t border-indigo-700 mt-2 pt-2">
            <div class="flex items-center text-white">
              <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p class="text-sm font-bold">{{ fullName || username }}</p>
                <p class="text-xs text-indigo-200">{{ isManager ? 'Manajer' : 'Karyawan' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  mobileMenuOpen = false;

  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  get isManager() {
    return localStorage.getItem('role') === 'manager';
  }

  get fullName() {
    return localStorage.getItem('full_name') || '';
  }

  get username() {
    return localStorage.getItem('username') || '';
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('full_name');
    localStorage.removeItem('username');
    window.location.reload();
  }
}
