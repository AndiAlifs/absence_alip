import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-learning-plan',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 py-8 px-4">
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h1 class="text-3xl font-bold text-slate-900">Jadwal Belajar</h1>
          <p class="text-slate-600 mt-1">Buat rencana belajar mingguan/bulanan per murid.</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Buat Jadwal Baru</h2>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select [(ngModel)]="form.student_id" class="border border-slate-300 rounded-lg px-3 py-2">
              <option [ngValue]="null">Pilih Murid</option>
              <option *ngFor="let s of students" [ngValue]="s.id">{{ s.name }}</option>
            </select>
            <input [(ngModel)]="form.scheduled_date" type="date" class="border border-slate-300 rounded-lg px-3 py-2" />
            <input [(ngModel)]="form.start_time" type="time" class="border border-slate-300 rounded-lg px-3 py-2" />
            <input [(ngModel)]="form.end_time" type="time" class="border border-slate-300 rounded-lg px-3 py-2" />
            <button (click)="createPlan()" [disabled]="isSubmitting" class="rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-400">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Jadwal' }}
            </button>
          </div>
        </div>

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
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr *ngFor="let p of plans">
                  <td class="px-4 py-3 text-sm text-slate-800">{{ p.scheduled_date | date:'dd/MM/yyyy' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-800">{{ p.student?.name || '-' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-800">{{ p.start_time }} - {{ p.end_time }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs"
                      [class.bg-blue-100]="p.status === 'planned'"
                      [class.text-blue-800]="p.status === 'planned'"
                      [class.bg-green-100]="p.status === 'completed'"
                      [class.text-green-800]="p.status === 'completed'"
                      [class.bg-red-100]="p.status === 'cancelled'"
                      [class.text-red-800]="p.status === 'cancelled'">
                      {{ p.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p *ngIf="plans.length === 0" class="text-slate-500">Belum ada jadwal.</p>
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
  message = '';
  error = '';

  form: {
    student_id: number | null;
    scheduled_date: string;
    start_time: string;
    end_time: string;
  } = {
    student_id: null,
    scheduled_date: '',
    start_time: '09:00',
    end_time: '11:00'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadPlans();
  }

  loadStudents(): void {
    this.apiService.getInstructorStudents().subscribe({
      next: (res) => (this.students = res.data || []),
      error: (err) => (this.error = err.error?.error || 'Gagal mengambil murid')
    });
  }

  loadPlans(): void {
    this.apiService.getLearningPlans(this.period).subscribe({
      next: (res) => (this.plans = res.data || []),
      error: (err) => (this.error = err.error?.error || 'Gagal mengambil jadwal')
    });
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
        this.form = {
          student_id: null,
          scheduled_date: '',
          start_time: '09:00',
          end_time: '11:00'
        };
        this.loadPlans();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal membuat jadwal';
        this.isSubmitting = false;
      }
    });
  }
}
