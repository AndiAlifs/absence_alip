import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-student-management',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-100 py-8 px-4">
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h1 class="text-3xl font-bold text-slate-900">Manajemen Murid</h1>
          <p class="text-slate-600 mt-1">Tambah murid baru dan kelola sisa kuota belajar.</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Tambah Murid</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input [(ngModel)]="newStudent.name" placeholder="Nama murid" class="border border-slate-300 rounded-lg px-3 py-2" />
            <input [(ngModel)]="newStudent.total_quota_hours" type="number" min="0.1" step="0.1" placeholder="Kuota awal (jam)" class="border border-slate-300 rounded-lg px-3 py-2" />
            <button (click)="createStudent()" [disabled]="isSubmitting" class="rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-slate-400">
              {{ isSubmitting ? 'Menyimpan...' : 'Tambah Murid' }}
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Daftar Murid</h2>
          <div class="overflow-x-auto" *ngIf="students.length > 0">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Nama</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Kuota Total</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Sisa Kuota</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr *ngFor="let s of students">
                  <td class="px-4 py-3 text-sm text-slate-800">{{ s.name }}</td>
                  <td class="px-4 py-3 text-sm text-slate-800">{{ s.total_quota_hours }} jam</td>
                  <td class="px-4 py-3 text-sm font-semibold text-emerald-700">{{ s.remaining_quota_hours }} jam</td>
                  <td class="px-4 py-3">
                    <button (click)="adjustQuota(s)" class="px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600">Adjust Quota</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p *ngIf="students.length === 0" class="text-slate-500">Belum ada murid.</p>
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
  isSubmitting = false;
  message = '';
  error = '';

  newStudent = {
    name: '',
    total_quota_hours: 1
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.apiService.getInstructorStudents().subscribe({
      next: (res) => {
        this.students = res.data || [];
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal mengambil data murid';
      }
    });
  }

  createStudent(): void {
    if (!this.newStudent.name || this.newStudent.total_quota_hours <= 0) {
      this.error = 'Nama dan kuota awal harus valid';
      return;
    }

    this.error = '';
    this.message = '';
    this.isSubmitting = true;

    this.apiService.createStudent(this.newStudent).subscribe({
      next: (res) => {
        this.message = res.message || 'Murid berhasil dibuat';
        this.newStudent = { name: '', total_quota_hours: 1 };
        this.loadStudents();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal membuat murid';
        this.isSubmitting = false;
      }
    });
  }

  adjustQuota(student: any): void {
    const current = Number(student.remaining_quota_hours || 0);
    const input = window.prompt(`Sisa kuota baru untuk ${student.name} (jam):`, String(current));
    if (input === null) {
      return;
    }

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
}
