import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-students',
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
            <h1 class="text-3xl font-bold text-gray-900">Manajemen Murid</h1>
            <p class="text-gray-600 mt-1">Kelola data murid dan penugasan instruktur</p>
          </div>
          <button (click)="openCreate()" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Tambah Murid
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
          <input [(ngModel)]="searchQ" (ngModelChange)="loadStudents()" placeholder="Cari nama / WhatsApp..."
            class="border rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <select [(ngModel)]="filterInstructor" (ngModelChange)="loadStudents()" class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Semua Instruktur</option>
            <option *ngFor="let inst of instructors" [value]="inst.id">{{inst.full_name || inst.username}}</option>
          </select>
          <select [(ngModel)]="filterActive" (ngModelChange)="loadStudents()" class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Alumni</option>
          </select>
          <span class="ml-auto text-sm text-gray-500">{{students.length}} murid</span>
        </div>

        <!-- Students Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Nama</th>
                <th class="px-4 py-3 text-left">WhatsApp</th>
                <th class="px-4 py-3 text-left">Instruktur</th>
                <th class="px-4 py-3 text-right">Total Jam</th>
                <th class="px-4 py-3 text-right">Sisa Jam</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of students" class="border-t hover:bg-gray-50">
                <td class="px-4 py-3 font-medium">{{s.name}}</td>
                <td class="px-4 py-3 text-gray-600">{{s.whatsapp}}</td>
                <td class="px-4 py-3 text-gray-600">{{s.instructor?.full_name || s.instructor?.username || '-'}}</td>
                <td class="px-4 py-3 text-right">{{s.total_quota_hours}} jam</td>
                <td class="px-4 py-3 text-right" [class.text-red-600]="s.remaining_quota_hours <= 0" [class.font-semibold]="s.remaining_quota_hours <= 0">
                  {{s.remaining_quota_hours}} jam
                </td>
                <td class="px-4 py-3 text-center">
                  <span [class]="s.is_active ? 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium' : 'bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium'">
                    {{s.is_active ? 'Aktif' : 'Alumni'}}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center gap-1">
                    <button (click)="openEdit(s)" title="Edit" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button (click)="openQuota(s)" title="Sesuaikan Kuota" class="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </button>
                    <button (click)="openReassign(s)" title="Pindah Instruktur" class="p-1.5 text-purple-600 hover:bg-purple-50 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    </button>
                    <button (click)="archiveStudent(s)" [title]="s.is_active ? 'Arsipkan' : 'Aktifkan'" class="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="students.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-gray-400">Belum ada data murid</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Create / Edit Modal -->
        <div *ngIf="showCreateModal || showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <h2 class="text-xl font-bold mb-4">{{showCreateModal ? 'Tambah Murid Baru' : 'Edit Murid'}}</h2>
              <div *ngIf="formError" class="mb-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{{formError}}</div>

              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                  <input [(ngModel)]="form.name" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Nama lengkap murid"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Instruktur *</label>
                  <select [(ngModel)]="form.instructor_id" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none">
                    <option [ngValue]="0">-- Pilih Instruktur --</option>
                    <option *ngFor="let inst of instructors" [ngValue]="inst.id">{{inst.full_name || inst.username}}</option>
                  </select>
                </div>
                <div *ngIf="showCreateModal">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Total Jam Kuota *</label>
                  <div class="flex gap-2 mb-2">
                    <button *ngFor="let p of quotaPresets" (click)="form.total_quota_hours = p"
                      [class]="form.total_quota_hours === p ? 'px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium' : 'px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50'">
                      {{p}} jam
                    </button>
                  </div>
                  <input type="number" [(ngModel)]="form.total_quota_hours" min="1" step="0.5"
                    class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Atau masukkan manual"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
                  <input [(ngModel)]="form.whatsapp" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="08xxxx atau 62xxxx"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select [(ngModel)]="form.gender" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none">
                    <option value="">-- Pilih --</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Meeting Point</label>
                  <input [(ngModel)]="form.meeting_point" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Lokasi pertemuan"/>
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button (click)="closeModals()" class="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50">Batal</button>
                <button (click)="submitForm()" [disabled]="saving"
                  class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                  {{saving ? 'Menyimpan...' : 'Simpan'}}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quota Modal -->
        <div *ngIf="showQuotaModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div class="p-6">
              <h2 class="text-xl font-bold mb-1">Sesuaikan Kuota</h2>
              <p class="text-gray-500 text-sm mb-4">{{selectedStudent?.name}}</p>
              <div *ngIf="formError" class="mb-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{{formError}}</div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sisa Jam Kuota</label>
              <input type="number" [(ngModel)]="quotaValue" min="0" step="0.5"
                class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none mb-4"/>
              <div class="flex gap-3">
                <button (click)="closeModals()" class="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50">Batal</button>
                <button (click)="submitQuota()" [disabled]="saving"
                  class="flex-1 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-60">
                  {{saving ? 'Menyimpan...' : 'Simpan'}}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Reassign Modal -->
        <div *ngIf="showReassignModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div class="p-6">
              <h2 class="text-xl font-bold mb-1">Pindah Instruktur</h2>
              <p class="text-gray-500 text-sm mb-4">{{selectedStudent?.name}}</p>
              <div *ngIf="formError" class="mb-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{{formError}}</div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Instruktur Baru *</label>
              <select [(ngModel)]="reassignInstructorId" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none mb-4">
                <option [ngValue]="0">-- Pilih Instruktur --</option>
                <option *ngFor="let inst of instructors" [ngValue]="inst.id">{{inst.full_name || inst.username}}</option>
              </select>
              <p class="text-xs text-gray-400 mb-4">Jadwal yang sudah direncanakan akan otomatis dipindahkan ke instruktur baru.</p>
              <div class="flex gap-3">
                <button (click)="closeModals()" class="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50">Batal</button>
                <button (click)="submitReassign()" [disabled]="saving"
                  class="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-60">
                  {{saving ? 'Memindahkan...' : 'Pindahkan'}}
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
export class AdminStudentsComponent implements OnInit {
  students: any[] = [];
  instructors: any[] = [];
  quotaPresets: number[] = [8, 10];

