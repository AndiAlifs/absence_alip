import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-history',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-gray-900">Riwayat Cuti</h1>
            <p class="mt-2 text-gray-600">Lihat semua permohonan cuti Anda dan statusnya</p>
          </div>
          <div class="flex gap-3">
            <button 
              (click)="goToClockIn()" 
              class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-lg flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Clock In
            </button>
            <button 
              (click)="goToLeaveRequest()" 
              class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition-all shadow-lg flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajukan Cuti Baru
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div *ngIf="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Memuat data...</p>
          </div>

          <div *ngIf="!loading && leaveHistory.length > 0" class="space-y-4">
            <div *ngFor="let leave of leaveHistory" class="border-l-4 rounded-lg p-6 shadow-md transition-all hover:shadow-lg"
                 [ngClass]="{
                   'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-500': leave.status === 'pending',
                   'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500': leave.status === 'approved',
                   'bg-gradient-to-r from-red-50 to-rose-50 border-red-500': leave.status === 'rejected'
                 }">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <span [class]="getLeaveStatusClass(leave.status)">
                    {{ getLeaveStatusText(leave.status) }}
                  </span>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">ID: #{{ leave.id }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-600 mb-1 flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Tanggal Mulai
                  </p>
                  <p class="font-semibold text-gray-900">{{ leave.start_date | date:'EEEE, dd MMMM yyyy' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1 flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Tanggal Selesai
                  </p>
                  <p class="font-semibold text-gray-900">{{ leave.end_date | date:'EEEE, dd MMMM yyyy' }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-xs text-gray-600 mb-1 flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Alasan Cuti
                  </p>
                  <p class="text-gray-900 bg-white bg-opacity-50 p-3 rounded-lg">{{ leave.reason }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-xs text-gray-600 mb-1 flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Durasi
                  </p>
                  <p class="font-semibold text-gray-900">
                    {{ calculateDuration(leave.start_date, leave.end_date) }} hari
                  </p>
                </div>
              </div>

              <div *ngIf="leave.status === 'pending'" class="mt-4 p-3 bg-yellow-100 rounded-lg">
                <p class="text-sm text-yellow-800 flex items-center">
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Permohonan cuti Anda sedang menunggu persetujuan dari manajer.
                </p>
              </div>

              <div *ngIf="leave.status === 'approved'" class="mt-4 p-3 bg-green-100 rounded-lg">
                <p class="text-sm text-green-800 flex items-center">
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cuti Anda telah disetujui! Selamat menikmati waktu libur Anda.
                </p>
              </div>

              <div *ngIf="leave.status === 'rejected'" class="mt-4 p-3 bg-red-100 rounded-lg">
                <p class="text-sm text-red-800 flex items-center">
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mohon maaf, permohonan cuti Anda ditolak. Silakan hubungi manajer untuk informasi lebih lanjut.
                </p>
              </div>
            </div>
          </div>

          <div *ngIf="!loading && leaveHistory.length === 0" class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-gray-600 text-lg font-medium">Anda belum memiliki riwayat cuti</p>
            <p class="mt-2 text-gray-500">Ajukan cuti pertama Anda dengan klik tombol "Ajukan Cuti Baru" di atas.</p>
            <button 
              (click)="goToLeaveRequest()" 
              class="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-lg inline-flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajukan Cuti Baru
            </button>
          </div>

          <div *ngIf="errorMessage" class="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LeaveHistoryComponent implements OnInit {
  leaveHistory: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaveHistory();
  }

  loadLeaveHistory() {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.getMyLeaveHistory().subscribe({
      next: (response) => {
        this.leaveHistory = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Gagal memuat riwayat cuti. Silakan coba lagi.';
        this.loading = false;
        console.error('Failed to load leave history:', error);
      }
    });
  }

  getLeaveStatusClass(status: string): string {
    switch(status) {
      case 'approved': return 'px-4 py-2 text-sm font-bold rounded-full bg-green-200 text-green-900 border-2 border-green-400';
      case 'rejected': return 'px-4 py-2 text-sm font-bold rounded-full bg-red-200 text-red-900 border-2 border-red-400';
      case 'pending': return 'px-4 py-2 text-sm font-bold rounded-full bg-yellow-200 text-yellow-900 border-2 border-yellow-400';
      default: return 'px-4 py-2 text-sm font-bold rounded-full bg-gray-200 text-gray-900 border-2 border-gray-400';
    }
  }

  getLeaveStatusText(status: string): string {
    switch(status) {
      case 'approved': return '✓ DISETUJUI';
      case 'rejected': return '✗ DITOLAK';
      case 'pending': return '⏳ MENUNGGU';
      default: return status.toUpperCase();
    }
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  }

  goToClockIn() {
    this.router.navigate(['/clock-in']);
  }

  goToLeaveRequest() {
    this.router.navigate(['/leave-request']);
  }
}
