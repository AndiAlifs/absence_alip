import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-learning-plan',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-100 py-8 px-4">
      <div class="max-w-6xl mx-auto space-y-6">

        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h1 class="text-3xl font-bold text-slate-900">Jadwal Belajar</h1>
          <p class="text-slate-600 mt-1">Jadwal yang telah dibuat oleh admin untuk murid Anda.</p>
        </div>

        <!-- Info banner -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-blue-800 text-sm">Pembuatan dan pengeditan jadwal dilakukan oleh admin. Anda dapat menandai jadwal sebagai <strong>Dibatalkan</strong>. Status <strong>Selesai</strong> ditetapkan secara otomatis melalui sesi aktif.</p>
        </div>

        <!-- Period Tabs -->
        <div class="flex gap-2">
          <button (click)="period = 'week'; loadPlans()"
            [class]="period === 'week' ? 'px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium' : 'px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-50'">
            Minggu Ini
          </button>
          <button (click)="period = 'month'; loadPlans()"
            [class]="period === 'month' ? 'px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium' : 'px-4 py-2 rounded-lg border text-sm text-slate-600 hover:bg-slate-50'">
            Bulan Ini
          </button>
        </div>

        <!-- Success / Error message -->
        <div *ngIf="message" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">{{message}}</div>
        <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">{{error}}</div>

        <!-- Plans List -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div *ngIf="plans.length > 0" class="space-y-3">
            <div *ngFor="let p of plans" class="border rounded-xl p-4 flex items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="font-semibold text-slate-900">{{p.student?.name || 'Murid'}}</p>
                  <span [class]="statusClass(p.status)">{{statusLabel(p.status)}}</span>
                </div>
                <p class="text-sm text-slate-600 mt-0.5">{{formatDate(p.scheduled_date)}} · {{p.start_time}} – {{p.end_time}}</p>
              </div>

              <!-- Action buttons — only for planned -->
              <div *ngIf="p.status === 'planned'" class="flex gap-2">
                <button (click)="markStatus(p, 'cancelled')" [disabled]="updatingId === p.id"
                  class="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-medium disabled:opacity-50">
                  ✕ Batalkan
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="plans.length === 0" class="text-center py-10 text-slate-400">
            <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Belum ada jadwal untuk periode ini
          </div>
        </div>

      </div>
    </div>
  `
})
export class LearningPlanComponent implements OnInit {
  plans: any[] = [];
  period: 'week' | 'month' = 'month';

  updatingId: number | null = null;

  message = '';
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans() {
    this.apiService.getLearningPlans(this.period).subscribe({
      next: (r: any) => this.plans = r.data || [],
      error: () => {}
    });
  }

  markStatus(plan: any, status: 'cancelled') {
    this.updatingId = plan.id;
    this.message = '';
    this.error = '';
    this.apiService.updateLearningPlan(plan.id, { status }).subscribe({
      next: () => {
        this.updatingId = null;
        this.message = 'Jadwal dibatalkan';
        this.loadPlans();
        setTimeout(() => this.message = '', 3000);
      },
      error: (e: any) => {
        this.updatingId = null;
        this.error = e.error?.error || 'Gagal memperbarui status';
      }
    });
  }

  formatDate(d: string): string {
    if (!d) return '';
    const dt = new Date(d);
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return `${days[dt.getDay()]}, ${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
  }

  statusClass(s: string): string {
    if (s === 'completed') return 'bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium';
    if (s === 'cancelled') return 'bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium';
    return 'bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium';
  }

  statusLabel(s: string): string {
    if (s === 'completed') return 'Selesai';
    if (s === 'cancelled') return 'Dibatalkan';
    return 'Direncanakan';
  }
}
