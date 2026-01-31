import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-clock-in',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div class="max-w-4xl mx-auto">
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
                <p class="text-lg font-semibold text-gray-900">{{ location?.latitude }}</p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Bujur</p>
                <p class="text-lg font-semibold text-gray-900">{{ location?.longitude }}</p>
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

            <button 
              (click)="submitClockIn()" 
              [disabled]="submitting"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-lg">
              <span *ngIf="!submitting">Absen Sekarang</span>
              <span *ngIf="submitting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
            </button>
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
  `,
  styles: []
})
export class ClockInComponent implements OnInit {
  location: { latitude: number, longitude: number } | null = null;
  loading = false;
  submitting = false;
  error = '';
  successMessage = '';

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.getLocation();
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
        
        this.submitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal melakukan absen.';
        this.submitting = false;
      }
    });
  }

  getMapEmbed(): SafeResourceUrl {
    if (!this.location) return '';
    const url = `https://maps.google.com/maps?q=${this.location.latitude},${this.location.longitude}&output=embed&z=17`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
