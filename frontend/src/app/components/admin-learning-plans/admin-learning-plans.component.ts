import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-learning-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div class="max-w-7xl mx-auto">

        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
          <div>
            <button (click)="goBack()" class="text-blue-600 hover:text-blue-800 text-sm mb-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Kembali ke Dashboard
            </button>
            <h1 class="text-3xl font-bold text-gray-900">Jadwal Belajar</h1>
            <p class="text-gray-600 mt-1">Kelola rencana belajar semua murid</p>
          </div>
          <button (click)="openCreate()" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Tambah Jadwal
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
          <select [(ngModel)]="filterInstructor" (ngModelChange)="onInstructorFilter()" class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Semua Instruktur</option>
            <option *ngFor="let inst of instructors" [value]="inst.id">{{inst.full_name || inst.username}}</option>
          </select>
          <select [(ngModel)]="filterStudent" (ngModelChange)="loadPlans()" class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Semua Murid</option>
            <option *ngFor="let s of filteredStudents" [value]="s.id">{{s.name}}</option>
          </select>
          <select [(ngModel)]="filterPeriod" (ngModelChange)="loadPlans()" class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="month">Bulan Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="custom">Custom</option>
          </select>
          <ng-container *ngIf="filterPeriod === 'custom'">
            <input type="date" [(ngModel)]="customStart" (ngModelChange)="loadPlans()" class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
            <input type="date" [(ngModel)]="customEnd" (ngModelChange)="loadPlans()" class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          </ng-container>
          <span class="ml-auto text-sm text-gray-500">{{plans.length}} jadwal</span>
        </div>

        <!-- Plans Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Tanggal</th>
                <th class="px-4 py-3 text-left">Waktu</th>
                <th class="px-4 py-3 text-left">Murid</th>
                <th class="px-4 py-3 text-left">Instruktur</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of plans" class="border-t hover:bg-gray-50">
                <td class="px-4 py-3">{{formatDate(p.scheduled_date)}}</td>
                <td class="px-4 py-3">{{p.start_time}} – {{p.end_time}}</td>
                <td class="px-4 py-3 font-medium">{{p.student?.name || '-'}}</td>
                <td class="px-4 py-3 text-gray-600">{{getInstructorName(p.instructor_id)}}</td>
                <td class="px-4 py-3 text-center">
                  <span [class]="statusClass(p.status)">{{statusLabel(p.status)}}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center gap-1">
                    <button (click)="openEdit(p)" title="Edit" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button (click)="deletePlan(p)" title="Hapus" class="p-1.5 text-red-600 hover:bg-red-50 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="plans.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-400">Belum ada jadwal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Create/Edit Modal -->
        <div *ngIf="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <h2 class="text-xl font-bold mb-4">{{editingPlan ? 'Edit Jadwal' : 'Tambah Jadwal'}}</h2>
              <div *ngIf="formError" class="mb-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{{formError}}</div>

              <!-- Single / Recurring tabs (only on create) -->
              <div *ngIf="!editingPlan" class="flex gap-2 mb-4">
                <button (click)="createMode='single'" [class]="createMode==='single' ? 'flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium' : 'flex-1 py-2 border rounded-lg text-sm hover:bg-gray-50'">Satu Jadwal</button>
                <button (click)="createMode='bulk'" [class]="createMode==='bulk' ? 'flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium' : 'flex-1 py-2 border rounded-lg text-sm hover:bg-gray-50'">Jadwal Berulang</button>
              </div>

              <div class="space-y-3">
                <!-- Shared fields -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Murid *</label>
                  <select [(ngModel)]="planForm.student_id" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none">
                    <option [ngValue]="0">-- Pilih Murid --</option>
                    <option *ngFor="let s of allStudents" [ngValue]="s.id">{{s.name}} ({{getInstructorNameById(s.instructor_id)}})</option>
                  </select>
                </div>
                <div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Jam Mulai *</label>
                      <input type="time" [(ngModel)]="planForm.start_time" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Jam Selesai *</label>
                      <input type="time" [(ngModel)]="planForm.end_time" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"/>
                    </div>
                  </div>
                  <div class="flex gap-2 items-center mt-2">
                    <span class="text-xs text-gray-500">Preset:</span>
                    <button type="button" (click)="applyPreset(1)"
                      [class]="sessionDurationMinutes === 60 ? 'px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-medium' : 'px-2.5 py-1 border rounded text-xs hover:bg-gray-50'">1 jam</button>
                    <button type="button" (click)="applyPreset(2)"
                      [class]="sessionDurationMinutes === 120 ? 'px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-medium' : 'px-2.5 py-1 border rounded text-xs hover:bg-gray-50'">2 jam</button>
                    <span *ngIf="sessionDurationLabel" class="ml-auto text-sm font-semibold text-blue-600">{{ sessionDurationLabel }}</span>
                  </div>
                </div>

                <!-- Single / Edit fields -->
                <ng-container *ngIf="editingPlan || createMode==='single'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                    <input type="date" [(ngModel)]="planForm.scheduled_date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select [(ngModel)]="planForm.status" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none">
                      <option value="planned">Direncanakan</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                </ng-container>

                <!-- Bulk fields -->
                <ng-container *ngIf="!editingPlan && createMode==='bulk'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Hari *</label>
                    <div class="flex gap-2 flex-wrap">
                      <button *ngFor="let d of dayOptions" (click)="toggleDay(d.val)"
                        [class]="selectedDays.includes(d.val) ? 'px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium' : 'px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50'">
                        {{d.label}}
                      </button>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal *</label>
                      <input type="date" [(ngModel)]="bulkFrom" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal *</label>
                      <input type="date" [(ngModel)]="bulkTo" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"/>
                    </div>
                  </div>
                  <div *ngIf="bulkQuotaInfo" [class]="bulkQuotaExceeded ? 'p-3 bg-red-50 border border-red-300 rounded-lg text-xs text-red-700 font-medium' : 'p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-700'">{{bulkQuotaInfo}}</div>
                  <div *ngIf="conflictWarning" class="p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
                    <p class="font-medium">{{conflictWarning}}</p>
                    <button (click)="forceCreate=true; submitForm()" class="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-xs font-medium hover:bg-yellow-600">Lewati & Buat Quand Même</button>
                  </div>
                </ng-container>
              </div>

              <div class="flex gap-3 mt-6">
                <button (click)="closeModal()" class="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50">Batal</button>
                <button (click)="submitForm()" [disabled]="saving"
                  class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                  {{saving ? 'Menyimpan...' : 'Simpan'}}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Success toast -->
        <div *ngIf="successMsg" class="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          {{successMsg}}
        </div>

      </div>
    </div>
  `
})
export class AdminLearningPlansComponent implements OnInit {
  plans: any[] = [];
  instructors: any[] = [];
  allStudents: any[] = [];
  filteredStudents: any[] = [];

  filterInstructor = '';
  filterStudent = '';
  filterPeriod = 'month';
  customStart = '';
  customEnd = '';

  showModal = false;
  editingPlan: any = null;
  createMode: 'single' | 'bulk' = 'single';
  planForm: any = { student_id: 0, scheduled_date: '', start_time: '', end_time: '', status: 'planned' };
  selectedDays: number[] = [];
  bulkFrom = '';
  bulkTo = '';
  forceCreate = false;
  conflictWarning = '';

  formError = '';
  successMsg = '';
  saving = false;

  dayOptions = [
    { val: 1, label: 'Sen' }, { val: 2, label: 'Sel' }, { val: 3, label: 'Rab' },
    { val: 4, label: 'Kam' }, { val: 5, label: 'Jum' }, { val: 6, label: 'Sab' }, { val: 7, label: 'Min' }
  ];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.adminListInstructors().subscribe({ next: (r: any) => this.instructors = r.data || [] });
    this.api.adminListStudents().subscribe({ next: (r: any) => { this.allStudents = r.data || []; this.filteredStudents = this.allStudents; } });
    this.loadPlans();
  }

  onInstructorFilter() {
    if (this.filterInstructor) {
      this.filteredStudents = this.allStudents.filter((s: any) => s.instructor_id === +this.filterInstructor);
    } else {
      this.filteredStudents = this.allStudents;
    }
    this.filterStudent = '';
    this.loadPlans();
  }

  loadPlans() {
    const params: any = { period: this.filterPeriod === 'custom' ? undefined : this.filterPeriod };
    if (this.filterInstructor) params.instructor_id = +this.filterInstructor;
    if (this.filterStudent) params.student_id = +this.filterStudent;
    if (this.filterPeriod === 'custom') {
      if (this.customStart) params.start_date = this.customStart;
      if (this.customEnd) params.end_date = this.customEnd;
    }
    this.api.adminListLearningPlans(params).subscribe({ next: (r: any) => this.plans = r.data || [] });
  }

  openCreate() {
    this.editingPlan = null;
    this.createMode = 'single';
    this.planForm = { student_id: 0, scheduled_date: '', start_time: '', end_time: '', status: 'planned' };
    this.selectedDays = [];
    this.bulkFrom = '';
    this.bulkTo = '';
    this.forceCreate = false;
    this.conflictWarning = '';
    this.formError = '';
    this.showModal = true;
  }

  openEdit(p: any) {
    this.editingPlan = p;
    const d = new Date(p.scheduled_date);
    this.planForm = {
      student_id: p.student_id,
      scheduled_date: d.toISOString().substring(0, 10),
      start_time: p.start_time,
      end_time: p.end_time,
      status: p.status
    };
    this.formError = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formError = '';
    this.conflictWarning = '';
  }

  toggleDay(d: number) {
    const i = this.selectedDays.indexOf(d);
    if (i >= 0) this.selectedDays.splice(i, 1); else this.selectedDays.push(d);
  }

  get sessionDurationMinutes(): number {
    if (!this.planForm.start_time || !this.planForm.end_time) return 0;
    const [sh, sm] = this.planForm.start_time.split(':').map(Number);
    const [eh, em] = this.planForm.end_time.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  }

  get sessionDurationLabel(): string {
    const dur = this.sessionDurationMinutes;
    if (dur <= 0) return '';
    if (dur % 60 === 0) return `${dur / 60} jam`;
    return `${Math.floor(dur / 60)} jam ${dur % 60} mnt`;
  }

  applyPreset(hours: number) {
    if (!this.planForm.start_time) return;
    const [h, m] = this.planForm.start_time.split(':').map(Number);
    const total = h * 60 + m + hours * 60;
    const eh = Math.floor(total / 60) % 24;
    const em = total % 60;
    this.planForm.end_time = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
  }

  get plannedSessionsCount(): number {
    if (!this.selectedDays.length || !this.bulkFrom || !this.bulkTo) return 0;
    const from = new Date(this.bulkFrom);
    const to = new Date(this.bulkTo);
    if (from > to) return 0;
    const jsDays = this.selectedDays.map((v: number) => v === 7 ? 0 : v);
    let count = 0;
    const cur = new Date(from);
    while (cur <= to) {
      if (jsDays.includes(cur.getDay())) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  }

  get bulkQuotaExceeded(): boolean {
    if (this.createMode !== 'bulk' || !this.planForm.student_id) return false;
    const student = this.allStudents.find((s: any) => s.id === this.planForm.student_id);
    if (!student) return false;
    const dur = this.sessionDurationMinutes;
    if (dur <= 0 || !this.plannedSessionsCount) return false;
    return this.plannedSessionsCount * (dur / 60) > student.remaining_quota_hours;
  }

  get bulkQuotaInfo(): string {
    if (this.createMode !== 'bulk' || !this.planForm.student_id) return '';
    const student = this.allStudents.find((s: any) => s.id === this.planForm.student_id);
    if (!student) return '';
    const dur = this.sessionDurationMinutes;
    if (dur <= 0) return '';
    const durH = dur / 60;
    const maxSessions = Math.floor(student.remaining_quota_hours / durH);
    let info = `Kuota tersisa: ${student.remaining_quota_hours} jam → maks ${maxSessions} sesi (${durH} jam/sesi)`;
    const planned = this.plannedSessionsCount;
    if (planned > 0) {
      info += ` | Direncanakan: ${planned} sesi (${planned * durH} jam)`;
      if (planned > maxSessions) info += ` — MELEBIHI KUOTA!`;
    }
    return info;
  }

  submitForm() {
    if (!this.planForm.student_id) { this.formError = 'Pilih murid'; return; }
    if (!this.planForm.start_time || !this.planForm.end_time) { this.formError = 'Waktu wajib diisi'; return; }

    this.saving = true;
    this.formError = '';

    if (this.editingPlan) {
      this.api.adminUpdateLearningPlan(this.editingPlan.id, this.planForm).subscribe({
        next: () => { this.saving = false; this.closeModal(); this.loadPlans(); this.showSuccess('Jadwal berhasil diperbarui'); },
        error: (e: any) => { this.saving = false; this.formError = e.error?.error || 'Gagal menyimpan'; }
      });
    } else if (this.createMode === 'single') {
      if (!this.planForm.scheduled_date) { this.saving = false; this.formError = 'Tanggal wajib diisi'; return; }
      this.api.adminCreateLearningPlan(this.planForm).subscribe({
        next: () => { this.saving = false; this.closeModal(); this.loadPlans(); this.showSuccess('Jadwal berhasil dibuat'); },
        error: (e: any) => { this.saving = false; this.formError = e.error?.error || 'Gagal menyimpan'; }
      });
    } else {
      if (!this.selectedDays.length) { this.saving = false; this.formError = 'Pilih minimal satu hari'; return; }
      if (!this.bulkFrom || !this.bulkTo) { this.saving = false; this.formError = 'Rentang tanggal wajib diisi'; return; }
      this.api.adminBulkCreateLearningPlan({
        student_id: this.planForm.student_id,
        days_of_week: this.selectedDays,
        start_time: this.planForm.start_time,
        end_time: this.planForm.end_time,
        from_date: this.bulkFrom,
        to_date: this.bulkTo,
        force: this.forceCreate
      }).subscribe({
        next: (r: any) => {
          this.saving = false;
          this.closeModal();
          this.loadPlans();
          let msg = `${r.created} jadwal berhasil dibuat`;
          if (r.quota_limited > 0) msg += ` (${r.quota_limited} dibatasi karena kuota habis)`;
          this.showSuccess(msg);
        },
        error: (e: any) => {
          this.saving = false;
          if (e.status === 409) {
            this.conflictWarning = `${e.error?.error} (${e.error?.conflicts?.length} bentrok, ${e.error?.would_create} baru)`;
            this.forceCreate = false;
          } else {
            this.formError = e.error?.error || 'Gagal menyimpan';
          }
        }
      });
    }
  }

  deletePlan(p: any) {
    if (!confirm('Hapus jadwal ini?')) return;
    this.api.adminDeleteLearningPlan(p.id).subscribe({
      next: () => { this.loadPlans(); this.showSuccess('Jadwal dihapus'); },
      error: (e: any) => alert(e.error?.error || 'Gagal menghapus')
    });
  }

  getInstructorName(id: number): string {
    const inst = this.instructors.find((i: any) => i.id === id);
    return inst ? (inst.full_name || inst.username) : '-';
  }

  getInstructorNameById(id: number): string { return this.getInstructorName(id); }

  formatDate(d: string): string {
    if (!d) return '';
    const date = new Date(d);
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`;
  }

  statusClass(s: string): string {
    if (s === 'completed') return 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium';
    if (s === 'cancelled') return 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium';
    return 'bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium';
  }

  statusLabel(s: string): string {
    if (s === 'completed') return 'Selesai';
    if (s === 'cancelled') return 'Dibatalkan';
    return 'Direncanakan';
  }

  showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => this.successMsg = '', 3000);
  }

  goBack() { this.router.navigate(['/admin']); }
}
