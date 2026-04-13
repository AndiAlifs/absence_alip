import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-instructor-dashboard',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-amber-50 to-cyan-100 py-8 px-4">
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-slate-900">Dashboard Instruktur</h1>
              <p class="text-slate-600 mt-1">Kelola sesi murid, jadwal belajar, dan lihat kalender kegiatan.</p>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button (click)="goToStudents()" class="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-all">Kelola Murid</button>
              <button (click)="goToPlans()" class="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800 transition-all">Jadwal Belajar</button>
            </div>
          </div>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl shadow-lg p-4">
            <p class="text-xs text-slate-500 uppercase font-semibold">Murid Aktif</p>
            <p class="text-2xl font-bold text-cyan-700 mt-1">{{ activeStudentCount }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-4">
            <p class="text-xs text-slate-500 uppercase font-semibold">Alumni</p>
            <p class="text-2xl font-bold text-slate-500 mt-1">{{ pastStudentCount }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-4">
            <p class="text-xs text-slate-500 uppercase font-semibold">Jadwal Minggu Ini</p>
            <p class="text-2xl font-bold text-amber-600 mt-1">{{ weeklyPlanCount }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-4">
            <p class="text-xs text-slate-500 uppercase font-semibold">Sesi Hari Ini</p>
            <p class="text-2xl font-bold text-emerald-600 mt-1">{{ todayPlanCount }}</p>
          </div>
        </div>

        <!-- Active Session -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Sesi Murid Aktif</h2>

          <div *ngIf="activeSession" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p class="text-slate-900 font-semibold text-lg">{{ activeSession.student?.name }}</p>
                <p class="text-sm text-slate-600">Mulai: {{ activeSession.check_in_time | date:'HH:mm:ss' }}</p>
                <p class="text-sm text-emerald-700 font-semibold">Durasi berjalan: {{ activeDurationDisplay }}</p>
              </div>
              <div class="flex gap-2">
                <input [(ngModel)]="sessionNotes" placeholder="Catatan sesi (opsional)" class="border border-slate-300 rounded-lg px-3 py-2 text-sm w-48" />
                <button (click)="finishSession()" class="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all">Sesi Selesai</button>
              </div>
            </div>
          </div>

          <div *ngIf="!activeSession" class="space-y-3">
            <label class="text-sm font-medium text-slate-700">Pilih murid untuk mulai sesi</label>
            <div class="flex gap-3 flex-wrap">
              <select [(ngModel)]="selectedStudentId" class="flex-1 border border-slate-300 rounded-lg px-3 py-2">
                <option [ngValue]="null">-- Pilih Murid --</option>
                <option *ngFor="let s of activeStudents" [ngValue]="s.id">{{ s.name }} (Sisa {{ s.remaining_quota_hours }} jam)</option>
              </select>
              <button (click)="startSession()" [disabled]="isStartingSession || !selectedStudentId" class="px-4 py-2 rounded-lg bg-amber-600 text-white disabled:bg-slate-400 transition-all">
                {{ isStartingSession ? 'Memproses...' : 'Mulai Sesi' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Calendar View -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-slate-900">Kalender Jadwal</h2>
            <div class="flex items-center gap-2">
              <button (click)="prevPeriod()" class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all">
                <svg class="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <span class="text-sm font-semibold text-slate-700 min-w-[180px] text-center">{{ calendarTitle }}</span>
              <button (click)="nextPeriod()" class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all">
                <svg class="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
              <select [(ngModel)]="calendarView" (ngModelChange)="onViewChange()" class="ml-2 border border-slate-300 rounded-lg px-3 py-1.5 text-sm">
                <option value="week">Minggu</option>
                <option value="month">Bulan</option>
              </select>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden">
            <div *ngFor="let dayLabel of dayLabels" class="bg-slate-50 text-center py-2 text-xs font-semibold text-slate-600 uppercase">
              {{ dayLabel }}
            </div>
            <div *ngFor="let day of calendarDays"
              class="bg-white min-h-[80px] p-1.5 cursor-pointer hover:bg-blue-50 transition-all relative"
              [class.bg-blue-50]="isToday(day.date)"
              [class.opacity-40]="!day.inCurrentPeriod"
              (click)="selectDay(day)">
              <span class="text-xs font-medium" [class.text-blue-700]="isToday(day.date)" [class.text-slate-700]="!isToday(day.date)">
                {{ day.date | date:'d' }}
              </span>
              <div class="mt-0.5 space-y-0.5">
                <div *ngFor="let plan of day.plans?.slice(0, 3)"
                  class="text-[10px] px-1 py-0.5 rounded truncate"
                  [class.bg-blue-100]="plan.status === 'planned'"
                  [class.text-blue-800]="plan.status === 'planned'"
                  [class.bg-green-100]="plan.status === 'completed'"
                  [class.text-green-800]="plan.status === 'completed'"
                  [class.bg-red-100]="plan.status === 'cancelled'"
                  [class.text-red-800]="plan.status === 'cancelled'">
                  {{ plan.start_time }} {{ plan.student?.name }}
                </div>
                <div *ngIf="day.plans && day.plans.length > 3" class="text-[10px] text-slate-500 px-1">
                  +{{ day.plans.length - 3 }} lainnya
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Day Detail -->
          <div *ngIf="selectedDate" class="mt-4 bg-slate-50 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-slate-700 mb-3">Jadwal {{ selectedDate | date:'EEEE, d MMMM yyyy' }}</h3>
            <div *ngIf="selectedDayPlans.length === 0" class="text-sm text-slate-500">Tidak ada jadwal.</div>
            <ng-container *ngFor="let plan of selectedDayPlans">
              <!-- Normal row -->
              <div *ngIf="calReschedulePlanId !== plan.id" class="flex items-center justify-between bg-white rounded-lg p-3 mb-2 shadow-sm">
                <div>
                  <p class="text-sm font-medium text-slate-800">{{ plan.student?.name || '-' }}</p>
                  <p class="text-xs text-slate-500">{{ plan.start_time }} - {{ plan.end_time }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button *ngIf="plan.status === 'planned'" (click)="calStartReschedule(plan)"
                    class="px-2 py-1 rounded bg-violet-100 text-violet-700 hover:bg-violet-200 text-xs transition-all">📅 Reschedule</button>
                  <span class="px-2 py-1 rounded-full text-xs"
                    [class.bg-blue-100]="plan.status === 'planned'"   [class.text-blue-800]="plan.status === 'planned'"
                    [class.bg-green-100]="plan.status === 'completed'" [class.text-green-800]="plan.status === 'completed'"
                    [class.bg-red-100]="plan.status === 'cancelled'"  [class.text-red-800]="plan.status === 'cancelled'">
                    {{ plan.status === 'planned' ? 'Direncanakan' : plan.status === 'completed' ? 'Selesai' : 'Dibatalkan' }}
                  </span>
                </div>
              </div>
              <!-- Inline reschedule form -->
              <div *ngIf="calReschedulePlanId === plan.id" class="bg-violet-50 border border-violet-200 rounded-xl p-3 mb-2">
                <p class="text-xs font-semibold text-violet-700 mb-2">Jadwal Ulang: {{ plan.student?.name }}</p>
                <div class="flex flex-wrap gap-2 items-end">
                  <div>
                    <label class="text-xs text-slate-500 block mb-1">Tanggal Baru *</label>
                    <input [(ngModel)]="calRescheduleForm.scheduled_date" type="date" class="border border-violet-300 rounded-lg px-3 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label class="text-xs text-slate-500 block mb-1">Jam Mulai</label>
                    <input [(ngModel)]="calRescheduleForm.start_time" type="time" class="border border-violet-300 rounded-lg px-3 py-1.5 text-sm w-28" />
                  </div>
                  <div>
                    <label class="text-xs text-slate-500 block mb-1">Jam Selesai</label>
                    <input [(ngModel)]="calRescheduleForm.end_time" type="time" class="border border-violet-300 rounded-lg px-3 py-1.5 text-sm w-28" />
                  </div>
                  <button (click)="calSaveReschedule()" class="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 text-sm">Simpan</button>
                  <button (click)="calReschedulePlanId = null" class="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 text-sm">Batal</button>
                </div>
              </div>
            </ng-container>
          </div>
        </div>

        <div *ngIf="message" class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg text-green-800">{{ message }}</div>
        <div *ngIf="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-800">{{ error }}</div>
      </div>
    </div>
  `,
  styles: []
})
export class InstructorDashboardComponent implements OnInit, OnDestroy {
  students: any[] = [];
  activeStudents: any[] = [];
  activeSession: any = null;
  selectedStudentId: number | null = null;
  sessionNotes = '';
  calendarPlans: any[] = [];

  isStartingSession = false;
  message = '';
  error = '';

  activeDurationDisplay = '00:00:00';
  private timerRef: any = null;

  // Stats
  activeStudentCount = 0;
  pastStudentCount = 0;
  weeklyPlanCount = 0;
  todayPlanCount = 0;

  // Calendar
  calendarView: 'week' | 'month' = 'week';
  calendarDays: any[] = [];
  dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  calendarTitle = '';
  currentDate = new Date();
  selectedDate: Date | null = null;
  selectedDayPlans: any[] = [];

  // Calendar inline reschedule
  calReschedulePlanId: number | null = null;
  calRescheduleForm: any = {};

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  loadInitialData(): void {
    this.apiService.getInstructorStudents().subscribe({
      next: (res) => {
        this.students = res.data || [];
        this.activeStudents = this.students.filter((s: any) => s.is_active);
        this.activeStudentCount = this.activeStudents.length;
        this.pastStudentCount = this.students.filter((s: any) => !s.is_active).length;
      }
    });
    this.loadActiveSession();
    this.buildCalendar();
  }

  loadActiveSession(): void {
    this.apiService.getActiveStudentSession().subscribe({
      next: (res) => {
        this.activeSession = res.data;
        if (this.activeSession) {
          this.startTimer();
        } else {
          this.stopTimer();
          this.activeDurationDisplay = '00:00:00';
        }
      },
      error: () => {
        this.activeSession = null;
        this.stopTimer();
      }
    });
  }

  startSession(): void {
    if (!this.selectedStudentId) return;

    this.withGeoLocation((coords) => {
      this.isStartingSession = true;
      this.error = '';
      this.message = '';

      this.apiService.startStudentSession({
        student_id: this.selectedStudentId as number,
        latitude: coords.latitude,
        longitude: coords.longitude
      }).subscribe({
        next: (res) => {
          this.message = res.message || 'Sesi dimulai';
          this.selectedStudentId = null;
          this.loadActiveSession();
          this.loadInitialData();
          this.isStartingSession = false;
        },
        error: (err) => {
          this.error = err.error?.error || 'Gagal memulai sesi';
          this.isStartingSession = false;
        }
      });
    });
  }

  finishSession(): void {
    if (!this.activeSession?.id) return;

    this.error = '';
    this.message = '';
    this.apiService.endStudentSession({
      session_id: this.activeSession.id,
      notes: this.sessionNotes
    }).subscribe({
      next: (res) => {
        this.message = res.message || 'Sesi selesai';
        this.sessionNotes = '';
        this.loadActiveSession();
        this.loadInitialData();
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal mengakhiri sesi';
      }
    });
  }

  goToStudents(): void {
    this.router.navigate(['/instructor/students']);
  }

  goToPlans(): void {
    this.router.navigate(['/instructor/learning-plan']);
  }

  // ============ Calendar Logic ============

  buildCalendar(): void {
    const { startDate, endDate } = this.getCalendarRange();
    this.calendarTitle = this.getCalendarTitle();

    // Build day cells
    this.calendarDays = [];
    const gridStart = this.getGridStart(startDate);
    const gridEnd = this.getGridEnd(endDate);

    const current = new Date(gridStart);
    while (current <= gridEnd) {
      this.calendarDays.push({
        date: new Date(current),
        inCurrentPeriod: current >= startDate && current < endDate,
        plans: []
      });
      current.setDate(current.getDate() + 1);
    }

    // Load plans for the calendar range
    const sDate = this.formatDate(gridStart);
    const eDate = this.formatDate(gridEnd);
    this.apiService.getLearningPlans(this.calendarView, sDate, eDate).subscribe({
      next: (res) => {
        this.calendarPlans = res.data || [];
        this.mapPlansToCalendar();
        this.countStats();
      }
    });
  }

  mapPlansToCalendar(): void {
    for (const day of this.calendarDays) {
      const dayStr = this.formatDate(day.date);
      day.plans = this.calendarPlans.filter((p: any) => {
        const planDate = new Date(p.scheduled_date);
        return this.formatDate(planDate) === dayStr;
      });
    }
    if (this.selectedDate) {
      this.selectDay({ date: this.selectedDate });
    }
  }

  countStats(): void {
    // Count plans for current week
    const now = new Date();
    const weekStart = this.getWeekStart(now);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    this.weeklyPlanCount = this.calendarPlans.filter((p: any) => {
      const d = new Date(p.scheduled_date);
      return d >= weekStart && d < weekEnd;
    }).length;

    const todayStr = this.formatDate(now);
    this.todayPlanCount = this.calendarPlans.filter((p: any) => {
      return this.formatDate(new Date(p.scheduled_date)) === todayStr;
    }).length;
  }

  getCalendarRange(): { startDate: Date; endDate: Date } {
    if (this.calendarView === 'week') {
      const start = this.getWeekStart(this.currentDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      return { startDate: start, endDate: end };
    } else {
      const start = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      const end = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
      return { startDate: start, endDate: end };
    }
  }

  getGridStart(startDate: Date): Date {
    const d = new Date(startDate);
    let dayOfWeek = d.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    d.setDate(d.getDate() - (dayOfWeek - 1));
    return d;
  }

  getGridEnd(endDate: Date): Date {
    const d = new Date(endDate);
    d.setDate(d.getDate() - 1);
    let dayOfWeek = d.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    d.setDate(d.getDate() + (7 - dayOfWeek));
    return d;
  }

  getWeekStart(date: Date): Date {
    const d = new Date(date);
    let dayOfWeek = d.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    d.setDate(d.getDate() - (dayOfWeek - 1));
    d.setHours(0, 0, 0, 0);
    return d;
  }

  getCalendarTitle(): string {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    if (this.calendarView === 'week') {
      const start = this.getWeekStart(this.currentDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.getDate()} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
    } else {
      return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }
  }

  prevPeriod(): void {
    if (this.calendarView === 'week') {
      this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() - 7));
    } else {
      this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
    }
    this.buildCalendar();
  }

  nextPeriod(): void {
    if (this.calendarView === 'week') {
      this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() + 7));
    } else {
      this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
    }
    this.buildCalendar();
  }

  onViewChange(): void {
    this.buildCalendar();
  }

  selectDay(day: any): void {
    this.selectedDate = day.date;
    this.calReschedulePlanId = null;
    const dayStr = this.formatDate(day.date);
    this.selectedDayPlans = this.calendarPlans.filter((p: any) => {
      return this.formatDate(new Date(p.scheduled_date)) === dayStr;
    });
  }

  calStartReschedule(plan: any): void {
    this.calReschedulePlanId = plan.id;
    const d = new Date(plan.scheduled_date);
    this.calRescheduleForm = {
      scheduled_date: this.formatDate(d),
      start_time: plan.start_time,
      end_time: plan.end_time
    };
  }

  calSaveReschedule(): void {
    if (!this.calReschedulePlanId || !this.calRescheduleForm.scheduled_date) return;
    this.error = '';
    this.message = '';
    this.apiService.updateLearningPlan(this.calReschedulePlanId, this.calRescheduleForm).subscribe({
      next: (res) => {
        this.message = res.message || 'Jadwal berhasil direschedule';
        this.calReschedulePlanId = null;
        this.calRescheduleForm = {};
        this.buildCalendar();
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal melakukan reschedule';
      }
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ============ Helpers ============

  private withGeoLocation(callback: (coords: { latitude: number; longitude: number }) => void): void {
    if (!navigator.geolocation) {
      callback({ latitude: 0, longitude: 0 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        callback({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      },
      () => {
        callback({ latitude: 0, longitude: 0 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerRef = setInterval(() => {
      if (!this.activeSession?.check_in_time) {
        this.activeDurationDisplay = '00:00:00';
        return;
      }

      const started = new Date(this.activeSession.check_in_time).getTime();
      const diff = Math.max(0, Date.now() - started);
      const totalSeconds = Math.floor(diff / 1000);
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
      const s = (totalSeconds % 60).toString().padStart(2, '0');
      this.activeDurationDisplay = `${h}:${m}:${s}`;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }
}
