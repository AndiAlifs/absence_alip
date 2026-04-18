import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-student-management',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-100 py-8 px-4">
      <div class="max-w-6xl mx-auto space-y-6">

        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h1 class="text-3xl font-bold text-slate-900">Daftar Murid</h1>
          <p class="text-slate-600 mt-1">Murid yang ditugaskan ke Anda oleh admin.</p>
        </div>

        <!-- Info banner -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-blue-800 text-sm">Penambahan murid, pengaturan kuota, dan jadwal belajar dikelola oleh admin. Anda hanya dapat memulai/mengakhiri sesi belajar.</p>
        </div>

        <!-- Active / Alumni tabs -->
        <div *ngIf="!detailStudent" class="bg-white rounded-2xl shadow-xl p-6">
          <div class="flex gap-2 mb-4">
            <button (click)="activeTab = 'active'; loadStudents()"
              [class]="activeTab === 'active' ? 'px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium' : 'px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-50'">
              Aktif ({{activeCount}})
            </button>
            <button (click)="activeTab = 'alumni'; loadStudents()"
              [class]="activeTab === 'alumni' ? 'px-4 py-2 rounded-lg bg-slate-600 text-white text-sm font-medium' : 'px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-50'">
              Alumni ({{alumniCount}})
            </button>
          </div>

          <div *ngIf="students.length > 0" class="space-y-3">
            <div *ngFor="let s of students" class="border rounded-xl p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-slate-900 truncate">{{s.name}}</p>
                  <span [class]="s.gender === 'female' ? 'text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full' : 'text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full'">
                    {{s.gender === 'female' ? 'Perempuan' : 'Laki-laki'}}
                  </span>
                </div>
                <p class="text-sm text-slate-500 mt-0.5">{{s.whatsapp}} {{s.meeting_point ? '· ' + s.meeting_point : ''}}</p>
                <div class="mt-1 flex items-center gap-3">
                  <span class="text-xs text-slate-600">Total: <strong>{{s.total_quota_hours}} jam</strong></span>
                  <span class="text-xs" [class.text-red-600]="s.remaining_quota_hours <= 0" [class.text-emerald-700]="s.remaining_quota_hours > 0">
                    Sisa: <strong>{{s.remaining_quota_hours}} jam</strong>
                  </span>
                </div>
              </div>
              <button (click)="openDetail(s)" class="px-3 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium hover:bg-cyan-100 whitespace-nowrap">
                Lihat Detail
              </button>
            </div>
          </div>

          <div *ngIf="students.length === 0" class="text-center py-10 text-slate-400">
            <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Belum ada murid {{activeTab === 'active' ? 'aktif' : 'alumni'}}
          </div>
        </div>

        <!-- Detail View -->
        <ng-container *ngIf="detailStudent">
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center gap-3 mb-6">
              <button (click)="detailStudent = null" class="text-cyan-600 hover:text-cyan-800 flex items-center gap-1 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                Kembali
              </button>
              <h2 class="text-xl font-bold text-slate-900">{{detailStudent.name}}</h2>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-slate-50 rounded-xl p-3">
                <p class="text-xs text-slate-500">WhatsApp</p>
                <p class="font-semibold text-slate-800 text-sm mt-0.5">{{detailStudent.whatsapp}}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-3">
                <p class="text-xs text-slate-500">Gender</p>
                <p class="font-semibold text-slate-800 text-sm mt-0.5">{{detailStudent.gender === 'female' ? 'Perempuan' : 'Laki-laki'}}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-3">
                <p class="text-xs text-slate-500">Total Kuota</p>
                <p class="font-semibold text-slate-800 text-sm mt-0.5">{{detailStudent.total_quota_hours}} jam</p>
              </div>

              <div class="bg-slate-50 rounded-xl p-3">
                <p class="text-xs text-slate-500">Sisa Kuota</p>
                <p class="font-semibold text-sm mt-0.5" [class.text-red-600]="detailStudent.remaining_quota_hours <= 0" [class.text-emerald-700]="detailStudent.remaining_quota_hours > 0">
                  {{detailStudent.remaining_quota_hours}} jam
                </p>
              </div>
            </div>

            <!-- Session History -->
            <h3 class="text-lg font-semibold text-slate-800 mb-3">Riwayat Sesi</h3>
            <div *ngIf="sessionLoading" class="text-slate-400 text-sm py-4">Memuat...</div>
            <div *ngIf="!sessionLoading && sessions.length > 0" class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-slate-600 text-xs uppercase">
                  <tr>
                    <th class="px-3 py-2 text-left">Tanggal</th>
                    <th class="px-3 py-2 text-left">Masuk</th>
                    <th class="px-3 py-2 text-left">Keluar</th>
                    <th class="px-3 py-2 text-right">Jam Terpakai</th>
                    <th class="px-3 py-2 text-left">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let sess of sessions" class="border-t">
                    <td class="px-3 py-2">{{formatDate(sess.check_in_time)}}</td>
                    <td class="px-3 py-2">{{formatTime(sess.check_in_time)}}</td>
                    <td class="px-3 py-2">{{sess.check_out_time ? formatTime(sess.check_out_time) : '—'}}</td>
                    <td class="px-3 py-2 text-right">{{sess.check_out_time ? sess.deducted_hours + ' jam' : 'Aktif'}}</td>
                    <td class="px-3 py-2 text-slate-500 text-xs">{{sess.notes || '—'}}</td>
                  </tr>
                </tbody>
              </table>
              <p class="text-xs text-slate-500 mt-2 text-right">Total: {{totalSessions}} sesi · {{totalHours}} jam terpakai</p>
            </div>
            <div *ngIf="!sessionLoading && sessions.length === 0" class="text-slate-400 text-sm py-4">Belum ada riwayat sesi</div>
          </div>
        </ng-container>

      </div>
    </div>
  `
})
export class StudentManagementComponent implements OnInit {
  students: any[] = [];
  activeCount = 0;
  alumniCount = 0;
  activeTab: 'active' | 'alumni' = 'active';

  detailStudent: any = null;

  sessions: any[] = [];
  totalSessions = 0;
  totalHours = 0;
  sessionLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAllCounts();
    this.loadStudents();
  }

  loadAllCounts() {
    this.apiService.getInstructorStudents('true').subscribe({
      next: (r: any) => this.activeCount = (r.data || []).length,
      error: () => {}
    });
    this.apiService.getInstructorStudents('false').subscribe({
      next: (r: any) => this.alumniCount = (r.data || []).length,
      error: () => {}
    });
  }

  loadStudents() {
    const filter = this.activeTab === 'active' ? 'true' : 'false';
    this.apiService.getInstructorStudents(filter).subscribe({
      next: (r: any) => this.students = r.data || [],
      error: () => {}
    });
  }

  openDetail(s: any) {
    this.detailStudent = s;
    this.sessions = [];
    this.sessionLoading = true;
    this.apiService.getStudentSessions(s.id).subscribe({
      next: (r: any) => {
        this.sessions = r.data || [];
        this.totalSessions = r.total_sessions || 0;
        this.totalHours = r.total_hours || 0;
        this.sessionLoading = false;
      },
      error: () => this.sessionLoading = false
    });
  }

  formatDate(d: string): string {
    if (!d) return '';
    const dt = new Date(d);
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return `${days[dt.getDay()]}, ${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
  }

  formatTime(d: string): string {
    if (!d) return '';
    const dt = new Date(d);
    return `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
  }
}
