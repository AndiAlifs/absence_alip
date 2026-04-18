import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-instructors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div class="max-w-6xl mx-auto">

        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
          <div>
            <button (click)="goBack()" class="text-blue-600 hover:text-blue-800 text-sm mb-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Kembali ke Dashboard
            </button>
            <h1 class="text-3xl font-bold text-gray-900">Beban Instruktur</h1>
            <p class="text-gray-600 mt-1">Ringkasan beban kerja setiap instruktur bulan ini</p>
          </div>
          <button (click)="downloadRoster()" [disabled]="downloading"
            class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow flex items-center gap-2 disabled:opacity-60">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {{downloading ? 'Mengunduh...' : 'Export Roster Excel'}}
          </button>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl shadow p-4">
            <p class="text-xs text-gray-500 mb-1">Total Instruktur</p>
            <p class="text-2xl font-bold text-blue-700">{{loadData.length}}</p>
          </div>
          <div class="bg-white rounded-xl shadow p-4">
            <p class="text-xs text-gray-500 mb-1">Total Murid Aktif</p>
            <p class="text-2xl font-bold text-green-700">{{totalActiveStudents}}</p>
          </div>
          <div class="bg-white rounded-xl shadow p-4">
            <p class="text-xs text-gray-500 mb-1">Total Jam Terdaftar</p>
            <p class="text-2xl font-bold text-purple-700">{{totalQuota}} jam</p>
          </div>
          <div class="bg-white rounded-xl shadow p-4">
            <p class="text-xs text-gray-500 mb-1">Sesi Bulan Ini</p>
            <p class="text-2xl font-bold text-orange-700">{{totalSessions}}</p>
          </div>
        </div>

        <!-- Load Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Instruktur</th>
                <th class="px-4 py-3 text-right">Murid Aktif</th>
                <th class="px-4 py-3 text-right">Total Jam</th>
                <th class="px-4 py-3 text-right">Sisa Jam</th>
                <th class="px-4 py-3 text-right">Terpakai</th>
                <th class="px-4 py-3 text-right">Sesi Bulan Ini</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of loadData" class="border-t hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="font-medium">{{row.full_name || row.username}}</div>
                  <div class="text-xs text-gray-400">@{{row.username}}</div>
                </td>
                <td class="px-4 py-3 text-right font-semibold">{{row.active_students}}</td>
                <td class="px-4 py-3 text-right">{{row.total_quota_hours}} jam</td>
                <td class="px-4 py-3 text-right" [class.text-red-600]="row.remaining_quota_hours <= 0">{{row.remaining_quota_hours}} jam</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-500 rounded-full h-2" [style.width]="usagePercent(row) + '%'"></div>
                    </div>
                    <span class="text-xs text-gray-500">{{usagePercent(row)}}%</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">{{row.sessions_this_month}}</td>
              </tr>
              <tr *ngIf="loadData.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-400">
                  {{loading ? 'Memuat...' : 'Belum ada data instruktur'}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Success toast -->
        <div *ngIf="successMsg" class="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          {{successMsg}}
        </div>

      </div>
    </div>
  `
})
export class AdminInstructorsComponent implements OnInit {
  loadData: any[] = [];
  loading = true;
  downloading = false;
  successMsg = '';

  get totalActiveStudents(): number { return this.loadData.reduce((a, r) => a + r.active_students, 0); }
  get totalQuota(): number { return Math.round(this.loadData.reduce((a, r) => a + r.total_quota_hours, 0) * 100) / 100; }
  get totalSessions(): number { return this.loadData.reduce((a, r) => a + r.sessions_this_month, 0); }

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.adminGetInstructorLoad().subscribe({
      next: (r: any) => { this.loadData = r.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  usagePercent(row: any): number {
    if (!row.total_quota_hours) return 0;
    const used = row.total_quota_hours - row.remaining_quota_hours;
    return Math.min(100, Math.round((used / row.total_quota_hours) * 100));
  }

  downloadRoster() {
    this.downloading = true;
    this.api.adminDownloadStudentRoster().subscribe({
      next: (blob: Blob) => {
        this.downloading = false;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student-roster-${new Date().toISOString().substring(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        this.successMsg = 'Roster berhasil diunduh';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.downloading = false;
        alert('Gagal mengunduh roster');
      }
    });
  }

  goBack() { this.router.navigate(['/admin']); }
}
