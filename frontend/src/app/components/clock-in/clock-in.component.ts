import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-clock-in',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Page Title -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Absensi Karyawan</h1>
        </div>
        
        <!-- Today's Attendance Status Card -->
        <div *ngIf="todayAttendance" class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Status Absensi Hari Ini
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <p class="text-xs text-gray-600 mb-1">Waktu Clock-In</p>
              <p class="text-lg font-semibold text-gray-900">{{ todayAttendance.clock_in_time | date:'HH:mm' }}</p>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg" *ngIf="todayAttendance.clock_out_time">
              <p class="text-xs text-gray-600 mb-1">Waktu Clock-Out</p>
              <p class="text-lg font-semibold text-gray-900">{{ todayAttendance.clock_out_time | date:'HH:mm' }}</p>
            </div>
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <p class="text-xs text-gray-600 mb-1">Status</p>
              <span [class]="todayAttendance.status === 'approved' ? 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800' : todayAttendance.status === 'pending' ? 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800' : 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800'">
                {{ todayAttendance.status === 'approved' ? 'Disetujui' : todayAttendance.status === 'pending' ? 'Menunggu' : 'Ditolak' }}
              </span>
            </div>
            <div [class]="todayAttendance.is_late ? 'bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg' : 'bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg'">
              <p class="text-xs text-gray-600 mb-1">Ketepatan Waktu</p>
              <p [class]="todayAttendance.is_late ? 'text-lg font-semibold text-red-700' : 'text-lg font-semibold text-green-700'">
                {{ todayAttendance.is_late ? 'Terlambat ' + todayAttendance.minutes_late + ' menit' : 'Tepat Waktu' }}
              </p>
            </div>
          </div>
          <div *ngIf="todayAttendance.work_hours !== null && todayAttendance.work_hours !== undefined" class="mt-4 bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border-l-4 border-cyan-500">
            <p class="text-xs text-gray-600 mb-1">Jam Kerja</p>
            <p class="text-2xl font-bold text-cyan-700">{{ todayAttendance.work_hours.toFixed(2) }} jam</p>
          </div>
        </div>

        <div *ngIf="!todayAttendance" class="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 p-4 rounded-lg mb-6">
          <p class="text-sm text-orange-800 font-medium">Anda belum melakukan clock-in hari ini</p>
        </div>

        <!-- Office Locations Information Card -->
        <div *ngIf="officeLocations.length > 0" class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl shadow-xl p-6 mb-6 border-l-4 border-teal-500">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            📍 Lokasi Kantor yang Tersedia ({{officeLocations.length}})
          </h3>
          <p class="text-sm text-gray-600 mb-4">Anda dapat clock-in di salah satu kantor berikut:</p>
          
          <!-- Office Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let office of officeLocations" 
                 class="bg-white rounded-lg shadow-md p-4 border-2"
                 [class.border-green-500]="office.isWithinRange"
                 [class.border-orange-300]="!office.isWithinRange">
              <div class="flex items-start justify-between mb-2">
                <h4 class="text-lg font-bold text-gray-900">{{ office.name }}</h4>
                <span *ngIf="office.isWithinRange" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  ✓ Dalam Jangkauan
                </span>
                <span *ngIf="!office.isWithinRange && office.distance !== undefined" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                  ⚠ Perlu Approval
                </span>
              </div>
              
              <p class="text-xs text-gray-600 mb-3" *ngIf="office.address">{{ office.address }}</p>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Jam Masuk:</span>
                  <span class="font-semibold">{{ office.clock_in_time }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Radius:</span>
                  <span class="font-semibold">{{ office.allowed_radius_meters }}m</span>
                </div>
                <div *ngIf="office.distance !== undefined" class="flex justify-between pt-2 border-t">
                  <span class="text-gray-600">Jarak Anda:</span>
                  <span class="font-semibold" 
                        [class.text-green-700]="office.isWithinRange"
                        [class.text-orange-700]="!office.isWithinRange">
                    {{ office.distance.toFixed(0) }}m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="officeLocations.length === 0" class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-6">
          <p class="text-sm text-orange-800 font-medium">Tidak ada lokasi kantor yang tersedia. Hubungi manajer Anda.</p>
        </div>

        <!-- Today's Leave Status Card -->
        <div *ngIf="todayLeave" class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 mb-6 border-l-4 border-purple-500">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="h-6 w-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Status Cuti Hari Ini
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-lg shadow">
              <p class="text-xs text-gray-600 mb-1">Status Cuti</p>
              <span [class]="todayLeave.status === 'approved' ? 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800' : todayLeave.status === 'pending' ? 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800' : 'inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800'">
                {{ todayLeave.status === 'approved' ? 'Disetujui' : todayLeave.status === 'pending' ? 'Menunggu Persetujuan' : 'Ditolak' }}
              </span>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
              <p class="text-xs text-gray-600 mb-1">Periode Cuti</p>
              <p class="text-sm font-semibold text-gray-900">{{ todayLeave.start_date | date:'dd/MM/yyyy' }} - {{ todayLeave.end_date | date:'dd/MM/yyyy' }}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
              <p class="text-xs text-gray-600 mb-1">Alasan</p>
              <p class="text-sm font-semibold text-gray-900">{{ todayLeave.reason }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Absen Masuk</h2>
          
          <div *ngIf="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Mengambil lokasi...</span>
          </div>
          
          <div *ngIf="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ error }}</p>
              </div>
            </div>
          </div>
          
          <div *ngIf="location" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Lintang</p>
                <p class="text-lg font-semibold text-gray-900">{{ location.latitude }}</p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Bujur</p>
                <p class="text-lg font-semibold text-gray-900">{{ location.longitude }}</p>
              </div>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-xl">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Lokasi Anda Saat Ini
              </h3>
              <div class="rounded-lg overflow-hidden shadow-md">
                <iframe 
                  [src]="getMapEmbed()" 
                  width="100%" 
                  height="400" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy">
                </iframe>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                (click)="checkAndSubmitClockIn()" 
                [disabled]="submitting || todayAttendance"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-lg">
                <span *ngIf="!submitting">{{ todayAttendance ? 'Sudah Clock-In' : 'Clock-In Sekarang' }}</span>
                <span *ngIf="submitting" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </span>
              </button>

              <button 
                (click)="submitClockOut()" 
                [disabled]="submittingClockOut || !todayAttendance || todayAttendance?.clock_out_time"
                class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-lg">
                <span *ngIf="!submittingClockOut">{{ getClockOutButtonText() }}</span>
                <span *ngIf="submittingClockOut" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </span>
              </button>
            </div>
          </div>

          <div *ngIf="successMessage" class="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700 font-medium">{{ successMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div *ngIf="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-orange-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Lokasi Di Luar Semua Kantor</h3>
          <p class="text-gray-600 mb-4">Clock-in di luar semua kantor memerlukan persetujuan manajer.</p>
          
          <!-- Show distances from all offices -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p class="text-sm font-semibold text-gray-700 mb-3">Jarak Anda dari setiap kantor:</p>
            <div class="space-y-2">
              <div *ngFor="let office of officeLocations" class="flex justify-between text-sm">
                <span class="text-gray-600">{{ office.name }}:</span>
                <span class="font-semibold text-orange-700">{{ office.distance?.toFixed(0) }}m (max: {{ office.allowed_radius_meters }}m)</span>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button 
              (click)="cancelClockIn()" 
              type="button"
              class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all">
              Batal
            </button>
            <button 
              (click)="confirmClockIn()" 
              type="button"
              [disabled]="submitting"
              class="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submitting ? 'Mengirim...' : 'Lanjutkan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ClockInComponent implements OnInit {
  location: { latitude: number, longitude: number } | null = null;
  loading = false;
  submitting = false;
  submittingClockOut = false;
  error = '';
  successMessage = '';
  showConfirmation = false;
  distanceFromOffice: number | null = null;
  officeLocation: any = null;
  officeLocations: any[] = [];
  todayAttendance: any = null;
  todayLeave: any = null;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.getLocation();
    this.loadOfficeLocations();
    this.loadTodayAttendance();
    this.loadTodayLeave();
  }

  loadOfficeLocations() {
    this.apiService.getEmployeeOffices().subscribe({
      next: (response) => {
        this.officeLocations = response.data || [];
        // Set first office as default for backward compatibility
        if (this.officeLocations.length > 0) {
          this.officeLocation = this.officeLocations[0];
        }
        // Calculate distances if location is already loaded
        this.calculateDistancesFromOffices();
      },
      error: (error) => {
        console.error('Failed to load office locations:', error);
      }
    });
  }

  loadTodayAttendance() {
    this.apiService.getTodayAttendance().subscribe({
      next: (response) => {
        this.todayAttendance = response.data;
      },
      error: (error) => {
        console.error('Failed to load today attendance:', error);
      }
    });
  }

  loadTodayLeave() {
    this.apiService.getTodayLeave().subscribe({
      next: (response) => {
        this.todayLeave = response.data;
      },
      error: (error) => {
        console.error('Failed to load today leave:', error);
      }
    });
  }

  getLocation() {
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.loading = false;
          // Calculate distances from all offices if loaded
          this.calculateDistancesFromOffices();
        },
        (err) => {
          this.error = 'Gagal mendapatkan lokasi. Silakan aktifkan izin lokasi.';
          this.loading = false;
        }
      );
    } else {
      this.error = 'Geolokasi tidak didukung oleh browser ini.';
      this.loading = false;
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusMeters = 6371000;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const deltaLat = (lat2 - lat1) * Math.PI / 180;
    const deltaLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return earthRadiusMeters * c;
  }

  calculateDistanceFromOffice() {
    if (this.location && this.officeLocation) {
      this.distanceFromOffice = this.calculateDistance(
        this.location.latitude,
        this.location.longitude,
        this.officeLocation.latitude,
        this.officeLocation.longitude
      );
    }
  }

  calculateDistancesFromOffices() {
    if (this.location && this.officeLocations.length > 0) {
      this.officeLocations.forEach(office => {
        office.distance = this.calculateDistance(
          this.location!.latitude,
          this.location!.longitude,
          office.latitude,
          office.longitude
        );
        office.isWithinRange = office.distance <= office.allowed_radius_meters;
      });
      // Also calculate for the default office
      this.calculateDistanceFromOffice();
    }
  }

  checkAndSubmitClockIn() {
    if (!this.location || this.officeLocations.length === 0) {
      this.submitClockIn();
      return;
    }

    // Recalculate distances to ensure they're up to date
    this.calculateDistancesFromOffices();

    // Check if within range of ANY office
    const isWithinAnyOffice = this.officeLocations.some(office => office.isWithinRange);

    if (!isWithinAnyOffice) {
      // Outside all offices - show confirmation
      this.showConfirmation = true;
    } else {
      // Within range of at least one office - proceed
      this.submitClockIn();
    }
  }

  confirmClockIn() {
    this.showConfirmation = false;
    this.submitClockIn();
  }

  cancelClockIn() {
    this.showConfirmation = false;
  }

  submitClockIn() {
    if (!this.location) return;

    this.submitting = true;
    this.error = '';
    this.successMessage = '';
    
    this.apiService.clockIn(this.location).subscribe({
      next: (res) => {
        const status = res.status || res.data?.status;
        const needsApproval = res.needs_approval;
        
        if (needsApproval || status === 'pending') {
          this.successMessage = res.message || 'Clock-in dicatat. Menunggu persetujuan manajer karena lokasi terlalu jauh dari kantor.';
        } else {
          this.successMessage = res.message || 'Absen berhasil pada ' + new Date().toLocaleTimeString('id-ID');
        }
        
        // Reload today's attendance to show updated status
        this.loadTodayAttendance();
        this.submitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal melakukan absen.';
        this.submitting = false;
      }
    });
  }

  submitClockOut() {
    if (!this.location) {
      this.error = 'Lokasi belum tersedia. Silakan muat ulang halaman.';
      return;
    }

    this.submittingClockOut = true;
    this.error = '';
    this.successMessage = '';
    
    this.apiService.clockOut(this.location).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Clock-out berhasil pada ' + new Date().toLocaleTimeString('id-ID');
        if (res.work_hours) {
          this.successMessage += '. Total jam kerja: ' + res.work_hours + ' jam';
        }
        
        // Reload today's attendance to show updated status
        this.loadTodayAttendance();
        this.submittingClockOut = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal melakukan clock-out.';
        this.submittingClockOut = false;
      }
    });
  }

  getClockOutButtonText(): string {
    if (this.todayAttendance?.clock_out_time) {
      return 'Sudah Clock-Out';
    }
    if (!this.todayAttendance) {
      return 'Clock-In Terlebih Dahulu';
    }
    return 'Clock-Out Sekarang';
  }

  getMapEmbed(): SafeResourceUrl {
    if (!this.location) return '';
    const url = `https://maps.google.com/maps?q=${this.location.latitude},${this.location.longitude}&output=embed&z=17`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
