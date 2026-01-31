import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900">Dashboard Manajer</h1>
          <p class="mt-2 text-gray-600">Kelola lokasi kantor, karyawan, dan lihat catatan absensi</p>
        </div>

        <!-- Office Location Section -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Atur Lokasi Kantor
          </h2>
          
          <div *ngIf="officeLocation" class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-200">
            <p class="text-sm font-semibold text-gray-700 mb-3">Lokasi Kantor Saat Ini:</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p class="text-xs text-gray-600">Nama</p>
                <p class="font-semibold text-gray-900">{{ officeLocation.name || 'Belum diatur' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Koordinat</p>
                <p class="font-semibold text-gray-900">{{ officeLocation.latitude }}, {{ officeLocation.longitude }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Radius yang Diizinkan</p>
                <p class="font-semibold text-gray-900">{{ officeLocation.allowed_radius_meters }} meter</p>
              </div>
            </div>
            <div class="rounded-lg overflow-hidden shadow-md">
              <iframe 
                [src]="getOfficeMapEmbed()" 
                width="100%" 
                height="300" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy">
              </iframe>
            </div>
          </div>

          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lokasi</label>
                <input 
                  [(ngModel)]="officeData.name" 
                  name="name"
                  type="text" 
                  placeholder="Kantor Pusat"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Radius yang Diizinkan (meter)</label>
                <input 
                  [(ngModel)]="officeData.allowed_radius_meters" 
                  name="radius"
                  type="number" 
                  placeholder="100"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input 
                  [(ngModel)]="officeData.latitude" 
                  name="latitude"
                  type="number" 
                  step="any"
                  placeholder="-6.200000"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input 
                  [(ngModel)]="officeData.longitude" 
                  name="longitude"
                  type="number" 
                  step="any"
                  placeholder="106.816666"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>
            </div>

            <div class="flex gap-4">
              <button 
                (click)="getCurrentLocation()" 
                type="button"
                [disabled]="isGettingLocation"
                class="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                <svg *ngIf="!isGettingLocation" class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span *ngIf="isGettingLocation" class="inline-block w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ isGettingLocation ? 'Mengambil Lokasi...' : 'Gunakan Lokasi Saat Ini' }}
              </button>

              <button 
                (click)="toggleMapPicker()" 
                type="button"
                class="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 transition-all shadow-lg">
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {{ showMapPicker ? 'Sembunyikan Peta' : 'Pilih di Peta' }}
              </button>
            </div>

            <div *ngIf="showMapPicker" class="rounded-lg overflow-hidden shadow-md border-2 border-purple-200">
              <iframe 
                [src]="getPickerMapEmbed()" 
                width="100%" 
                height="400" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy">
              </iframe>
              <p class="text-xs text-gray-600 p-3 bg-gray-50">Klik peta di atas lalu salin koordinat ke form</p>
            </div>

            <div *ngIf="locationSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <svg class="h-5 w-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-green-800">{{ locationSuccess }}</p>
            </div>

            <div *ngIf="locationError" class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <svg class="h-5 w-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-800">{{ locationError }}</p>
            </div>

            <button 
              (click)="setOfficeLocation()" 
              type="button"
              class="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-lg">
              Simpan Lokasi Kantor
            </button>

            <div *ngIf="officeMessage" [class]="isOfficeError ? 'p-4 bg-red-50 border border-red-200 rounded-lg' : 'p-4 bg-green-50 border border-green-200 rounded-lg'">
              <p [class]="isOfficeError ? 'text-sm text-red-800' : 'text-sm text-green-800'">{{ officeMessage }}</p>
            </div>
          </form>
        </div>

        <!-- Employees Section -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Semua Karyawan
          </h2>
          
          <div *ngIf="employees.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Pengguna</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Peran</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let employee of employees" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ employee.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ employee.username }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="employee.role === 'manager' ? 'px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800' : 'px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'">
                      {{ employee.role }}
                    </span>
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

        <!-- Attendance Records Section -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Catatan Absensi
          </h2>

          <div *ngIf="records.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID Karyawan</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Pengguna</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Waktu</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Lokasi</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Peta</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <ng-container *ngFor="let record of records">
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.user_id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ record.user?.username || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ record.clock_in_time | date:'medium' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {{ record.latitude }}, {{ record.longitude }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        (click)="toggleMap(record.id)" 
                        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-300 transition-all text-xs font-semibold shadow">
                        {{ selectedMapRecord === record.id ? 'Sembunyikan Peta' : 'Tampilkan Peta' }}
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="selectedMapRecord === record.id" class="bg-gray-50">
                    <td colspan="5" class="px-6 py-4">
                      <div class="rounded-lg overflow-hidden shadow-md">
                        <iframe 
                          [src]="getClockInMapEmbed(record.latitude, record.longitude)" 
                          width="100%" 
                          height="300" 
                          style="border:0;" 
                          allowfullscreen="" 
                          loading="lazy">
                        </iframe>
                      </div>
                    </td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>

          <div *ngIf="records.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p class="mt-2 text-gray-600">Tidak ada catatan absensi ditemukan.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManagerDashboardComponent implements OnInit {
  records: any[] = [];
  employees: any[] = [];
  officeData: any = {
    name: '',
    latitude: null,
    longitude: null,
    allowed_radius_meters: null
  };
  officeLocation: any = null;
  officeMessage = '';
  isOfficeError = false;
  selectedMapRecord: number | null = null;
  showMapPicker = false;
  isGettingLocation = false;
  locationError = '';
  locationSuccess = '';

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadOfficeLocation();
    this.loadRecords();
    this.loadEmployees();
  }

  loadRecords() {
    this.apiService.getAttendanceRecords().subscribe({
      next: (res) => {
        this.records = res.data || [];
      },
      error: (err) => {
        console.error('Error loading records:', err);
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

  toggleMap(recordId: number): void {
    this.selectedMapRecord = this.selectedMapRecord === recordId ? null : recordId;
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
            allowed_radius_meters: res.data.allowed_radius_meters
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
}
