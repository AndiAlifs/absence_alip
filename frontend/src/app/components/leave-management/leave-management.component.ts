import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-management',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-start">
          <div>
            <h1 class="text-4xl font-bold text-gray-900">Manajemen Cuti</h1>
            <p class="mt-2 text-gray-600">Kelola permohonan cuti dari karyawan</p>
          </div>
          <button 
            (click)="goBackToDashboard()" 
            class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition-all shadow-lg flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div class="flex gap-4 border-b border-gray-200">
            <button 
              (click)="filterStatus = 'all'" 
              [class]="filterStatus === 'all' ? 'border-b-2 border-purple-600 text-purple-600 font-semibold pb-3' : 'text-gray-600 pb-3 hover:text-purple-600'">
              Semua ({{ leaveRequests.length }})
            </button>
            <button 
              (click)="filterStatus = 'pending'" 
              [class]="filterStatus === 'pending' ? 'border-b-2 border-yellow-600 text-yellow-600 font-semibold pb-3' : 'text-gray-600 pb-3 hover:text-yellow-600'">
              Menunggu ({{ getPendingCount() }})
            </button>
            <button 
              (click)="filterStatus = 'approved'" 
              [class]="filterStatus === 'approved' ? 'border-b-2 border-green-600 text-green-600 font-semibold pb-3' : 'text-gray-600 pb-3 hover:text-green-600'">
              Disetujui ({{ getApprovedCount() }})
            </button>
            <button 
              (click)="filterStatus = 'rejected'" 
              [class]="filterStatus === 'rejected' ? 'border-b-2 border-red-600 text-red-600 font-semibold pb-3' : 'text-gray-600 pb-3 hover:text-red-600'">
              Ditolak ({{ getRejectedCount() }})
            </button>
          </div>
        </div>

        <!-- Leave Requests List -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="h-6 w-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Daftar Permohonan Cuti
          </h2>

          <div *ngIf="getFilteredLeaveRequests().length > 0" class="space-y-4">
            <div *ngFor="let leave of getFilteredLeaveRequests()" class="border-l-4 rounded-lg p-6 shadow-md transition-all hover:shadow-lg"
                 [ngClass]="{
                   'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-500': leave.status === 'pending',
                   'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500': leave.status === 'approved',
                   'bg-gradient-to-r from-red-50 to-rose-50 border-red-500': leave.status === 'rejected'
                 }">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="md:col-span-2">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-xs text-gray-600 mb-1">Karyawan</p>
                      <p class="text-lg font-bold text-gray-900">{{ leave.user?.full_name || leave.user?.username || 'Unknown' }}</p>
                      <p *ngIf="leave.user?.full_name" class="text-sm text-gray-500">@{{ leave.user?.username }}</p>
                    </div>
                    <span [class]="getLeaveStatusClass(leave.status)" class="ml-4">
                      {{ getLeaveStatusText(leave.status) }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-col justify-center">
                  <p class="text-xs text-gray-600 mb-1">Durasi</p>
                  <p class="text-sm font-semibold text-gray-900">{{ calculateDuration(leave.start_date, leave.end_date) }} hari</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-white bg-opacity-50 rounded-lg p-4">
                <div>
                  <p class="text-xs text-gray-600 mb-1">📅 Tanggal Mulai</p>
                  <p class="font-semibold text-gray-900">{{ leave.start_date | date:'EEEE, dd MMMM yyyy' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">📅 Tanggal Selesai</p>
                  <p class="font-semibold text-gray-900">{{ leave.end_date | date:'EEEE, dd MMMM yyyy' }}</p>
                </div>
              </div>

              <div class="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
                <p class="text-xs text-gray-600 mb-2">💬 Alasan Cuti</p>
                <p class="text-gray-900">{{ leave.reason }}</p>
              </div>

              <div class="flex items-center justify-between pt-2">
                <p class="text-xs text-gray-500">
                  Diajukan pada: {{ leave.created_at | date:'dd MMM yyyy, HH:mm' }}
                </p>
                
                <div *ngIf="leave.status === 'pending'" class="flex gap-3">
                  <button 
                    (click)="approveLeave(leave.id)"
                    [disabled]="processingLeave === leave.id"
                    class="inline-flex items-center justify-center px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ processingLeave === leave.id ? 'Menyetujui...' : 'Setujui' }}
                  </button>
                  <button 
                    (click)="rejectLeave(leave.id)"
                    [disabled]="processingLeave === leave.id"
                    class="inline-flex items-center justify-center px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ processingLeave === leave.id ? 'Menolak...' : 'Tolak' }}
                  </button>
                </div>
              </div>

              <div *ngIf="leaveMessage[leave.id]" class="mt-3 p-3 rounded-lg" 
                   [class.bg-green-100]="!leaveError[leave.id]"
                   [class.bg-red-100]="leaveError[leave.id]">
                <p class="text-sm font-medium" 
                   [class.text-green-800]="!leaveError[leave.id]"
                   [class.text-red-800]="leaveError[leave.id]">
                  {{ leaveMessage[leave.id] }}
                </p>
              </div>
            </div>
          </div>

          <div *ngIf="getFilteredLeaveRequests().length === 0" class="text-center py-16">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-lg text-gray-600 font-medium">
              {{ filterStatus === 'all' ? 'Tidak ada permohonan cuti' : 'Tidak ada permohonan cuti dengan status ' + getFilterStatusText() }}
            </p>
            <p class="text-sm text-gray-500 mt-2">Permohonan cuti dari karyawan akan muncul di sini</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LeaveManagementComponent implements OnInit {
  leaveRequests: any[] = [];
  filterStatus: string = 'all';
  
  // Leave management properties
  processingLeave: number | null = null;
  leaveMessage: { [key: number]: string } = {};
  leaveError: { [key: number]: boolean } = {};

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    this.apiService.getAllLeaveRequests().subscribe({
      next: (response) => {
        this.leaveRequests = response.data || [];
      },
      error: (error) => {
        console.error('Failed to load leave requests:', error);
      }
    });
  }

  getFilteredLeaveRequests() {
    if (this.filterStatus === 'all') {
      return this.leaveRequests;
    }
    return this.leaveRequests.filter(leave => leave.status === this.filterStatus);
  }

  getPendingCount(): number {
    return this.leaveRequests.filter(l => l.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.leaveRequests.filter(l => l.status === 'approved').length;
  }

  getRejectedCount(): number {
    return this.leaveRequests.filter(l => l.status === 'rejected').length;
  }

  getFilterStatusText(): string {
    switch(this.filterStatus) {
      case 'pending': return 'menunggu';
      case 'approved': return 'disetujui';
      case 'rejected': return 'ditolak';
      default: return '';
    }
  }

  approveLeave(id: number) {
    this.processingLeave = id;
    this.leaveMessage[id] = '';
    this.leaveError[id] = false;

    this.apiService.updateLeaveStatus(id, 'approved').subscribe({
      next: (response) => {
        this.processingLeave = null;
        this.leaveMessage[id] = 'Cuti berhasil disetujui!';
        this.leaveError[id] = false;
        
        setTimeout(() => {
          this.loadLeaveRequests();
        }, 1500);
      },
      error: (error) => {
        this.processingLeave = null;
        this.leaveMessage[id] = error.error?.error || 'Gagal menyetujui cuti';
        this.leaveError[id] = true;
      }
    });
  }

  rejectLeave(id: number) {
    this.processingLeave = id;
    this.leaveMessage[id] = '';
    this.leaveError[id] = false;

    this.apiService.updateLeaveStatus(id, 'rejected').subscribe({
      next: (response) => {
        this.processingLeave = null;
        this.leaveMessage[id] = 'Cuti ditolak.';
        this.leaveError[id] = false;
        
        setTimeout(() => {
          this.loadLeaveRequests();
        }, 1500);
      },
      error: (error) => {
        this.processingLeave = null;
        this.leaveMessage[id] = error.error?.error || 'Gagal menolak cuti';
        this.leaveError[id] = true;
      }
    });
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  getLeaveStatusClass(status: string): string {
    switch(status) {
      case 'approved': return 'px-4 py-2 text-sm font-bold rounded-full bg-green-100 text-green-800 border-2 border-green-300';
      case 'rejected': return 'px-4 py-2 text-sm font-bold rounded-full bg-red-100 text-red-800 border-2 border-red-300';
      case 'pending': return 'px-4 py-2 text-sm font-bold rounded-full bg-yellow-100 text-yellow-800 border-2 border-yellow-300';
      default: return 'px-4 py-2 text-sm font-bold rounded-full bg-gray-100 text-gray-800 border-2 border-gray-300';
    }
  }

  getLeaveStatusText(status: string): string {
    switch(status) {
      case 'approved': return '✓ Disetujui';
      case 'rejected': return '✗ Ditolak';
      case 'pending': return '⏳ Menunggu';
      default: return status;
    }
  }

  goBackToDashboard() {
    this.router.navigate(['/admin']);
  }
}
