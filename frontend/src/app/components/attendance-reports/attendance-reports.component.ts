import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-attendance-reports',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-gray-900">📋 Laporan Absensi</h1>
            <p class="mt-2 text-gray-600">Lihat dan analisis catatan absensi karyawan</p>
          </div>
          <button 
            (click)="goToDashboard()" 
            class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all shadow-lg flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </button>
        </div>

        <!-- Filters Section -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter & Pencarian
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Date Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
              <input type="date" [(ngModel)]="filterStartDate" (change)="applyFilters()"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
              <input type="date" [(ngModel)]="filterEndDate" (change)="applyFilters()"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- Office Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kantor</label>
              <select [(ngModel)]="selectedOfficeId" (change)="applyFilters()"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Semua Kantor</option>
                <option *ngFor="let office of offices" [value]="office.id">{{ office.name }}</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select [(ngModel)]="filterStatus" (change)="applyFilters()"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Semua Status</option>
                <option value="approved">Disetujui</option>
                <option value="pending">Menunggu</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>

          <!-- Search & Quick Filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cari Karyawan</label>
              <input type="text" [(ngModel)]="searchQuery" (input)="applyFilters()" 
                     placeholder="Nama atau username..."
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Filter Cepat</label>
              <div class="flex gap-2">
                <button (click)="setQuickFilter('today')" 
                        [class.bg-blue-600]="quickFilter === 'today'"
                        [class.text-white]="quickFilter === 'today'"
                        class="px-3 py-2 border rounded-lg hover:bg-blue-100 transition-all text-sm">
                  Hari Ini
                </button>
                <button (click)="setQuickFilter('week')"
                        [class.bg-blue-600]="quickFilter === 'week'"
                        [class.text-white]="quickFilter === 'week'"
                        class="px-3 py-2 border rounded-lg hover:bg-blue-100 transition-all text-sm">
                  7 Hari
                </button>
                <button (click)="setQuickFilter('month')"
                        [class.bg-blue-600]="quickFilter === 'month'"
                        [class.text-white]="quickFilter === 'month'"
                        class="px-3 py-2 border rounded-lg hover:bg-blue-100 transition-all text-sm">
                  30 Hari
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between items-center mt-4 pt-4 border-t">
            <button (click)="resetFilters()" 
                    class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all">
              Reset Filter
            </button>
            <button (click)="exportToCSV()" 
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <!-- Summary Statistics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p class="text-xs text-gray-600 mb-1">Total Catatan</p>
            <p class="text-2xl font-bold text-blue-700">{{ filteredRecords.length }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p class="text-xs text-gray-600 mb-1">Tepat Waktu</p>
            <p class="text-2xl font-bold text-green-700">{{ getOnTimeCount() }}</p>
            <p class="text-xs text-gray-500">{{ getOnTimePercentage() }}%</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <p class="text-xs text-gray-600 mb-1">Terlambat</p>
            <p class="text-2xl font-bold text-orange-700">{{ getLateCount() }}</p>
            <p class="text-xs text-gray-500">{{ getLatePercentage() }}%</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
            <p class="text-xs text-gray-600 mb-1">Rata-rata Terlambat</p>
            <p class="text-2xl font-bold text-gray-700">{{ getAverageLateMinutes() }}</p>
            <p class="text-xs text-gray-500">menit</p>
          </div>
        </div>

        <!-- Attendance Records Table -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">
              Catatan Absensi 
              <span class="text-sm font-normal text-gray-500">({{ filteredRecords.length }} dari {{ allRecords.length }})</span>
            </h2>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">Tampilkan:</label>
              <select [(ngModel)]="pageSize" (change)="updatePagination()"
                      class="px-3 py-1 border border-gray-300 rounded">
                <option [value]="25">25</option>
                <option [value]="50">50</option>
                <option [value]="100">100</option>
              </select>
            </div>
          </div>

          <div *ngIf="paginatedRecords.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th (click)="sortBy('date')" 
                      class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100">
                    Tanggal
                    <span *ngIf="sortColumn === 'date'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                  </th>
                  <th (click)="sortBy('name')"
                      class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100">
                    Nama Karyawan
                    <span *ngIf="sortColumn === 'name'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                  </th>
                  <th (click)="sortBy('time')"
                      class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100">
                    Jam Masuk
                    <span *ngIf="sortColumn === 'time'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Kantor</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ketepatan</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Jarak</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <ng-container *ngFor="let record of paginatedRecords">
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {{ record.clock_in_time | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <p class="text-sm font-medium text-gray-900">{{ record.user?.full_name || record.user?.username || 'N/A' }}</p>
                      <p *ngIf="record.user?.full_name" class="text-xs text-gray-500">{{ record.user?.username }}</p>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {{ record.clock_in_time | date:'HH:mm' }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {{ getOfficeName(record.approved_office_id) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span *ngIf="record.status === 'approved'" class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ✓ Disetujui
                      </span>
                      <span *ngIf="record.status === 'pending'" class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        ⏳ Menunggu
                      </span>
                      <span *ngIf="record.status === 'rejected'" class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        ✗ Ditolak
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span *ngIf="!record.is_late" class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ✓ Tepat Waktu
                      </span>
                      <span *ngIf="record.is_late" class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        ⚠ Terlambat {{ record.minutes_late }}m
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {{ record.distance?.toFixed(0) || '-' }}m
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm">
                      <button 
                        (click)="toggleDetails(record.id)" 
                        class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all text-xs font-semibold">
                        {{ expandedRecordId === record.id ? 'Tutup' : 'Detail' }}
                      </button>
                    </td>
                  </tr>
                  <!-- Expanded Details Row -->
                  <tr *ngIf="expandedRecordId === record.id" class="bg-gray-50">
                    <td colspan="8" class="px-4 py-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 class="font-semibold text-gray-900 mb-2">Informasi Detail</h4>
                          <div class="space-y-1 text-sm">
                            <p><strong>Koordinat:</strong> {{ record.latitude }}, {{ record.longitude }}</p>
                            <p><strong>Jarak dari Kantor:</strong> {{ record.distance?.toFixed(2) || '-' }} meter</p>
                            <p><strong>Waktu Lengkap:</strong> {{ record.clock_in_time | date:'full' }}</p>
                            <p><strong>ID:</strong> #{{ record.id }}</p>
                          </div>
                        </div>
                        <div>
                          <h4 class="font-semibold text-gray-900 mb-2">Lokasi di Peta</h4>
                          <div class="rounded-lg overflow-hidden shadow-md">
                            <iframe 
                              [src]="getMapEmbed(record.latitude, record.longitude)" 
                              width="100%" 
                              height="200" 
                              style="border:0;" 
                              allowfullscreen="" 
                              loading="lazy">
                            </iframe>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div *ngIf="filteredRecords.length > pageSize" class="mt-6 flex justify-between items-center">
            <p class="text-sm text-gray-600">
              Menampilkan {{ ((currentPage - 1) * pageSize) + 1 }} - {{ Math.min(currentPage * pageSize, filteredRecords.length) }} dari {{ filteredRecords.length }} catatan
            </p>
            <div class="flex gap-2">
              <button [disabled]="currentPage === 1" (click)="previousPage()"
                      class="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                ← Sebelumnya
              </button>
              <span class="px-4 py-2 text-sm text-gray-700">
                Halaman {{ currentPage }} dari {{ totalPages }}
              </span>
              <button [disabled]="currentPage === totalPages" (click)="nextPage()"
                      class="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Berikutnya →
              </button>
            </div>
          </div>

          <!-- No Records -->
          <div *ngIf="paginatedRecords.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="mt-2 text-gray-600">Tidak ada catatan absensi yang sesuai dengan filter.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AttendanceReportsComponent implements OnInit {
  allRecords: any[] = [];
  filteredRecords: any[] = [];
  paginatedRecords: any[] = [];
  offices: any[] = [];
  
  // Filter properties
  filterStartDate: string = '';
  filterEndDate: string = '';
  selectedOfficeId: number | string = '';
  filterStatus: string = '';
  searchQuery: string = '';
  quickFilter: string = 'week';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 25;
  totalPages: number = 1;
  
  // Sorting
  sortColumn: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Expanded details
  expandedRecordId: number | null = null;
  
  // For template access
  Math = Math;

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadOffices();
    this.setQuickFilter('week'); // Default to last 7 days
    this.loadRecords();
  }

  loadOffices() {
    this.apiService.getMyOffices().subscribe({
      next: (response) => {
        this.offices = response.data || [];
      },
      error: (error) => {
        console.error('Failed to load offices:', error);
      }
    });
  }

  loadRecords() {
    this.apiService.getAttendanceRecords().subscribe({
      next: (response) => {
        this.allRecords = response.data || [];
        this.applyFilters();
      },
      error: (error) => {
        console.error('Failed to load records:', error);
      }
    });
  }

  setQuickFilter(filter: string) {
    this.quickFilter = filter;
    const today = new Date();
    const endDate = new Date(today);
    
    switch(filter) {
      case 'today':
        this.filterStartDate = this.formatDate(today);
        this.filterEndDate = this.formatDate(endDate);
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        this.filterStartDate = this.formatDate(weekAgo);
        this.filterEndDate = this.formatDate(endDate);
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        this.filterStartDate = this.formatDate(monthAgo);
        this.filterEndDate = this.formatDate(endDate);
        break;
    }
    this.applyFilters();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  applyFilters() {
    let filtered = [...this.allRecords];
    
    // Date range filter
    if (this.filterStartDate) {
      filtered = filtered.filter(r => {
        const recordDate = new Date(r.clock_in_time);
        const startDate = new Date(this.filterStartDate);
        return recordDate >= startDate;
      });
    }
    
    if (this.filterEndDate) {
      filtered = filtered.filter(r => {
        const recordDate = new Date(r.clock_in_time);
        const endDate = new Date(this.filterEndDate);
        endDate.setHours(23, 59, 59, 999);
        return recordDate <= endDate;
      });
    }
    
    // Office filter
    if (this.selectedOfficeId && this.selectedOfficeId !== '') {
      const officeId = Number(this.selectedOfficeId);
      filtered = filtered.filter(r => r.approved_office_id === officeId);
    }
    
    // Status filter
    if (this.filterStatus) {
      filtered = filtered.filter(r => r.status === this.filterStatus);
    }
    
    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        const name = (r.user?.full_name || r.user?.username || '').toLowerCase();
        return name.includes(query);
      });
    }
    
    this.filteredRecords = filtered;
    this.applySorting();
    this.updatePagination();
  }

  applySorting() {
    this.filteredRecords.sort((a, b) => {
      let comparison = 0;
      
      switch(this.sortColumn) {
        case 'date':
          comparison = new Date(a.clock_in_time).getTime() - new Date(b.clock_in_time).getTime();
          break;
        case 'name':
          const nameA = (a.user?.full_name || a.user?.username || '').toLowerCase();
          const nameB = (b.user?.full_name || b.user?.username || '').toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case 'time':
          comparison = new Date(a.clock_in_time).getTime() - new Date(b.clock_in_time).getTime();
          break;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.applySorting();
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredRecords.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRecords = this.filteredRecords.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  resetFilters() {
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.selectedOfficeId = '';
    this.filterStatus = '';
    this.searchQuery = '';
    this.quickFilter = '';
    this.applyFilters();
  }

  toggleDetails(recordId: number) {
    this.expandedRecordId = this.expandedRecordId === recordId ? null : recordId;
  }

  getOfficeName(officeId: number): string {
    const office = this.offices.find(o => o.id === officeId);
    return office ? office.name : '-';
  }

  getOnTimeCount(): number {
    return this.filteredRecords.filter(r => !r.is_late).length;
  }

  getLateCount(): number {
    return this.filteredRecords.filter(r => r.is_late).length;
  }

  getOnTimePercentage(): string {
    if (this.filteredRecords.length === 0) return '0';
    return ((this.getOnTimeCount() / this.filteredRecords.length) * 100).toFixed(1);
  }

  getLatePercentage(): string {
    if (this.filteredRecords.length === 0) return '0';
    return ((this.getLateCount() / this.filteredRecords.length) * 100).toFixed(1);
  }

  getAverageLateMinutes(): string {
    const lateRecords = this.filteredRecords.filter(r => r.is_late && r.minutes_late);
    if (lateRecords.length === 0) return '0';
    const total = lateRecords.reduce((sum, r) => sum + r.minutes_late, 0);
    return (total / lateRecords.length).toFixed(1);
  }

  exportToCSV() {
    if (this.filteredRecords.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    const headers = ['Tanggal', 'Nama', 'Username', 'Jam Masuk', 'Kantor', 'Status', 'Tepat Waktu', 'Menit Terlambat', 'Jarak (m)', 'Koordinat'];
    const rows = this.filteredRecords.map(r => [
      new Date(r.clock_in_time).toLocaleDateString('id-ID'),
      r.user?.full_name || '',
      r.user?.username || '',
      new Date(r.clock_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      this.getOfficeName(r.approved_office_id),
      r.status,
      r.is_late ? 'Terlambat' : 'Tepat Waktu',
      r.is_late ? r.minutes_late : '0',
      r.distance?.toFixed(2) || '',
      `${r.latitude}, ${r.longitude}`
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const dateRange = `${this.filterStartDate || 'all'}_to_${this.filterEndDate || 'now'}`;
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Absensi_${dateRange}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getMapEmbed(lat: number, lng: number): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&output=embed&z=17`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goToDashboard() {
    window.location.href = '/admin';
  }
}
