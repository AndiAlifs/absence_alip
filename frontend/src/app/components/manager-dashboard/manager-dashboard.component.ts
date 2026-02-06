import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8 flex justify-between items-start">
          <div>
            <h1 class="text-4xl font-bold text-gray-900">Dashboard Manajer</h1>
            <p class="mt-2 text-gray-600">Kelola lokasi kantor, karyawan, dan lihat catatan absensi</p>
          </div>
          <div class="flex gap-3">
            <button 
              (click)="goToReports()" 
              class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all shadow-lg flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              📋 Laporan Absensi
            </button>
            <button 
              (click)="goToOfficeManagement()" 
              class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition-all shadow-lg flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              🏢 Kelola Kantor ({{officeCount}})
            </button>
          </div>
        </div>

        <!-- Daily Attendance Dashboard Section -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard Absensi Hari Ini
          </h2>

          <!-- Summary Cards -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p class="text-xs text-gray-600 mb-1">Total Karyawan</p>
              <p class="text-2xl font-bold text-blue-700">{{ dailySummary.total }}</p>
            </div>
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <p class="text-xs text-gray-600 mb-1">Tepat Waktu</p>
              <p class="text-2xl font-bold text-green-700">{{ dailySummary.present_ontime }}</p>
            </div>
            <div class="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
              <p class="text-xs text-gray-600 mb-1">Terlambat</p>
              <p class="text-2xl font-bold text-orange-700">{{ dailySummary.present_late }}</p>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <p class="text-xs text-gray-600 mb-1">Cuti</p>
              <p class="text-2xl font-bold text-purple-700">{{ dailySummary.on_leave }}</p>
            </div>
            <div class="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-lg border border-red-200">
              <p class="text-xs text-gray-600 mb-1">Tidak Hadir</p>
              <p class="text-2xl font-bold text-red-700">{{ dailySummary.absent }}</p>
            </div>
          </div>

          <!-- Daily Attendance Table -->
          <div *ngIf="dailyAttendance.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Waktu Clock-In</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Keterangan</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let emp of dailyAttendance" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p class="text-sm font-medium text-gray-900">{{ emp.full_name || emp.username }}</p>
                    <p *ngIf="emp.full_name" class="text-xs text-gray-500">{{ emp.username }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span *ngIf="emp.status === 'present_ontime'" class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Hadir - Tepat Waktu
                    </span>
                    <span *ngIf="emp.status === 'present_late'" class="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      Hadir - Terlambat
                    </span>
                    <span *ngIf="emp.status === 'on_leave'" class="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Cuti
                    </span>
                    <span *ngIf="emp.status === 'absent'" class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Tidak Hadir
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ emp.clock_in_time ? (emp.clock_in_time | date:'HH:mm') : '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span *ngIf="emp.status === 'present_late'">Terlambat {{ emp.minutes_late }} menit</span>
                    <span *ngIf="emp.status === 'on_leave'">{{ emp.leave_reason }} ({{ emp.leave_status }})</span>
                    <span *ngIf="emp.status === 'present_ontime' || emp.status === 'absent'">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="dailyAttendance.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p class="mt-2 text-gray-600">Tidak ada data absensi.</p>
          </div>
        </div>


        <!-- Employees Section -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 flex items-center cursor-pointer" (click)="toggleEmployees()">
              <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manajemen Karyawan
              <svg class="h-5 w-5 text-gray-500 ml-2 transition-transform duration-200" [class.rotate-180]="!isEmployeesExpanded" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </h2>
            <button 
              (click)="openAddEmployeeModal()" 
              type="button"
              class="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-lg">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Karyawan
            </button>
          </div>
          
          <div *ngIf="isEmployeesExpanded" class="transition-all duration-200">
          <div *ngIf="employees.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Lengkap</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Pengguna</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Peran</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let employee of employees" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ employee.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ employee.full_name || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ employee.username }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="employee.role === 'manager' ? 'px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800' : 'px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'">
                      {{ employee.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      (click)="openEditEmployeeModal(employee)"
                      class="inline-flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      (click)="confirmDeleteEmployee(employee)"
                      class="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Hapus
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="employees.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p class="mt-2 text-gray-600">Tidak ada karyawan ditemukan.</p>
          </div>
          </div>
        </div>

        <!-- Add/Edit Employee Modal -->
        <div *ngIf="showEmployeeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">{{ editingEmployee ? 'Edit Karyawan' : 'Tambah Karyawan Baru' }}</h3>
            
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input 
                  [(ngModel)]="employeeForm.full_name" 
                  name="full_name"
                  type="text" 
                  placeholder="Masukkan nama lengkap"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Pengguna</label>
                <input 
                  [(ngModel)]="employeeForm.username" 
                  name="username"
                  type="text" 
                  placeholder="Masukkan username"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Password {{ editingEmployee ? '(kosongkan jika tidak ingin mengubah)' : '' }}
                </label>
                <input 
                  [(ngModel)]="employeeForm.password" 
                  name="password"
                  type="password" 
                  [placeholder]="editingEmployee ? 'Masukkan password baru (opsional)' : 'Masukkan password (min. 6 karakter)'"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Peran</label>
                <select 
                  [(ngModel)]="employeeForm.role" 
                  name="role"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div *ngIf="employeeModalError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-800">{{ employeeModalError }}</p>
              </div>

              <div *ngIf="employeeModalSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm text-green-800">{{ employeeModalSuccess }}</p>
              </div>

              <div class="flex gap-3 pt-4">
                <button 
                  (click)="closeEmployeeModal()" 
                  type="button"
                  class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all">
                  Batal
                </button>
                <button 
                  (click)="saveEmployee()" 
                  type="button"
                  [disabled]="isSavingEmployee"
                  class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isSavingEmployee ? 'Menyimpan...' : 'Simpan' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div *ngIf="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Konfirmasi Hapus</h3>
              <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus karyawan <strong>{{ employeeToDelete?.username }}</strong>? Tindakan ini tidak dapat dibatalkan.</p>

              <div *ngIf="deleteError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-800">{{ deleteError }}</p>
              </div>

              <div class="flex gap-3">
                <button 
                  (click)="closeDeleteModal()" 
                  type="button"
                  class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all">
                  Batal
                </button>
                <button 
                  (click)="deleteEmployee()" 
                  type="button"
                  [disabled]="isDeletingEmployee"
                  class="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isDeletingEmployee ? 'Menghapus...' : 'Hapus' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Clock-ins Section -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between cursor-pointer" (click)="togglePendingClockIns()">
            <div class="flex items-center">
              <svg class="h-6 w-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Absensi Menunggu Persetujuan
            </div>
            <svg class="h-5 w-5 text-gray-500 transition-transform duration-200" [class.rotate-180]="!isPendingClockInsExpanded" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </h2>

          <div *ngIf="isPendingClockInsExpanded" class="transition-all duration-200"><div *ngIf="pendingClockIns.length > 0" class="space-y-4">
            <div *ngFor="let clockIn of pendingClockIns" class="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded-lg p-6 shadow-md">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-600 mb-1">Karyawan</p>
                  <p class="font-bold text-gray-900">{{ clockIn.user?.full_name || clockIn.user?.username }}</p>
                  <p *ngIf="clockIn.user?.full_name" class="text-xs text-gray-500">{{ clockIn.user?.username }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Waktu Clock-in</p>
                  <p class="font-semibold text-gray-900">{{ clockIn.clock_in_time | date:'medium' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Lokasi</p>
                  <p class="font-semibold text-gray-900">{{ clockIn.latitude }}, {{ clockIn.longitude }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 mb-1">Jarak dari Kantor</p>
                  <p class="font-semibold text-orange-700">{{ clockIn.distance?.toFixed(2) }} meter</p>
                </div>
              </div>

              <div class="rounded-lg overflow-hidden shadow-md mb-4">
                <iframe 
                  [src]="getClockInMapEmbed(clockIn.latitude, clockIn.longitude)" 
                  width="100%" 
                  height="250" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy">
                </iframe>
              </div>

              <div class="flex gap-3">
                <button 
                  (click)="approveClockIn(clockIn.id)"
                  [disabled]="processingClockIn === clockIn.id"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ processingClockIn === clockIn.id ? 'Menyetujui...' : 'Setujui' }}
                </button>
                <button 
                  (click)="rejectClockIn(clockIn.id)"
                  [disabled]="processingClockIn === clockIn.id"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ processingClockIn === clockIn.id ? 'Menolak...' : 'Tolak' }}
                </button>
              </div>

              <div *ngIf="clockInMessage[clockIn.id]" class="mt-3 p-3 rounded-lg" 
                   [class.bg-green-100]="!clockInError[clockIn.id]"
                   [class.bg-red-100]="clockInError[clockIn.id]">
                <p class="text-sm" 
                   [class.text-green-800]="!clockInError[clockIn.id]"
                   [class.text-red-800]="clockInError[clockIn.id]">
                  {{ clockInMessage[clockIn.id] }}
                </p>
              </div>
            </div>
          </div>

          <div *ngIf="pendingClockIns.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-2 text-gray-600">Tidak ada absensi yang menunggu persetujuan.</p>
          </div>
          </div>
        </div>

        <!-- Leave Requests Section -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between cursor-pointer" (click)="toggleLeaveRequests()">
            <div class="flex items-center">
              <svg class="h-6 w-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Permohonan Cuti
            </div>
            <svg class="h-5 w-5 text-gray-500 transition-transform duration-200" [class.rotate-180]="!isLeaveRequestsExpanded" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </h2>

          <div *ngIf="isLeaveRequestsExpanded" class="transition-all duration-200">
            <div *ngIf="leaveRequests.length > 0" class="space-y-4">
              <div *ngFor="let leave of leaveRequests" class="border-l-4 rounded-lg p-6 shadow-md transition-all"
                   [ngClass]="{
                     'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-500': leave.status === 'pending',
                     'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500': leave.status === 'approved',
                     'bg-gradient-to-r from-red-50 to-rose-50 border-red-500': leave.status === 'rejected'
                   }">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Karyawan</p>
                    <p class="font-bold text-gray-900">{{ leave.user?.full_name || leave.user?.username || 'Unknown' }}</p>
                    <p *ngIf="leave.user?.full_name" class="text-xs text-gray-500">{{ leave.user?.username }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Status</p>
                    <span [class]="getLeaveStatusClass(leave.status)">
                      {{ getLeaveStatusText(leave.status) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Tanggal Mulai</p>
                    <p class="font-semibold text-gray-900">{{ leave.start_date | date:'dd MMM yyyy' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Tanggal Selesai</p>
                    <p class="font-semibold text-gray-900">{{ leave.end_date | date:'dd MMM yyyy' }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <p class="text-xs text-gray-600 mb-1">Alasan</p>
                    <p class="text-gray-900">{{ leave.reason }}</p>
                  </div>
                </div>

                <div *ngIf="leave.status === 'pending'" class="flex gap-3 mt-4">
                  <button 
                    (click)="approveLeave(leave.id)"
                    [disabled]="processingLeave === leave.id"
                    class="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ processingLeave === leave.id ? 'Menyetujui...' : 'Setujui' }}
                  </button>
                  <button 
                    (click)="rejectLeave(leave.id)"
                    [disabled]="processingLeave === leave.id"
                    class="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ processingLeave === leave.id ? 'Menolak...' : 'Tolak' }}
                  </button>
                </div>

                <div *ngIf="leaveMessage[leave.id]" class="mt-3 p-3 rounded-lg" 
                     [class.bg-green-100]="!leaveError[leave.id]"
                     [class.bg-red-100]="leaveError[leave.id]">
                  <p class="text-sm" 
                     [class.text-green-800]="!leaveError[leave.id]"
                     [class.text-red-800]="leaveError[leave.id]">
                    {{ leaveMessage[leave.id] }}
                  </p>
                </div>
              </div>
            </div>

            <div *ngIf="leaveRequests.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="mt-2 text-gray-600">Tidak ada permohonan cuti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManagerDashboardComponent implements OnInit {
  employees: any[] = [];
  pendingClockIns: any[] = [];
  leaveRequests: any[] = [];
  officeData: any = {
    name: '',
    latitude: null,
    longitude: null,
    allowed_radius_meters: null,
    clock_in_time: '09:00'
  };
  officeLocation: any = null;
  officeMessage = '';
  isOfficeError = false;
  showMapPicker = false;
  isGettingLocation = false;
  locationError = '';
  locationSuccess = '';
  officeCount: number = 0;
  
  // Office selector properties
  offices: any[] = [];
  selectedOfficeId: number | null = null;

  // Employee management properties
  showEmployeeModal = false;
  showDeleteModal = false;
  editingEmployee: any = null;
  employeeToDelete: any = null;
  employeeForm: any = {
    username: '',
    full_name: '',
    password: '',
    role: 'employee'
  };
  employeeModalError = '';
  employeeModalSuccess = '';
  deleteError = '';
  isSavingEmployee = false;
  isDeletingEmployee = false;

  // Clock-in approval properties
  processingClockIn: number | null = null;
  clockInMessage: { [key: number]: string } = {};
  clockInError: { [key: number]: boolean } = {};

  // Leave management properties
  processingLeave: number | null = null;
  leaveMessage: { [key: number]: string } = {};
  leaveError: { [key: number]: boolean } = {};

  // Daily attendance dashboard properties
  dailyAttendance: any[] = [];
  dailySummary: any = {
    total: 0,
    present_ontime: 0,
    present_late: 0,
    on_leave: 0,
    absent: 0
  };

  // Card expansion states (Daily Dashboard is always expanded)
  isOfficeLocationExpanded = true;
  isEmployeesExpanded = true;
  isPendingClockInsExpanded = true;
  isLeaveRequestsExpanded = true;

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    this.loadOfficeLocation();
    this.loadEmployees();
    this.loadPendingClockIns();
    this.loadDailyAttendance();
    this.loadOfficeCount();
    this.loadLeaveRequests();
  }

  // Pending Clock-in Methods
  loadPendingClockIns() {
    this.apiService.getPendingClockIns().subscribe({
      next: (response) => {
        this.pendingClockIns = response.data || [];
      },
      error: (error) => {
        console.error('Failed to load pending clock-ins:', error);
      }
    });
  }

  loadDailyAttendance() {
    this.apiService.getDailyAttendance().subscribe({
      next: (response) => {
        this.dailyAttendance = response.data || [];
        this.dailySummary = response.summary || this.dailySummary;
      },
      error: (error) => {
        console.error('Failed to load daily attendance:', error);
      }
    });
  }

  approveClockIn(id: number) {
    this.processingClockIn = id;
    this.clockInMessage[id] = '';
    this.clockInError[id] = false;

    this.apiService.updateClockInStatus(id, 'approved').subscribe({
      next: (response) => {
        this.processingClockIn = null;
        this.clockInMessage[id] = 'Absensi berhasil disetujui!';
        this.clockInError[id] = false;
        
        setTimeout(() => {
          this.loadPendingClockIns();
          this.loadDailyAttendance();
        }, 1500);
      },
      error: (error) => {
        this.processingClockIn = null;
        this.clockInMessage[id] = error.error?.error || 'Gagal menyetujui absensi';
        this.clockInError[id] = true;
      }
    });
  }

  rejectClockIn(id: number) {
    this.processingClockIn = id;
    this.clockInMessage[id] = '';
    this.clockInError[id] = false;

    this.apiService.updateClockInStatus(id, 'rejected').subscribe({
      next: (response) => {
        this.processingClockIn = null;
        this.clockInMessage[id] = 'Absensi ditolak.';
        this.clockInError[id] = false;
        
        setTimeout(() => {
          this.loadPendingClockIns();
        }, 1500);
      },
      error: (error) => {
        this.processingClockIn = null;
        this.clockInMessage[id] = error.error?.error || 'Gagal menolak absensi';
        this.clockInError[id] = true;
      }
    });
  }

  // Employee Management Methods
  openAddEmployeeModal() {
    this.editingEmployee = null;
    this.employeeForm = {
      username: '',
      full_name: '',
      password: '',
      role: 'employee'
    };
    this.employeeModalError = '';
    this.employeeModalSuccess = '';
    this.showEmployeeModal = true;
  }

  openEditEmployeeModal(employee: any) {
    this.editingEmployee = employee;
    this.employeeForm = {
      username: employee.username,
      full_name: employee.full_name || '',
      password: '',
      role: employee.role
    };
    this.employeeModalError = '';
    this.employeeModalSuccess = '';
    this.showEmployeeModal = true;
  }

  closeEmployeeModal() {
    this.showEmployeeModal = false;
    this.editingEmployee = null;
    this.employeeForm = {
      username: '',
      full_name: '',
      password: '',
      role: 'employee'
    };
    this.employeeModalError = '';
    this.employeeModalSuccess = '';
  }

  saveEmployee() {
    this.employeeModalError = '';
    this.employeeModalSuccess = '';

    // Validation
    if (!this.employeeForm.username) {
      this.employeeModalError = 'Username wajib diisi';
      return;
    }

    if (!this.editingEmployee && !this.employeeForm.password) {
      this.employeeModalError = 'Password wajib diisi untuk karyawan baru';
      return;
    }

    if (this.employeeForm.password && this.employeeForm.password.length < 6) {
      this.employeeModalError = 'Password minimal 6 karakter';
      return;
    }

    this.isSavingEmployee = true;

    const payload: any = {
      username: this.employeeForm.username,
      full_name: this.employeeForm.full_name,
      role: this.employeeForm.role
    };

    if (this.employeeForm.password) {
      payload.password = this.employeeForm.password;
    }

    const request = this.editingEmployee
      ? this.apiService.updateEmployee(this.editingEmployee.id, payload)
      : this.apiService.createEmployeeData(payload);

    request.subscribe({
      next: (response) => {
        this.isSavingEmployee = false;
        this.employeeModalSuccess = this.editingEmployee
          ? 'Karyawan berhasil diperbarui!'
          : 'Karyawan berhasil ditambahkan!';
        
        setTimeout(() => {
          this.closeEmployeeModal();
          this.loadEmployees();
        }, 1500);
      },
      error: (error) => {
        this.isSavingEmployee = false;
        this.employeeModalError = error.error?.error || 'Gagal menyimpan karyawan';
      }
    });
  }

  confirmDeleteEmployee(employee: any) {
    this.employeeToDelete = employee;
    this.deleteError = '';
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    this.deleteError = '';
  }

  deleteEmployee() {
    if (!this.employeeToDelete) return;

    this.isDeletingEmployee = true;
    this.deleteError = '';

    this.apiService.deleteEmployee(this.employeeToDelete.id).subscribe({
      next: (response) => {
        this.isDeletingEmployee = false;
        this.closeDeleteModal();
        this.loadEmployees();
      },
      error: (error) => {
        this.isDeletingEmployee = false;
        this.deleteError = error.error?.error || 'Gagal menghapus karyawan';
      }
    });
  }
  loadEmployees() {
    this.apiService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res.data || [];
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }

  getOfficeMapEmbed(): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${this.officeLocation.latitude},${this.officeLocation.longitude}&output=embed&z=17`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getClockInMapEmbed(lat: number, lng: number): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&output=embed&z=17`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getCurrentLocation(): void {
    this.isGettingLocation = true;
    this.locationError = '';
    this.locationSuccess = '';

    if (!navigator.geolocation) {
      this.locationError = 'Geolokasi tidak didukung oleh browser Anda';
      this.isGettingLocation = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.officeData.latitude = position.coords.latitude;
        this.officeData.longitude = position.coords.longitude;
        this.locationSuccess = 'Lokasi berhasil diambil!';
        this.isGettingLocation = false;
        setTimeout(() => this.locationSuccess = '', 3000);
      },
      (error) => {
        this.isGettingLocation = false;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationError = 'Izin lokasi ditolak';
            break;
          case error.POSITION_UNAVAILABLE:
            this.locationError = 'Informasi lokasi tidak tersedia';
            break;
          case error.TIMEOUT:
            this.locationError = 'Permintaan lokasi waktu habis';
            break;
          default:
            this.locationError = 'Terjadi kesalahan yang tidak diketahui';
            break;
        }
        setTimeout(() => this.locationError = '', 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  toggleMapPicker(): void {
    this.showMapPicker = !this.showMapPicker;
  }

  getPickerMapEmbed(): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${this.officeData.latitude},${this.officeData.longitude}&output=embed&z=15`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  loadOfficeLocation() {
    this.apiService.getOfficeLocation().subscribe({
      next: (res) => {
        if (res.data) {
          this.officeLocation = res.data;
          this.officeData = {
            name: res.data.name,
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            allowed_radius_meters: res.data.allowed_radius_meters,
            clock_in_time: res.data.clock_in_time || '09:00'
          };
        }
      },
      error: (err) => {
        console.log('No office location set yet');
      }
    });
  }

  setOfficeLocation() {
    if (!this.officeData.latitude || !this.officeData.longitude || !this.officeData.allowed_radius_meters) {
      this.officeMessage = 'Mohon isi semua kolom yang diperlukan';
      this.isOfficeError = true;
      return;
    }

    this.apiService.setOfficeLocation(this.officeData).subscribe({
      next: (res) => {
        this.officeMessage = 'Lokasi kantor berhasil disimpan!';
        this.isOfficeError = false;
        this.loadOfficeLocation();
      },
      error: (err) => {
        this.officeMessage = err.error?.error || 'Gagal menyimpan lokasi kantor';
        this.isOfficeError = true;
      }
    });
  }

  // Toggle methods for card expansion
  toggleOfficeLocation() {
    this.isOfficeLocationExpanded = !this.isOfficeLocationExpanded;
  }

  toggleEmployees() {
    this.isEmployeesExpanded = !this.isEmployeesExpanded;
  }

  togglePendingClockIns() {
    this.isPendingClockInsExpanded = !this.isPendingClockInsExpanded;
  }

  toggleLeaveRequests() {
    this.isLeaveRequestsExpanded = !this.isLeaveRequestsExpanded;
  }

  // Leave Management Methods
  loadLeaveRequests() {
    this.apiService.getAllLeaveRequests().subscribe({
      next: (response) => {
        this.leaveRequests = response.data || [];
      },
      error: (error) => {
        console.error('Failed to load leave requests:', error);
      }
    });
  }

  approveLeave(id: number) {
    this.processingLeave = id;
    this.leaveMessage[id] = '';
    this.leaveError[id] = false;

    this.apiService.updateLeaveStatus(id, 'approved').subscribe({
      next: (response) => {
        this.processingLeave = null;
        this.leaveMessage[id] = 'Cuti berhasil disetujui!';
        this.leaveError[id] = false;
        
        setTimeout(() => {
          this.loadLeaveRequests();
          this.loadDailyAttendance();
        }, 1500);
      },
      error: (error) => {
        this.processingLeave = null;
        this.leaveMessage[id] = error.error?.error || 'Gagal menyetujui cuti';
        this.leaveError[id] = true;
      }
    });
  }

  rejectLeave(id: number) {
    this.processingLeave = id;
    this.leaveMessage[id] = '';
    this.leaveError[id] = false;

    this.apiService.updateLeaveStatus(id, 'rejected').subscribe({
      next: (response) => {
        this.processingLeave = null;
        this.leaveMessage[id] = 'Cuti ditolak.';
        this.leaveError[id] = false;
        
        setTimeout(() => {
          this.loadLeaveRequests();
        }, 1500);
      },
      error: (error) => {
        this.processingLeave = null;
        this.leaveMessage[id] = error.error?.error || 'Gagal menolak cuti';
        this.leaveError[id] = true;
      }
    });
  }

  getLeaveStatusClass(status: string): string {
    switch(status) {
      case 'approved': return 'px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
      case 'rejected': return 'px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
      case 'pending': return 'px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
      default: return 'px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
    }
  }

  getLeaveStatusText(status: string): string {
    switch(status) {
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      case 'pending': return 'Menunggu';
      default: return status;
    }
  }

  // Office Management Navigation
  loadOfficeCount() {
    this.apiService.getMyOffices().subscribe({
      next: (response) => {
        this.officeCount = response.count || 0;
        this.offices = response.data || [];
      },
      error: (error) => {
        console.error('Failed to load office count:', error);
      }
    });
  }

  goToOfficeManagement() {
    window.location.href = '/admin/offices';
  }

  goToReports() {
    window.location.href = '/admin/reports';
  }

  // Office Filter Methods
  filterByOffice() {
    // TODO: Implement filtering logic for attendance/employee data by selected office
    console.log('Filter by office:', this.selectedOfficeId);
    // You can reload data filtered by office ID here
  }

  getSelectedOfficeName(): string {
    if (!this.selectedOfficeId) {
      return 'Semua Kantor';
    }
    const office = this.offices.find(o => o.id === this.selectedOfficeId);
    return office ? office.name : 'Semua Kantor';
  }
}
