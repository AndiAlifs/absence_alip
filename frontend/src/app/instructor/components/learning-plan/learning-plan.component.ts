import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const DAY_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

@Component({
  selector: 'app-learning-plan',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 py-8 px-4">
      <div class="max-w-6xl mx-auto space-y-6">

        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h1 class="text-3xl font-bold text-slate-900">Jadwal Belajar</h1>
          <p class="text-slate-600 mt-1">Buat, jadwalkan ulang, dan kelola rencana belajar per murid.</p>
        </div>

        <!-- Input Mode Tabs -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="flex gap-2 mb-6">
            <button (click)="inputTab = 'manual'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              [class.bg-sky-600]="inputTab === 'manual'" [class.text-white]="inputTab === 'manual'"
              [class.bg-slate-100]="inputTab !== 'manual'" [class.text-slate-700]="inputTab !== 'manual'">
              ✏️ Input Manual
            </button>
            <button (click)="inputTab = 'recurring'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              [class.bg-indigo-600]="inputTab === 'recurring'" [class.text-white]="inputTab === 'recurring'"
              [class.bg-slate-100]="inputTab !== 'recurring'" [class.text-slate-700]="inputTab !== 'recurring'">
              🔁 Jadwal Berulang
            </button>
          </div>

          <!-- Manual Input -->
          <div *ngIf="inputTab === 'manual'">
            <h2 class="text-lg font-semibold text-slate-900 mb-3">Buat Jadwal Satu Sesi</h2>
            <div class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select [(ngModel)]="form.student_id" class="border border-slate-300 rounded-lg px-3 py-2">
                  <option [ngValue]="null">Pilih Murid</option>
                  <option *ngFor="let s of students" [ngValue]="s.id">{{ s.name }}</option>
                </select>
                <input [(ngModel)]="form.scheduled_date" type="date" class="border border-slate-300 rounded-lg px-3 py-2" />
                <input [(ngModel)]="form.start_time" type="time" (ngModelChange)="onManualStartTimeChange()" class="border border-slate-300 rounded-lg px-3 py-2" />
              </div>
              <!-- Duration mode toggle for manual -->
              <div class="flex items-center gap-4 flex-wrap">
                <div class="flex rounded-lg overflow-hidden border border-slate-300">
                  <button type="button" (click)="manualTimeMode = 'duration'; onManualStartTimeChange()"
                    class="px-3 py-1.5 text-xs font-medium transition-all"
                    [class.bg-sky-600]="manualTimeMode === 'duration'" [class.text-white]="manualTimeMode === 'duration'"
                    [class.bg-white]="manualTimeMode !== 'duration'" [class.text-slate-600]="manualTimeMode !== 'duration'">
                    ⏱ Durasi
                  </button>
                  <button type="button" (click)="manualTimeMode = 'explicit'"
                    class="px-3 py-1.5 text-xs font-medium transition-all border-l border-slate-300"
                    [class.bg-sky-600]="manualTimeMode === 'explicit'" [class.text-white]="manualTimeMode === 'explicit'"
                    [class.bg-white]="manualTimeMode !== 'explicit'" [class.text-slate-600]="manualTimeMode !== 'explicit'">
                    🕐 Eksplisit
                  </button>
                </div>
                <div *ngIf="manualTimeMode === 'duration'" class="flex flex-wrap gap-1.5">
                  <button *ngFor="let opt of durationOptions" type="button"
                    (click)="setManualDuration(opt.value)"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all"
                    [class.bg-sky-600]="manualDurationMinutes === opt.value"
                    [class.text-white]="manualDurationMinutes === opt.value"
                    [class.border-sky-600]="manualDurationMinutes === opt.value"
                    [class.bg-white]="manualDurationMinutes !== opt.value"
                    [class.text-slate-600]="manualDurationMinutes !== opt.value"
                    [class.border-slate-300]="manualDurationMinutes !== opt.value">
                    {{ opt.label }}
                  </button>
                  <span class="text-xs text-slate-500 self-center" *ngIf="form.end_time">→ Selesai: <strong>{{ form.end_time }}</strong></span>
                </div>
                <div *ngIf="manualTimeMode === 'explicit'">
                  <input [(ngModel)]="form.end_time" type="time" class="border border-slate-300 rounded-lg px-3 py-2" />
                </div>
              </div>
              <button (click)="createPlan()" [disabled]="isSubmitting" class="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-400 transition-all">
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Jadwal' }}
              </button>
            </div>
          </div>

          <!-- Recurring Input -->
          <div *ngIf="inputTab === 'recurring'">
            <h2 class="text-lg font-semibold text-slate-900 mb-3">Buat Jadwal Berulang</h2>
            <div class="space-y-4">

              <!-- Student -->
              <div>
                <label class="text-sm font-medium text-slate-700 block mb-1">Murid</label>
                <select [(ngModel)]="recurForm.student_id" class="border border-slate-300 rounded-lg px-3 py-2 w-full md:w-64">
                  <option [ngValue]="null">Pilih Murid</option>
                  <option *ngFor="let s of students" [ngValue]="s.id">{{ s.name }}</option>
                </select>
              </div>

              <!-- Days of week chips -->
              <div>
                <label class="text-sm font-medium text-slate-700 block mb-2">Hari</label>
                <div class="flex gap-2 flex-wrap">
                  <button *ngFor="let d of dayNumbers; let i = index"
                    (click)="toggleDay(d)"
                    class="w-12 h-12 rounded-xl text-sm font-semibold transition-all border-2"
                    [class.bg-indigo-600]="selectedDays.includes(d)"
                    [class.text-white]="selectedDays.includes(d)"
                    [class.border-indigo-600]="selectedDays.includes(d)"
                    [class.bg-white]="!selectedDays.includes(d)"
                    [class.text-slate-600]="!selectedDays.includes(d)"
                    [class.border-slate-300]="!selectedDays.includes(d)">
                    {{ dayLabels[i] }}
                  </button>
                </div>
                <p class="text-xs text-slate-500 mt-1" *ngIf="selectedDays.length === 0">Pilih minimal satu hari</p>
              </div>

              <!-- Time -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label class="text-sm font-medium text-slate-700 block mb-1">Jam Mulai</label>
                  <input [(ngModel)]="recurForm.start_time" type="time" (ngModelChange)="onStartTimeChange()" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>

                <!-- Duration mode toggle -->
                <div>
                  <label class="text-sm font-medium text-slate-700 block mb-1">Durasi / Jam Selesai</label>
                  <div class="flex rounded-lg overflow-hidden border border-slate-300">
                    <button type="button" (click)="timeMode = 'duration'; onStartTimeChange()"
                      class="flex-1 px-2 py-2 text-xs font-medium transition-all"
                      [class.bg-indigo-600]="timeMode === 'duration'" [class.text-white]="timeMode === 'duration'"
                      [class.bg-white]="timeMode !== 'duration'" [class.text-slate-600]="timeMode !== 'duration'">
                      ⏱ Durasi
                    </button>
                    <button type="button" (click)="timeMode = 'explicit'"
                      class="flex-1 px-2 py-2 text-xs font-medium transition-all border-l border-slate-300"
                      [class.bg-indigo-600]="timeMode === 'explicit'" [class.text-white]="timeMode === 'explicit'"
                      [class.bg-white]="timeMode !== 'explicit'" [class.text-slate-600]="timeMode !== 'explicit'">
                      🕐 Eksplisit
                    </button>
                  </div>
                </div>

                <!-- Duration chips or explicit end time -->
                <div class="md:col-span-2">
                  <div *ngIf="timeMode === 'duration'">
                    <label class="text-sm font-medium text-slate-700 block mb-1">Pilih Durasi</label>
                    <div class="flex flex-wrap gap-1.5">
                      <button *ngFor="let opt of durationOptions" type="button"
                        (click)="setDuration(opt.value)"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all"
                        [class.bg-indigo-600]="selectedDurationMinutes === opt.value"
                        [class.text-white]="selectedDurationMinutes === opt.value"
                        [class.border-indigo-600]="selectedDurationMinutes === opt.value"
                        [class.bg-white]="selectedDurationMinutes !== opt.value"
                        [class.text-slate-600]="selectedDurationMinutes !== opt.value"
                        [class.border-slate-300]="selectedDurationMinutes !== opt.value">
                        {{ opt.label }}
                      </button>
                    </div>
                    <p class="text-xs text-slate-500 mt-1" *ngIf="recurForm.end_time">Selesai: <strong>{{ recurForm.end_time }}</strong></p>
                  </div>
                  <div *ngIf="timeMode === 'explicit'">
                    <label class="text-sm font-medium text-slate-700 block mb-1">Jam Selesai</label>
                    <input [(ngModel)]="recurForm.end_time" type="time" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
              </div>

              <!-- Date range -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-sm font-medium text-slate-700 block mb-1">Dari Tanggal</label>
                  <input [(ngModel)]="recurForm.from_date" type="date" (ngModelChange)="calcPreview()" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="text-sm font-medium text-slate-700 block mb-1">Sampai Tanggal</label>
                  <input [(ngModel)]="recurForm.to_date" type="date" (ngModelChange)="calcPreview()" class="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
              </div>

              <!-- Preview -->
              <div *ngIf="previewCount >= 0" class="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <span class="text-2xl font-bold text-indigo-700">{{ previewCount }}</span>
                <div>
                  <p class="text-sm font-semibold text-indigo-800">sesi akan dibuat</p>
                  <p class="text-xs text-indigo-600" *ngIf="previewDates.length > 0">
                    Pertama: {{ previewDates[0] }} · Terakhir: {{ previewDates[previewDates.length - 1] }}
                  </p>
                </div>
              </div>

              <!-- Conflict warning panel -->
              <div *ngIf="conflictResult" class="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3">
                <div class="flex items-start gap-3">
                  <span class="text-xl">⚠️</span>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-amber-800">{{ conflictResult.conflicts.length }} jadwal bentrok dengan jadwal yang sudah ada</p>
                    <p class="text-xs text-amber-700 mt-0.5">{{ conflictResult.would_create }} sesi baru akan tetap dibuat, {{ conflictResult.conflicts.length }} sesi dilewati.</p>
                    <div class="mt-2 flex flex-wrap gap-1">
                      <span *ngFor="let d of conflictResult.conflicts.slice(0, 8)"
                        class="px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-xs">{{ d }}</span>
                      <span *ngIf="conflictResult.conflicts.length > 8"
                        class="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs italic">
                        +{{ conflictResult.conflicts.length - 8 }} lainnya
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button (click)="confirmBulkCreate()" [disabled]="isBulkSubmitting"
                    class="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:bg-slate-400 text-sm transition-all">
                    {{ isBulkSubmitting ? 'Membuat...' : 'Lanjutkan (lewati bentrok)' }}
                  </button>
                  <button (click)="cancelConflictWarning()"
                    class="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 text-sm transition-all">
                    Batal
                  </button>
                </div>
              </div>

              <button *ngIf="!conflictResult" (click)="bulkCreate()" [disabled]="isBulkSubmitting || selectedDays.length === 0 || !recurForm.student_id"
                class="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-400 transition-all">
                {{ isBulkSubmitting ? 'Membuat jadwal...' : 'Buat Jadwal Berulang' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Plan List -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-slate-900">Daftar Jadwal</h2>
            <select [(ngModel)]="period" (ngModelChange)="loadPlans()" class="border border-slate-300 rounded-lg px-3 py-2">
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>

          <div class="overflow-x-auto" *ngIf="plans.length > 0">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Tanggal</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Murid</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Jam</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr *ngFor="let p of plans">

                  <!-- Normal row -->
                  <ng-container *ngIf="editingPlanId !== p.id && reschedulePlanId !== p.id">
                    <td class="px-4 py-3 text-sm text-slate-800 whitespace-nowrap">{{ p.scheduled_date | date:'EEE, dd/MM/yyyy' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-800">{{ p.student?.name || '-' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-800">{{ p.start_time }} – {{ p.end_time }}</td>
                    <td class="px-4 py-3 text-sm">
                      <span class="px-2 py-1 rounded-full text-xs font-medium"
                        [class.bg-blue-100]="p.status === 'planned'"  [class.text-blue-800]="p.status === 'planned'"
                        [class.bg-green-100]="p.status === 'completed'" [class.text-green-800]="p.status === 'completed'"
                        [class.bg-red-100]="p.status === 'cancelled'"  [class.text-red-800]="p.status === 'cancelled'">
                        {{ statusLabel(p.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex gap-1 flex-wrap">
                        <button *ngIf="p.status === 'planned'" (click)="startReschedule(p)" [disabled]="isActionPending"
                          class="px-2 py-1 rounded bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 text-xs transition-all">
                          📅 Reschedule
                        </button>
                        <button (click)="startEdit(p)" [disabled]="isActionPending"
                          class="px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-50 text-xs transition-all">Edit</button>
                        <button (click)="deletePlan(p)" [disabled]="isActionPending"
                          class="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 text-xs transition-all">Hapus</button>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Reschedule row -->
                  <ng-container *ngIf="reschedulePlanId === p.id">
                    <td colspan="5" class="px-4 py-3">
                      <div class="bg-violet-50 border border-violet-200 rounded-xl p-3 flex flex-col md:flex-row gap-3 items-start md:items-end">
                        <div class="flex-shrink-0">
                          <p class="text-xs text-slate-500 mb-1">Jadwal Lama</p>
                          <p class="text-sm font-medium text-slate-700">{{ p.scheduled_date | date:'EEE, dd/MM/yyyy' }} · {{ p.start_time }}</p>
                        </div>
                        <svg class="h-5 w-5 text-violet-500 hidden md:block self-center flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                        <div class="flex gap-2 flex-wrap items-end flex-1">
                          <div>
                            <label class="text-xs text-slate-500 block mb-1">Tanggal Baru *</label>
                            <input [(ngModel)]="rescheduleForm.scheduled_date" type="date" class="border border-violet-300 rounded-lg px-3 py-2 text-sm" />
                          </div>
                          <div>
                            <label class="text-xs text-slate-500 block mb-1">Jam Mulai</label>
                            <input [(ngModel)]="rescheduleForm.start_time" type="time" class="border border-violet-300 rounded-lg px-3 py-2 text-sm w-32" />
                          </div>
                          <div>
                            <label class="text-xs text-slate-500 block mb-1">Jam Selesai</label>
                            <input [(ngModel)]="rescheduleForm.end_time" type="time" class="border border-violet-300 rounded-lg px-3 py-2 text-sm w-32" />
                          </div>
                          <button (click)="saveReschedule()" [disabled]="isActionPending" class="px-3 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:bg-slate-400 text-sm transition-all">Simpan</button>
                          <button (click)="cancelReschedule()" [disabled]="isActionPending" class="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 text-sm transition-all">Batal</button>
                        </div>
                      </div>
                    </td>
                  </ng-container>

                  <!-- Edit row -->
                  <ng-container *ngIf="editingPlanId === p.id">
                    <td class="px-4 py-3">
                      <input [(ngModel)]="editPlan.scheduled_date" type="date" class="border border-slate-300 rounded px-2 py-1 text-sm w-36" />
                    </td>
                    <td class="px-4 py-3 text-sm text-slate-800">{{ p.student?.name || '-' }}</td>
                    <td class="px-4 py-3">
                      <div class="flex gap-1">
                        <input [(ngModel)]="editPlan.start_time" type="time" class="border border-slate-300 rounded px-2 py-1 text-sm w-24" />
                        <input [(ngModel)]="editPlan.end_time" type="time" class="border border-slate-300 rounded px-2 py-1 text-sm w-24" />
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <select [(ngModel)]="editPlan.status" class="border border-slate-300 rounded px-2 py-1 text-sm">
                        <option value="planned">Direncanakan</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex gap-1">
                        <button (click)="saveEdit()" [disabled]="isActionPending" class="px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 text-xs transition-all">Simpan</button>
                        <button (click)="cancelEdit()" [disabled]="isActionPending" class="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 text-xs transition-all">Batal</button>
                      </div>
                    </td>
                  </ng-container>

                </tr>
              </tbody>
            </table>
          </div>
          <p *ngIf="plans.length === 0" class="text-slate-500">Belum ada jadwal untuk periode ini.</p>
        </div>

        <div *ngIf="message" class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg text-green-800">{{ message }}</div>
        <div *ngIf="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-800">{{ error }}</div>
      </div>
    </div>
  `,
  styles: []
})
export class LearningPlanComponent implements OnInit {
  students: any[] = [];
  plans: any[] = [];
  period: 'week' | 'month' = 'month';
  isSubmitting = false;
  isBulkSubmitting = false;
  isActionPending = false;
  message = '';
  error = '';

  // Tab
  inputTab: 'manual' | 'recurring' = 'manual';

  // Manual form
  form: { student_id: number | null; scheduled_date: string; start_time: string; end_time: string } = {
    student_id: null, scheduled_date: '', start_time: '09:00', end_time: '11:00'
  };

  // Recurring form
  dayLabels = DAY_LABELS;
  dayNumbers = DAY_NUMBERS;
  selectedDays: number[] = [];
  recurForm = { student_id: null as number | null, start_time: '16:00', end_time: '17:00', from_date: '', to_date: '' };
  previewCount = -1;
  previewDates: string[] = [];

  // Duration mode
  timeMode: 'duration' | 'explicit' = 'duration';
  selectedDurationMinutes = 60;
  // Manual tab duration mode
  manualTimeMode: 'duration' | 'explicit' = 'duration';
  manualDurationMinutes = 60;
  durationOptions = [
    { label: '30 menit', value: 30 },
    { label: '1 jam',    value: 60 },
    { label: '1 j 30 m', value: 90 },
    { label: '2 jam',    value: 120 },
    { label: '2 j 30 m', value: 150 },
    { label: '3 jam',    value: 180 },
  ];

  // Conflict state
  conflictResult: { conflicts: string[]; would_create: number } | null = null;
  pendingBulkData: any = null;

  // Inline edit
  editingPlanId: number | null = null;
  editPlan: any = {};

  // Reschedule
  reschedulePlanId: number | null = null;
  rescheduleForm: any = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadPlans();
    // Default dates to today
    const today = new Date();
    this.form.scheduled_date = this.fmtDate(today);
    this.recurForm.from_date = this.fmtDate(today);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.recurForm.to_date = this.fmtDate(nextMonth);
    // Apply initial duration
    this.calcEndTimeFromDuration();
    this.calcManualEndTime();
  }

  loadStudents(): void {
    this.apiService.getInstructorStudents('true').subscribe({
      next: (res) => {
        this.students = res.data || [];
        if (this.students.length > 0) {
          if (!this.form.student_id) this.form.student_id = this.students[0].id;
          if (!this.recurForm.student_id) this.recurForm.student_id = this.students[0].id;
        }
      },
      error: (err) => (this.error = err.error?.error || 'Gagal mengambil murid')
    });
  }

  loadPlans(): void {
    this.apiService.getLearningPlans(this.period).subscribe({
      next: (res) => (this.plans = res.data || []),
      error: (err) => (this.error = err.error?.error || 'Gagal mengambil jadwal')
    });
  }

  // ============ Manual Create ============

  onManualStartTimeChange(): void {
    if (this.manualTimeMode === 'duration') {
      this.calcManualEndTime();
    }
  }

  setManualDuration(mins: number): void {
    this.manualDurationMinutes = mins;
    this.calcManualEndTime();
  }

  calcManualEndTime(): void {
    if (!this.form.start_time) return;
    const [hStr, mStr] = this.form.start_time.split(':');
    const totalMins = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + this.manualDurationMinutes;
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    this.form.end_time = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }

  createPlan(): void {
    if (!this.form.student_id || !this.form.scheduled_date || !this.form.start_time || !this.form.end_time) {
      this.error = 'Lengkapi semua field jadwal';
      return;
    }
    this.isSubmitting = true;
    this.error = '';
    this.message = '';

    this.apiService.createLearningPlan({
      student_id: this.form.student_id,
      scheduled_date: this.form.scheduled_date,
      start_time: this.form.start_time,
      end_time: this.form.end_time
    }).subscribe({
      next: (res) => {
        this.message = res.message || 'Jadwal berhasil dibuat';
        this.form = { student_id: this.form.student_id, scheduled_date: this.fmtDate(new Date()), start_time: '09:00', end_time: '11:00' };
        this.loadPlans();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal membuat jadwal';
        this.isSubmitting = false;
      }
    });
  }

  // ============ Recurring ============

  // Called when start_time changes OR when switching to duration mode
  onStartTimeChange(): void {
    if (this.timeMode === 'duration') {
      this.calcEndTimeFromDuration();
    }
    this.calcPreview();
  }

  setDuration(mins: number): void {
    this.selectedDurationMinutes = mins;
    this.calcEndTimeFromDuration();
    this.calcPreview();
  }

  calcEndTimeFromDuration(): void {
    if (!this.recurForm.start_time) return;
    const [hStr, mStr] = this.recurForm.start_time.split(':');
    const totalMins = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + this.selectedDurationMinutes;
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    this.recurForm.end_time = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }

  toggleDay(d: number): void {
    const idx = this.selectedDays.indexOf(d);
    if (idx >= 0) {
      this.selectedDays.splice(idx, 1);
    } else {
      this.selectedDays.push(d);
    }
    this.calcPreview();
  }

  calcPreview(): void {
    if (!this.recurForm.from_date || !this.recurForm.to_date || this.selectedDays.length === 0) {
      this.previewCount = 0;
      this.previewDates = [];
      return;
    }
    const from = new Date(this.recurForm.from_date);
    const to = new Date(this.recurForm.to_date);
    if (to < from) { this.previewCount = 0; this.previewDates = []; return; }

    const daySet = new Set(this.selectedDays);
    const dates: string[] = [];
    const cur = new Date(from);

    while (cur <= to) {
      const goDay = cur.getDay(); // 0=Sun
      const ourDay = goDay === 0 ? 7 : goDay;
      if (daySet.has(ourDay)) {
        dates.push(cur.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }));
      }
      cur.setDate(cur.getDate() + 1);
    }

    this.previewCount = dates.length;
    this.previewDates = [dates[0], dates[dates.length - 1]].filter(Boolean);
  }

  bulkCreate(): void {
    if (!this.recurForm.student_id || this.selectedDays.length === 0 ||
        !this.recurForm.from_date || !this.recurForm.to_date) {
      this.error = 'Lengkapi semua field jadwal berulang';
      return;
    }
    if (this.recurForm.to_date < this.recurForm.from_date) {
      this.error = '"Sampai Tanggal" tidak boleh lebih awal dari "Dari Tanggal"';
      return;
    }
    this.isBulkSubmitting = true;
    this.error = '';
    this.message = '';
    this.conflictResult = null;

    this.pendingBulkData = {
      student_id: this.recurForm.student_id,
      days_of_week: [...this.selectedDays].sort(),
      start_time: this.recurForm.start_time,
      end_time: this.recurForm.end_time,
      from_date: this.recurForm.from_date,
      to_date: this.recurForm.to_date
    };

    this.apiService.bulkCreateLearningPlans(this.pendingBulkData).subscribe({
      next: (res) => {
        const skippedMsg = res.skipped > 0 ? `, ${res.skipped} dilewati (sudah ada)` : '';
        this.message = `${res.created} jadwal berhasil dibuat${skippedMsg}`;
        this.resetRecurForm();
        this.loadPlans();
        this.isBulkSubmitting = false;
      },
      error: (err) => {
        this.isBulkSubmitting = false;
        if (err.status === 409 && err.error?.conflicts) {
          // Show conflict warning panel — do NOT show generic error
          this.conflictResult = {
            conflicts: err.error.conflicts,
            would_create: err.error.would_create ?? 0
          };
        } else {
          this.error = err.error?.error || 'Gagal membuat jadwal berulang';
          this.pendingBulkData = null;
        }
      }
    });
  }

  confirmBulkCreate(): void {
    if (!this.pendingBulkData) return;
    this.isBulkSubmitting = true;
    this.error = '';
    this.message = '';

    this.apiService.bulkCreateLearningPlans({ ...this.pendingBulkData, force: true }).subscribe({
      next: (res) => {
        const skippedMsg = res.skipped > 0 ? `, ${res.skipped} bentrok dilewati` : '';
        this.message = `${res.created} jadwal berhasil dibuat${skippedMsg}`;
        this.resetRecurForm();
        this.loadPlans();
        this.isBulkSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal membuat jadwal berulang';
        this.isBulkSubmitting = false;
      }
    });
  }

  cancelConflictWarning(): void {
    this.conflictResult = null;
    this.pendingBulkData = null;
  }

  private resetRecurForm(): void {
    this.selectedDays = [];
    this.previewCount = -1;
    this.previewDates = [];
    this.conflictResult = null;
    this.pendingBulkData = null;
  }

  // ============ Reschedule ============

  startReschedule(plan: any): void {
    this.editingPlanId = null;
    this.reschedulePlanId = plan.id;
    const d = new Date(plan.scheduled_date);
    this.rescheduleForm = {
      scheduled_date: this.fmtDate(d),
      start_time: plan.start_time,
      end_time: plan.end_time
    };
  }

  cancelReschedule(): void {
    this.reschedulePlanId = null;
    this.rescheduleForm = {};
  }

  saveReschedule(): void {
    if (!this.reschedulePlanId || !this.rescheduleForm.scheduled_date) {
      this.error = 'Tanggal baru harus diisi';
      return;
    }
    if (this.isActionPending) return;
    this.isActionPending = true;
    this.error = '';
    this.message = '';
    this.apiService.updateLearningPlan(this.reschedulePlanId, this.rescheduleForm).subscribe({
      next: (res) => {
        this.message = res.message || 'Jadwal berhasil direschedule';
        this.reschedulePlanId = null;
        this.rescheduleForm = {};
        this.isActionPending = false;
        this.loadPlans();
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal melakukan reschedule';
        this.isActionPending = false;
      }
    });
  }

  // ============ Edit ============

  startEdit(plan: any): void {
    this.reschedulePlanId = null;
    this.editingPlanId = plan.id;
    const d = new Date(plan.scheduled_date);
    this.editPlan = {
      scheduled_date: this.fmtDate(d),
      start_time: plan.start_time,
      end_time: plan.end_time,
      status: plan.status
    };
  }

  cancelEdit(): void {
    this.editingPlanId = null;
    this.editPlan = {};
  }

  saveEdit(): void {
    if (!this.editingPlanId || this.isActionPending) return;
    this.isActionPending = true;
    this.error = '';
    this.message = '';
    this.apiService.updateLearningPlan(this.editingPlanId, this.editPlan).subscribe({
      next: (res) => {
        this.message = res.message || 'Jadwal berhasil diperbarui';
        this.editingPlanId = null;
        this.editPlan = {};
        this.isActionPending = false;
        this.loadPlans();
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal memperbarui jadwal';
        this.isActionPending = false;
      }
    });
  }

  // ============ Delete ============

  deletePlan(plan: any): void {
    if (!confirm(`Yakin ingin menghapus jadwal ${plan.student?.name || ''} pada ${plan.start_time}?`)) return;
    if (this.isActionPending) return;
    this.isActionPending = true;
    this.error = '';
    this.message = '';
    this.apiService.deleteLearningPlan(plan.id).subscribe({
      next: (res) => {
        this.message = res.message || 'Jadwal berhasil dihapus';
        this.isActionPending = false;
        this.loadPlans();
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal menghapus jadwal';
        this.isActionPending = false;
      }
    });
  }

  // ============ Helpers ============

  statusLabel(status: string): string {
    return status === 'planned' ? 'Direncanakan' : status === 'completed' ? 'Selesai' : 'Dibatalkan';
  }

  fmtDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
