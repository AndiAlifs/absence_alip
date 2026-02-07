import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Masuk</h2>
          <p class="mt-2 text-sm text-gray-600">Selamat datang kembali</p>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Pengguna</label>
            <input 
              type="text" 
              formControlName="username"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Masukkan nama pengguna">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
            <input 
              type="password" 
              formControlName="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Masukkan kata sandi">
          </div>
          <div class="flex items-center">
            <input 
              type="checkbox" 
              formControlName="rememberMe"
              id="rememberMe"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer">
            <label for="rememberMe" class="ml-2 block text-sm text-gray-700 cursor-pointer">
              Ingat Saya (7 hari)
            </label>
          </div>
          <button 
            type="submit" 
            [disabled]="loginForm.invalid"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02]">
            Masuk
          </button>
          <p *ngIf="error" class="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">{{ error }}</p>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Redirect if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      if (role === 'manager') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/clock-in']);
      }
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password, rememberMe } = this.loginForm.value;
      this.apiService.login({ username, password, remember_me: rememberMe }).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('full_name', res.full_name || '');
          localStorage.setItem('username', res.username || '');
          if (res.role === 'manager') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/clock-in']);
          }
        },
        error: (err) => {
          this.error = 'Invalid credentials';
        }
      });
    }
  }
}
