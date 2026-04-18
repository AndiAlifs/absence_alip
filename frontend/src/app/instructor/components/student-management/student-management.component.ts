import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-student-management',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-100 py-8 px-4">
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h1 class="text-3xl font-bold text-slate-900">Manajemen Murid</h1>
          <p class="text-slate-600 mt-1">Tambah, kelola, dan pantau perkembangan setiap murid secara komprehensif.</p>
        </div>

        <!-- Add Student Form -->
        <div class="bg-white rounded-2xl shadow-xl p-6" *ngIf="!detailStudent">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Tambah Murid Baru</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input [(ngModel)]="newStudent.name" placeholder="Nama murid *" class="border border-slate-300 rounded-lg px-3 py-2" />
            <input [(ngModel)]="newStudent.whatsapp" placeholder="WhatsApp (cth: 081234567890) *" class="border border-slate-300 rounded-lg px-3 py-2" />
            <select [(ngModel)]="newStudent.gender" class="border border-slate-300 rounded-lg px-3 py-2">
              <option value="">Pilih Gender *</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
            <input [(ngModel)]="newStudent.meeting_point" placeholder="Titik Jemput (opsional)" class="border border-slate-300 rounded-lg px-3 py-2" />
          </div>

          <!-- Quota Presets -->
          <div class="mt-4">
            <label class="text-sm font-medium text-slate-700 block mb-2">Kuota Jam Belajar *</label>
            <div class="flex gap-2 flex-wrap items-center">
              <button *ngFor="let preset of quotaPresets" (click)="newStudent.total_quota_hours = preset"
                class="px-4 py-2 rounded-lg border-2 transition-all"
                [class.border-cyan-600]="newStudent.total_quota_hours === preset"
                [class.bg-cyan-50]="newStudent.total_quota_hours === preset"
                [class.text-cyan-700]="newStudent.total_quota_hours === preset"
                [class.border-slate-300]="newStudent.total_quota_hours !== preset"
                [class.text-slate-600]="newStudent.total_quota_hours !== preset">
                {{ preset }} jam
              </button>
              <input [(ngModel)]="newStudent.total_quota_hours" type="number" min="0.5" step="0.5"
                placeholder="Custom"
                class="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <!-- Optional Initial Schedule -->
          <div class="mt-4">
            <label class="text-sm font-medium text-slate-700 block mb-2">Jadwal Sesi Pertama (opsional)</label>

            <!-- Schedule Mode Tabs -->
            <div class="flex gap-2 mb-3">
              <button type="button" (click)="initScheduleMode = 'none'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all"
                [class.border-slate-400]="initScheduleMode === 'none'" [class.bg-slate-100]="initScheduleMode === 'none'" [class.text-slate-800]="initScheduleMode === 'none'"
                [class.border-slate-200]="initScheduleMode !== 'none'" [class.bg-white]="initScheduleMode !== 'none'" [class.text-slate-500]="initScheduleMode !== 'none'">Lewati</button>
              <button type="button" (click)="initScheduleMode = 'single'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all"
                [class.border-cyan-500]="initScheduleMode === 'single'" [class.bg-cyan-50]="initScheduleMode === 'single'" [class.text-cyan-700]="initScheduleMode === 'single'"
                [class.border-slate-200]="initScheduleMode !== 'single'" [class.bg-white]="initScheduleMode !== 'single'" [class.text-slate-500]="initScheduleMode !== 'single'">✏️ Satu Sesi</button>
              <button type="button" (click)="initScheduleMode = 'recurring'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all"
                [class.border-indigo-500]="initScheduleMode === 'recurring'" [class.bg-indigo-50]="initScheduleMode === 'recurring'" [class.text-indigo-700]="initScheduleMode === 'recurring'"
                [class.border-slate-200]="initScheduleMode !== 'recurring'" [class.bg-white]="initScheduleMode !== 'recurring'" [class.text-slate-500]="initScheduleMode !== 'recurring'">🔁 Sampai Kuota Habis</button>
            </div>

            <!-- Single Session -->
            <div *ngIf="initScheduleMode === 'single'" class="space-y-3 bg-slate-50 rounded-xl p-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-slate-500 block mb-1">Tanggal</label>
                  <input [(ngModel)]="newStudent.initial_schedule_date" type="date" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="text-xs text-slate-500 block mb-1">Jam Mulai</label>
                  <input [(ngModel)]="newStudent.initial_start_time" type="time" (ngModelChange)="calcSingleEndTime()" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-2">Durasi</label>
                <div class="flex flex-wrap gap-1.5 items-center">
                  <button *ngFor="let opt of initDurationOptions" type="button" (click)="setSingleDuration(opt.value)"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all"
                    [class.bg-cyan-600]="initSingleDuration === opt.value" [class.text-white]="initSingleDuration === opt.value" [class.border-cyan-600]="initSingleDuration === opt.value"
                    [class.bg-white]="initSingleDuration !== opt.value" [class.text-slate-600]="initSingleDuration !== opt.value" [class.border-slate-300]="initSingleDuration !== opt.value">
                    {{ opt.label }}
                  </button>
                  <span class="text-xs text-slate-500" *ngIf="newStudent.initial_end_time">→ Selesai: <strong>{{ newStudent.initial_end_time }}</strong></span>
                </div>
              </div>
            </div>

            <!-- Recurring Schedule -->
            <div *ngIf="initScheduleMode === 'recurring'" class="space-y-3 bg-slate-50 rounded-xl p-3">
              <div>
                <label class="text-xs text-slate-500 block mb-1">Hari dalam Seminggu</label>
                <div class="flex gap-2 flex-wrap">
                  <button *ngFor="let d of initDayNumbers; let i = index" type="button" (click)="toggleInitDay(d)"
                    class="w-10 h-10 rounded-xl text-xs font-semibold transition-all border-2"
                    [class.bg-indigo-600]="initSelectedDays.includes(d)" [class.text-white]="initSelectedDays.includes(d)" [class.border-indigo-600]="initSelectedDays.includes(d)"
                    [class.bg-white]="!initSelectedDays.includes(d)" [class.text-slate-600]="!initSelectedDays.includes(d)" [class.border-slate-300]="!initSelectedDays.includes(d)">
                    {{ initDayLabels[i] }}
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label class="text-xs text-slate-500 block mb-1">Jam Mulai</label>
                  <input [(ngModel)]="initRecurStartTime" type="time" (ngModelChange)="calcRecurEndTime()" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="text-xs text-slate-500 block mb-1">Dari Tanggal</label>
                  <input [(ngModel)]="initRecurFromDate" type="date" (ngModelChange)="calcInitPreview()" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="text-xs text-slate-500 block mb-1">Sampai Tanggal</label>
                  <input [(ngModel)]="initRecurToDate" type="date" (ngModelChange)="calcInitPreview()" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-2">Durasi per Sesi</label>
                <div class="flex flex-wrap gap-1.5 items-center">
                  <button *ngFor="let opt of initDurationOptions" type="button" (click)="setRecurDuration(opt.value)"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all"
                    [class.bg-indigo-600]="initRecurDuration === opt.value" [class.text-white]="initRecurDuration === opt.value" [class.border-indigo-600]="initRecurDuration === opt.value"
                    [class.bg-white]="initRecurDuration !== opt.value" [class.text-slate-600]="initRecurDuration !== opt.value" [class.border-slate-300]="initRecurDuration !== opt.value">
                    {{ opt.label }}
                  </button>
                  <span class="text-xs text-slate-500" *ngIf="initRecurEndTime">→ Selesai: <strong>{{ initRecurEndTime }}</strong></span>
                </div>
              </div>
              <!-- Preview -->
              <div *ngIf="initPreviewCount > 0" class="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 flex items-center gap-3">
                <span class="text-xl font-bold text-indigo-700">{{ initPreviewCount }}</span>
                <p class="text-xs text-indigo-700">sesi akan dibuat setelah murid tersimpan</p>
              </div>
            </div>
          </div>

          <button (click)="createStudent()" [disabled]="isSubmitting" class="mt-4 px-6 py-2.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-slate-400 transition-all">
            {{ isSubmitting ? 'Menyimpan...' : 'Tambah Murid' }}
          </button>
        </div>

        <!-- Student Detail View -->
        <div *ngIf="detailStudent" class="space-y-6">
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-slate-900">Detail Murid</h2>
              <button (click)="closeDetail()" class="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all">← Kembali</button>
            </div>

            <!-- Edit Form -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-slate-500 block mb-1">Nama</label>
                <input [(ngModel)]="editForm.name" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-1">WhatsApp</label>
                <div class="flex gap-2">
                  <input [(ngModel)]="editForm.whatsapp" class="flex-1 border border-slate-300 rounded-lg px-3 py-2" />
                  <a [href]="getWhatsAppLink(editForm.whatsapp)" target="_blank" class="px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all text-sm flex items-center">
                    <svg class="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.98 3.8 13.46 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8.01 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 13.98C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.6C10.27 9.48 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9.01 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z"/></svg>
                    Chat
                  </a>
                </div>
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-1">Gender</label>
                <select [(ngModel)]="editForm.gender" class="w-full border border-slate-300 rounded-lg px-3 py-2">
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-1">Titik Jemput</label>
                <input [(ngModel)]="editForm.meeting_point" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
              </div>
            </div>
            <div class="flex gap-2 mt-4">
              <button (click)="saveStudentEdit()" [disabled]="isDetailActionPending" class="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-slate-400 transition-all">{{ isDetailActionPending ? 'Menyimpan...' : 'Simpan Perubahan' }}</button>
            </div>
            <div *ngIf="detailMessage" class="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-lg text-green-800 text-sm">{{ detailMessage }}</div>
            <div *ngIf="detailError" class="mt-3 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-red-800 text-sm">{{ detailError }}</div>

            <!-- Quota Info -->
            <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-cyan-50 rounded-lg p-3">
                <p class="text-xs text-slate-500">Kuota Total</p>
                <p class="text-lg font-bold text-cyan-700">{{ detailStudent.total_quota_hours }} jam</p>
              </div>
              <div class="bg-emerald-50 rounded-lg p-3">
                <p class="text-xs text-slate-500">Sisa Kuota</p>
                <p class="text-lg font-bold text-emerald-700">{{ detailStudent.remaining_quota_hours }} jam</p>
              </div>
              <div class="bg-amber-50 rounded-lg p-3">
                <p class="text-xs text-slate-500">Total Sesi</p>
                <p class="text-lg font-bold text-amber-700">{{ detailTotalSessions }}</p>
              </div>
              <div class="bg-purple-50 rounded-lg p-3">
                <p class="text-xs text-slate-500">Total Jam Dipakai</p>
                <p class="text-lg font-bold text-purple-700">{{ detailTotalHours }} jam</p>
              </div>
            </div>
          </div>

          <!-- Session History for this student -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Riwayat Sesi</h3>
            <div class="overflow-x-auto" *ngIf="detailSessions.length > 0">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Tanggal</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Check-In</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Check-Out</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Durasi</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Catatan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr *ngFor="let sess of detailSessions">
                    <td class="px-4 py-3 text-sm text-slate-800">{{ sess.check_in_time | date:'dd/MM/yyyy' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-800">{{ sess.check_in_time | date:'HH:mm' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-800">{{ sess.check_out_time ? (sess.check_out_time | date:'HH:mm') : 'Berlangsung' }}</td>
                    <td class="px-4 py-3 text-sm font-semibold text-emerald-700">{{ sess.deducted_hours ? sess.deducted_hours.toFixed(2) + ' jam' : '-' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-600">{{ sess.notes || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p *ngIf="detailSessions.length === 0" class="text-slate-500">Belum ada riwayat sesi.</p>
          </div>

          <!-- Schedule for this student -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-900">Jadwal Belajar</h3>
              <button (click)="showAddSchedule = !showAddSchedule" class="px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-all text-sm">
                {{ showAddSchedule ? 'Batal' : '+ Tambah Jadwal' }}
              </button>
            </div>

            <!-- Add Schedule inline -->
            <div *ngIf="showAddSchedule" class="bg-sky-50 rounded-xl p-4 mb-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input [(ngModel)]="newSchedule.scheduled_date" type="date" class="border border-slate-300 rounded-lg px-3 py-2" />
                <input [(ngModel)]="newSchedule.start_time" type="time" class="border border-slate-300 rounded-lg px-3 py-2" />
                <input [(ngModel)]="newSchedule.end_time" type="time" class="border border-slate-300 rounded-lg px-3 py-2" />
                <button (click)="addScheduleForStudent()" [disabled]="isDetailActionPending" class="rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-400 transition-all">{{ isDetailActionPending ? 'Menyimpan...' : 'Simpan' }}</button>
              </div>
            </div>

            <div class="overflow-x-auto" *ngIf="detailSchedules.length > 0">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Tanggal</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Jam</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr *ngFor="let sch of detailSchedules">
                    <td class="px-4 py-3 text-sm text-slate-800">{{ sch.scheduled_date | date:'dd/MM/yyyy' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-800">{{ sch.start_time }} - {{ sch.end_time }}</td>
                    <td class="px-4 py-3 text-sm">
                      <span class="px-2 py-1 rounded-full text-xs"
                        [class.bg-blue-100]="sch.status === 'planned'"
                        [class.text-blue-800]="sch.status === 'planned'"
                        [class.bg-green-100]="sch.status === 'completed'"
                        [class.text-green-800]="sch.status === 'completed'"
                        [class.bg-red-100]="sch.status === 'cancelled'"
                        [class.text-red-800]="sch.status === 'cancelled'">
                        {{ sch.status === 'planned' ? 'Direncanakan' : sch.status === 'completed' ? 'Selesai' : 'Dibatalkan' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1">
                        <button *ngIf="sch.status === 'planned'" (click)="cancelSchedule(sch)" [disabled]="isDetailActionPending" class="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 text-xs transition-all">Batalkan</button>
                        <button (click)="deleteSchedule(sch)" [disabled]="isDetailActionPending" class="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 text-xs transition-all">Hapus</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p *ngIf="detailSchedules.length === 0" class="text-slate-500">Belum ada jadwal.</p>
          </div>
        </div>

        <!-- Student List (when detail is not open) -->
        <div class="bg-white rounded-2xl shadow-xl p-6" *ngIf="!detailStudent">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-slate-900">Daftar Murid</h2>
            <div class="flex gap-2">
              <button (click)="activeTab = 'active'; loadStudents()" class="px-4 py-2 rounded-lg text-sm transition-all"
                [class.bg-cyan-600]="activeTab === 'active'" [class.text-white]="activeTab === 'active'"
                [class.bg-slate-100]="activeTab !== 'active'" [class.text-slate-700]="activeTab !== 'active'">
                Aktif ({{ activeCount }})
              </button>
              <button (click)="activeTab = 'past'; loadStudents()" class="px-4 py-2 rounded-lg text-sm transition-all"
                [class.bg-slate-600]="activeTab === 'past'" [class.text-white]="activeTab === 'past'"
                [class.bg-slate-100]="activeTab !== 'past'" [class.text-slate-700]="activeTab !== 'past'">
                Alumni ({{ pastCount }})
              </button>
            </div>
          </div>

          <div class="overflow-x-auto" *ngIf="filteredStudents.length > 0">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Nama</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">WhatsApp</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Gender</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Kuota</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Sisa</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Titik Jemput</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr *ngFor="let s of filteredStudents">
                  <td class="px-4 py-3 text-sm text-slate-800 font-medium">{{ s.name }}</td>
                  <td class="px-4 py-3 text-sm">
                    <a [href]="getWhatsAppLink(s.whatsapp)" target="_blank" class="text-green-700 hover:underline">{{ s.whatsapp || '-' }}</a>
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-800">{{ s.gender === 'male' ? 'L' : 'P' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-800">{{ s.total_quota_hours }} jam</td>
                  <td class="px-4 py-3 text-sm font-semibold" [class.text-emerald-700]="s.remaining_quota_hours > 0" [class.text-red-600]="s.remaining_quota_hours <= 0">
                    {{ s.remaining_quota_hours }} jam
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ s.meeting_point || '-' }}</td>
                  <td class="px-4 py-3">
                    <div class="flex gap-1 flex-wrap">
                      <button (click)="openDetail(s)" class="px-2 py-1 rounded bg-cyan-100 text-cyan-700 hover:bg-cyan-200 text-xs transition-all">Detail</button>
                      <button (click)="adjustQuota(s)" class="px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs transition-all">Kuota</button>
                      <button (click)="toggleArchive(s)" class="px-2 py-1 rounded text-xs transition-all"
                        [class.bg-red-100]="s.is_active" [class.text-red-700]="s.is_active" [class.hover:bg-red-200]="s.is_active"
                        [class.bg-green-100]="!s.is_active" [class.text-green-700]="!s.is_active" [class.hover:bg-green-200]="!s.is_active">
                        {{ s.is_active ? 'Arsipkan' : 'Aktifkan' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p *ngIf="filteredStudents.length === 0" class="text-slate-500">
            {{ activeTab === 'active' ? 'Belum ada murid aktif.' : 'Belum ada alumni.' }}
          </p>
        </div>

        <div *ngIf="message" class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg text-green-800">{{ message }}</div>
        <div *ngIf="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-800">{{ error }}</div>
      </div>
    </div>
  `,
  styles: []
})
export class StudentManagementComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  activeTab: 'active' | 'past' = 'active';
  activeCount = 0;
  pastCount = 0;
  isSubmitting = false;
  message = '';
  error = '';
  quotaPresets: number[] = [8, 10];

  // Initial schedule mode
  initScheduleMode: 'none' | 'single' | 'recurring' = 'none';
  initDayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  initDayNumbers = [1, 2, 3, 4, 5, 6, 7];
  initSelectedDays: number[] = [];
  initDurationOptions = [
    { label: '30 menit', value: 30 },
    { label: '1 jam',    value: 60 },
    { label: '1 j 30 m', value: 90 },
    { label: '2 jam',    value: 120 },
    { label: '2 j 30 m', value: 150 },
    { label: '3 jam',    value: 180 },
  ];
  initSingleDuration = 60;
  initRecurDuration = 60;
  initRecurStartTime = '09:00';
  initRecurEndTime = '10:00';
  initRecurFromDate = '';
  initRecurToDate = '';
  initPreviewCount = 0;

  newStudent: any = {
    name: '',
    whatsapp: '',
    gender: '',
    meeting_point: '',
    total_quota_hours: 8,
    initial_schedule_date: '',
    initial_start_time: '09:00',
    initial_end_time: '10:00'
  };

  // Detail view
  detailStudent: any = null;
  detailSessions: any[] = [];
  detailSchedules: any[] = [];
  detailTotalSessions = 0;
  detailTotalHours = 0;
  editForm: any = {};
  showAddSchedule = false;
  newSchedule = { scheduled_date: '', start_time: '09:00', end_time: '11:00' };
  isDetailActionPending = false;
  detailMessage = '';
  detailError = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadQuotaPresets();
    const today = new Date();
    this.initRecurFromDate = this.fmtDate(today);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.initRecurToDate = this.fmtDate(nextMonth);
    this.calcSingleEndTime();
    this.calcRecurEndTime();
  }

  loadQuotaPresets(): void {
    this.apiService.getQuotaPresets().subscribe({
      next: (res) => {
        if (res.presets && res.presets.length > 0) {
          this.quotaPresets = res.presets.map((p: string) => Number(p)).filter((n: number) => n > 0);
          if (this.quotaPresets.length > 0) {
            this.newStudent.total_quota_hours = this.quotaPresets[0];
          }
        }
      }
    });
  }

  loadStudents(): void {
    this.apiService.getInstructorStudents().subscribe({
      next: (res) => {
        this.students = res.data || [];
        this.activeCount = this.students.filter((s: any) => s.is_active).length;
        this.pastCount = this.students.filter((s: any) => !s.is_active).length;
        this.applyFilter();
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal mengambil data murid';
      }
    });
  }

  applyFilter(): void {
    this.filteredStudents = this.students.filter((s: any) =>
      this.activeTab === 'active' ? s.is_active : !s.is_active
    );
  }

  createStudent(): void {
    if (!this.newStudent.name || !this.newStudent.whatsapp || !this.newStudent.gender || this.newStudent.total_quota_hours <= 0) {
      this.error = 'Nama, WhatsApp, Gender, dan Kuota harus diisi';
      return;
    }
    if (this.initScheduleMode === 'recurring' && this.initSelectedDays.length === 0) {
      this.error = 'Pilih minimal satu hari untuk jadwal berulang';
      return;
    }
    if (this.initScheduleMode === 'recurring' && this.initRecurToDate && this.initRecurFromDate && this.initRecurToDate < this.initRecurFromDate) {
      this.error = '"Sampai Tanggal" tidak boleh lebih awal dari "Dari Tanggal"';
      return;
    }

    this.error = '';
    this.message = '';
    this.isSubmitting = true;

    // For single mode, pass the initial schedule fields; for recurring/none, clear them
    const payload = { ...this.newStudent };
    if (this.initScheduleMode !== 'single') {
      payload.initial_schedule_date = '';
      payload.initial_start_time = '';
      payload.initial_end_time = '';
    }

    this.apiService.createStudent(payload).subscribe({
      next: (res) => {
        const studentId = res.data?.id;
        if (this.initScheduleMode === 'recurring' && studentId) {
          this.apiService.bulkCreateLearningPlans({
            student_id: studentId,
            days_of_week: [...this.initSelectedDays].sort(),
            start_time: this.initRecurStartTime,
            end_time: this.initRecurEndTime,
            from_date: this.initRecurFromDate,
            to_date: this.initRecurToDate,
            force: true
          }).subscribe({
            next: (bulkRes) => {
              this.message = (res.message || 'Murid berhasil dibuat') + ` · ${bulkRes.created} jadwal dibuat`;
            },
            error: () => {
              this.message = (res.message || 'Murid berhasil dibuat') + ' (jadwal berulang gagal dibuat)';
            }
          });
        } else {
          this.message = res.message || 'Murid berhasil dibuat';
        }
        this.resetNewStudentForm();
        this.loadStudents();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal membuat murid';
        this.isSubmitting = false;
      }
    });
  }

  private resetNewStudentForm(): void {
    this.newStudent = {
      name: '', whatsapp: '', gender: '', meeting_point: '',
      total_quota_hours: this.quotaPresets[0] || 8,
      initial_schedule_date: '', initial_start_time: '09:00', initial_end_time: '10:00'
    };
    this.initScheduleMode = 'none';
    this.initSelectedDays = [];
    this.initPreviewCount = 0;
  }

  // ===== Init Schedule Helpers =====

  setSingleDuration(mins: number): void {
    this.initSingleDuration = mins;
    this.calcSingleEndTime();
  }

  calcSingleEndTime(): void {
    const [h, m] = this.newStudent.initial_start_time.split(':').map(Number);
    const total = h * 60 + m + this.initSingleDuration;
    this.newStudent.initial_end_time =
      `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  }

  setRecurDuration(mins: number): void {
    this.initRecurDuration = mins;
    this.calcRecurEndTime();
  }

  calcRecurEndTime(): void {
    const [h, m] = this.initRecurStartTime.split(':').map(Number);
    const total = h * 60 + m + this.initRecurDuration;
    this.initRecurEndTime =
      `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  }

  toggleInitDay(d: number): void {
    const idx = this.initSelectedDays.indexOf(d);
    if (idx >= 0) this.initSelectedDays.splice(idx, 1);
    else this.initSelectedDays.push(d);
    this.calcInitPreview();
  }

  calcInitPreview(): void {
    if (!this.initRecurFromDate || !this.initRecurToDate || this.initSelectedDays.length === 0) {
      this.initPreviewCount = 0;
      return;
    }
    const from = new Date(this.initRecurFromDate);
    const to = new Date(this.initRecurToDate);
    if (to < from) { this.initPreviewCount = 0; return; }
    const daySet = new Set(this.initSelectedDays);
    let count = 0;
    const cur = new Date(from);
    while (cur <= to) {
      const gd = cur.getDay();
      if (daySet.has(gd === 0 ? 7 : gd)) count++;
      cur.setDate(cur.getDate() + 1);
    }
    this.initPreviewCount = count;
  }

  private fmtDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  adjustQuota(student: any): void {
    const current = Number(student.remaining_quota_hours || 0);
    const input = window.prompt(`Sisa kuota baru untuk ${student.name} (jam):`, String(current));
    if (input === null) return;

    const parsed = Number(input);
    if (Number.isNaN(parsed) || parsed < 0) {
      this.error = 'Nilai kuota tidak valid';
      return;
    }

    this.error = '';
    this.message = '';
    this.apiService.adjustStudentQuota(student.id, parsed).subscribe({
      next: (res) => {
        this.message = res.message || 'Kuota murid berhasil diperbarui';
        this.loadStudents();
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal memperbarui kuota';
      }
    });
  }

  toggleArchive(student: any): void {
    const action = student.is_active ? 'mengarsipkan' : 'mengaktifkan kembali';
    if (!confirm(`Yakin ingin ${action} ${student.name}?`)) return;

    this.apiService.archiveStudent(student.id).subscribe({
      next: (res) => {
        this.message = res.message || 'Status murid berhasil diubah';
        this.loadStudents();
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal mengubah status murid';
      }
    });
  }

  // ============ Detail View ============

  openDetail(student: any): void {
    this.detailStudent = student;
    this.editForm = {
      name: student.name,
      whatsapp: student.whatsapp,
      gender: student.gender,
      meeting_point: student.meeting_point || ''
    };
    this.showAddSchedule = false;
    this.loadStudentSessions(student.id);
    this.loadStudentSchedules(student.id);
  }

  closeDetail(): void {
    this.detailStudent = null;
    this.detailSessions = [];
    this.detailSchedules = [];
    this.detailMessage = '';
    this.detailError = '';
    this.isDetailActionPending = false;
  }

  saveStudentEdit(): void {
    if (this.isDetailActionPending) return;
    this.isDetailActionPending = true;
    this.detailError = '';
    this.detailMessage = '';
    this.apiService.updateStudent(this.detailStudent.id, this.editForm).subscribe({
      next: (res) => {
        this.detailMessage = res.message || 'Data murid berhasil diperbarui';
        this.detailStudent = res.data;
        this.isDetailActionPending = false;
        this.loadStudents();
      },
      error: (err) => {
        this.detailError = err.error?.error || 'Gagal memperbarui data murid';
        this.isDetailActionPending = false;
      }
    });
  }

  loadStudentSessions(studentId: number): void {
    this.apiService.getStudentSessions(studentId).subscribe({
      next: (res) => {
        this.detailSessions = res.data || [];
        this.detailTotalSessions = res.total_sessions || 0;
        this.detailTotalHours = res.total_hours || 0;
      }
    });
  }

  loadStudentSchedules(studentId: number): void {
    const now = new Date();
    const from = new Date(now);
    from.setMonth(from.getMonth() - 6);
    const to = new Date(now);
    to.setMonth(to.getMonth() + 6);
    this.apiService.getLearningPlans('month', this.fmtDate(from), this.fmtDate(to)).subscribe({
      next: (res) => {
        const allPlans = res.data || [];
        this.detailSchedules = allPlans.filter((p: any) => p.student_id === studentId);
      }
    });
  }

  addScheduleForStudent(): void {
    if (!this.newSchedule.scheduled_date || !this.newSchedule.start_time || !this.newSchedule.end_time) {
      this.detailError = 'Lengkapi semua field jadwal';
      return;
    }
    if (this.isDetailActionPending) return;
    this.isDetailActionPending = true;
    this.detailError = '';
    this.detailMessage = '';
    this.apiService.createLearningPlan({
      student_id: this.detailStudent.id,
      scheduled_date: this.newSchedule.scheduled_date,
      start_time: this.newSchedule.start_time,
      end_time: this.newSchedule.end_time
    }).subscribe({
      next: (res) => {
        this.detailMessage = res.message || 'Jadwal berhasil dibuat';
        this.newSchedule = { scheduled_date: '', start_time: '09:00', end_time: '11:00' };
        this.showAddSchedule = false;
        this.isDetailActionPending = false;
        this.loadStudentSchedules(this.detailStudent.id);
      },
      error: (err) => {
        this.detailError = err.error?.error || 'Gagal membuat jadwal';
        this.isDetailActionPending = false;
      }
    });
  }

  cancelSchedule(schedule: any): void {
    if (!confirm('Yakin ingin membatalkan jadwal ini?')) return;
    if (this.isDetailActionPending) return;
    this.isDetailActionPending = true;
    this.detailError = '';
    this.detailMessage = '';
    this.apiService.updateLearningPlan(schedule.id, { status: 'cancelled' }).subscribe({
      next: () => {
        this.detailMessage = 'Jadwal berhasil dibatalkan';
        this.isDetailActionPending = false;
        this.loadStudentSchedules(this.detailStudent.id);
      },
      error: (err) => {
        this.detailError = err.error?.error || 'Gagal membatalkan jadwal';
        this.isDetailActionPending = false;
      }
    });
  }

  deleteSchedule(schedule: any): void {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
    if (this.isDetailActionPending) return;
    this.isDetailActionPending = true;
    this.detailError = '';
    this.detailMessage = '';
    this.apiService.deleteLearningPlan(schedule.id).subscribe({
      next: () => {
        this.detailMessage = 'Jadwal berhasil dihapus';
        this.isDetailActionPending = false;
        this.loadStudentSchedules(this.detailStudent.id);
      },
      error: (err) => {
        this.detailError = err.error?.error || 'Gagal menghapus jadwal';
        this.isDetailActionPending = false;
      }
    });
  }

  // ============ Helpers ============

  getWhatsAppLink(phone: string): string {
    if (!phone) return '#';
    let normalized = phone.replace(/[^0-9]/g, '');
    if (normalized.startsWith('0')) {
      normalized = '62' + normalized.substring(1);
    }
    if (!normalized.startsWith('62')) {
      normalized = '62' + normalized;
    }
    return `https://wa.me/${normalized}`;
  }
}