  filterInstructor = '';
  filterActive = '';
  searchQ = '';

  showCreateModal = false;
  showEditModal = false;
  showQuotaModal = false;
  showReassignModal = false;

  selectedStudent: any = null;
  form: any = { name: '', instructor_id: 0, total_quota_hours: 0, whatsapp: '', gender: '', meeting_point: '' };
  quotaValue = 0;
  reassignInstructorId = 0;

  formError = '';
  successMsg = '';
  saving = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadInstructors();
    this.loadStudents();
    this.loadQuotaPresets();
  }

  loadInstructors() {
    this.api.adminListInstructors().subscribe({ next: (r: any) => this.instructors = r.data || [] });
  }

  loadStudents() {
    const params: any = {};
    if (this.filterInstructor) params.instructor_id = +this.filterInstructor;
    if (this.filterActive !== '') params.is_active = this.filterActive === 'true';
    if (this.searchQ) params.q = this.searchQ;
    this.api.adminListStudents(params).subscribe({ next: (r: any) => this.students = r.data || [] });
  }

  loadQuotaPresets() {
    this.api.getQuotaPresets().subscribe({
      next: (r: any) => { this.quotaPresets = (r.presets || []).map((p: string) => +p).filter((p: number) => !isNaN(p)); }
    });
  }

  openCreate() {
    this.form = { name: '', instructor_id: 0, total_quota_hours: 0, whatsapp: '', gender: '', meeting_point: '' };
    this.formError = '';
    this.showCreateModal = true;
  }

  openEdit(s: any) {
    this.selectedStudent = s;
    this.form = { name: s.name, instructor_id: s.instructor_id, whatsapp: s.whatsapp, gender: s.gender, meeting_point: s.meeting_point || '' };
    this.formError = '';
    this.showEditModal = true;
  }

  openQuota(s: any) {
    this.selectedStudent = s;
    this.quotaValue = s.remaining_quota_hours;
    this.formError = '';
    this.showQuotaModal = true;
  }

  openReassign(s: any) {
    this.selectedStudent = s;
    this.reassignInstructorId = s.instructor_id;
    this.formError = '';
    this.showReassignModal = true;
  }

  closeModals() {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showQuotaModal = false;
    this.showReassignModal = false;
    this.formError = '';
  }

  submitForm() {
    if (!this.form.name) { this.formError = 'Nama wajib diisi'; return; }
    if (!this.form.instructor_id) { this.formError = 'Instruktur wajib dipilih'; return; }
    if (!this.form.gender) { this.formError = 'Gender wajib dipilih'; return; }
    if (!this.form.whatsapp) { this.formError = 'WhatsApp wajib diisi'; return; }
    if (this.showCreateModal && (!this.form.total_quota_hours || this.form.total_quota_hours <= 0)) {
      this.formError = 'Total jam kuota harus lebih dari 0'; return;
    }

    this.saving = true;
    this.formError = '';

    if (this.showCreateModal) {
      this.api.adminCreateStudent(this.form).subscribe({
        next: () => { this.saving = false; this.closeModals(); this.loadStudents(); this.showSuccess('Murid berhasil ditambahkan'); },
        error: (e: any) => { this.saving = false; this.formError = e.error?.error || 'Gagal menyimpan'; }
      });
    } else {
      this.api.adminUpdateStudent(this.selectedStudent.id, this.form).subscribe({
        next: () => { this.saving = false; this.closeModals(); this.loadStudents(); this.showSuccess('Data murid berhasil diperbarui'); },
        error: (e: any) => { this.saving = false; this.formError = e.error?.error || 'Gagal menyimpan'; }
      });
    }
  }

  submitQuota() {
    if (this.quotaValue < 0) { this.formError = 'Kuota tidak boleh negatif'; return; }
    this.saving = true;
    this.api.adminAdjustQuota(this.selectedStudent.id, this.quotaValue).subscribe({
      next: () => { this.saving = false; this.closeModals(); this.loadStudents(); this.showSuccess('Kuota berhasil diperbarui'); },
      error: (e: any) => { this.saving = false; this.formError = e.error?.error || 'Gagal menyimpan'; }
    });
  }

  submitReassign() {
    if (!this.reassignInstructorId) { this.formError = 'Pilih instruktur tujuan'; return; }
    this.saving = true;
    this.api.adminReassignStudent(this.selectedStudent.id, this.reassignInstructorId).subscribe({
      next: () => { this.saving = false; this.closeModals(); this.loadStudents(); this.showSuccess('Murid berhasil dipindahkan'); },
      error: (e: any) => { this.saving = false; this.formError = e.error?.error || 'Gagal memindahkan'; }
    });
  }

  archiveStudent(s: any) {
    const action = s.is_active ? 'arsipkan' : 'aktifkan kembali';
    if (!confirm(`Yakin ${action} murid "${s.name}"?`)) return;
    this.api.adminArchiveStudent(s.id).subscribe({
      next: () => { this.loadStudents(); this.showSuccess('Status murid berhasil diubah'); },
      error: (e: any) => alert(e.error?.error || 'Gagal mengubah status')
    });
  }

  showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => this.successMsg = '', 3000);
  }

  goBack() { this.router.navigate(['/admin']); }
}
