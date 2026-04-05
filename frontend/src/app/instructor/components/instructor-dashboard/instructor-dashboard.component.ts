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
              <p class="text-slate-600 mt-1">Check-in pribadi, sesi murid aktif, dan akses cepat fitur instruktur.</p>
            </div>
            <div class="flex gap-2">
              <button (click)="goToStudents()" class="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700">Kelola Murid</button>
              <button (click)="goToPlans()" class="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800">Jadwal Belajar</button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Absensi Instruktur Hari Ini</h2>
          <div *ngIf="todayAttendance" class="mb-4 text-sm text-slate-700">
            Clock-in: {{ todayAttendance.clock_in_time | date:'HH:mm' }}
            <span *ngIf="todayAttendance.clock_out_time"> | Clock-out: {{ todayAttendance.clock_out_time | date:'HH:mm' }}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button (click)="checkIn()" [disabled]="isCheckingIn || !!todayAttendance" class="py-3 rounded-lg bg-blue-600 text-white disabled:bg-slate-400">
              {{ isCheckingIn ? 'Memproses...' : (todayAttendance ? 'Sudah Check-In' : 'Check-In Sekarang') }}
            </button>
            <button (click)="checkOut()" [disabled]="isCheckingOut || !todayAttendance || !!todayAttendance?.clock_out_time" class="py-3 rounded-lg bg-purple-600 text-white disabled:bg-slate-400">
              {{ isCheckingOut ? 'Memproses...' : (todayAttendance?.clock_out_time ? 'Sudah Check-Out' : 'Check-Out Sekarang') }}
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Sesi Murid Aktif</h2>

          <div *ngIf="activeSession" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
            <p class="text-slate-900 font-semibold">{{ activeSession.student?.name }}</p>
            <p class="text-sm text-slate-600">Mulai: {{ activeSession.check_in_time | date:'HH:mm:ss' }}</p>
            <p class="text-sm text-emerald-700 font-semibold">Durasi berjalan: {{ activeDurationDisplay }}</p>
            <button (click)="finishSession()" class="mt-3 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Finish Course</button>
          </div>

          <div *ngIf="!activeSession" class="space-y-3">
            <label class="text-sm font-medium text-slate-700">Pilih murid untuk mulai sesi</label>
            <select [(ngModel)]="selectedStudentId" class="w-full border border-slate-300 rounded-lg px-3 py-2">
              <option [ngValue]="null">-- Pilih Murid --</option>
              <option *ngFor="let s of students" [ngValue]="s.id">{{ s.name }} (Sisa {{ s.remaining_quota_hours }} jam)</option>
            </select>
            <button (click)="startSession()" [disabled]="isStartingSession || !selectedStudentId" class="px-4 py-2 rounded-lg bg-amber-600 text-white disabled:bg-slate-400">
              {{ isStartingSession ? 'Memproses...' : 'Start Course' }}
            </button>
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
  todayAttendance: any = null;
  activeSession: any = null;
  selectedStudentId: number | null = null;

  isCheckingIn = false;
  isCheckingOut = false;
  isStartingSession = false;

  message = '';
  error = '';

  activeDurationDisplay = '00:00:00';
  private timerRef: any = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  loadInitialData(): void {
    this.apiService.getInstructorStudents().subscribe({ next: (res) => (this.students = res.data || []) });
    this.apiService.getTodayAttendance().subscribe({ next: (res) => (this.todayAttendance = res.data) });
    this.loadActiveSession();
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

  checkIn(): void {
    this.withGeoLocation((coords) => {
      this.isCheckingIn = true;
      this.error = '';
      this.message = '';
      this.apiService.clockIn(coords).subscribe({
        next: (res) => {
          this.message = res.message || 'Check-in berhasil';
          this.apiService.getTodayAttendance().subscribe({ next: (r) => (this.todayAttendance = r.data) });
          this.isCheckingIn = false;
        },
        error: (err) => {
          this.error = err.error?.error || 'Gagal check-in';
          this.isCheckingIn = false;
        }
      });
    });
  }

  checkOut(): void {
    this.withGeoLocation((coords) => {
      this.isCheckingOut = true;
      this.error = '';
      this.message = '';
      this.apiService.clockOut(coords).subscribe({
        next: (res) => {
          this.message = res.message || 'Check-out berhasil';
          this.apiService.getTodayAttendance().subscribe({ next: (r) => (this.todayAttendance = r.data) });
          this.isCheckingOut = false;
        },
        error: (err) => {
          this.error = err.error?.error || 'Gagal check-out';
          this.isCheckingOut = false;
        }
      });
    });
  }

  startSession(): void {
    if (!this.selectedStudentId) {
      return;
    }

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
          this.apiService.getInstructorStudents().subscribe({ next: (s) => (this.students = s.data || []) });
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
    if (!this.activeSession?.id) {
      return;
    }

    this.error = '';
    this.message = '';
    this.apiService.endStudentSession({ session_id: this.activeSession.id }).subscribe({
      next: (res) => {
        this.message = res.message || 'Sesi selesai';
        this.loadActiveSession();
        this.apiService.getInstructorStudents().subscribe({ next: (s) => (this.students = s.data || []) });
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
