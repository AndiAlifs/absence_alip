import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-clock-in',
  template: `
    <div class="container">
      <h2>Absen Masuk</h2>
      <div *ngIf="loading">Mengambil lokasi...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div *ngIf="location">
        <p>Lintang: {{ location.latitude }}</p>
        <p>Bujur: {{ location.longitude }}</p>
        
        <div class="map-container">
          <h3>Lokasi Anda Saat Ini</h3>
          <iframe 
            [src]="getMapEmbed()" 
            width="100%" 
            height="400" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy">
          </iframe>
        </div>

        <button (click)="submitClockIn()" [disabled]="submitting">
          {{ submitting ? 'Mengirim...' : 'Absen Sekarang' }}
        </button>
      </div>

      <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .map-container { margin: 20px 0; padding: 15px; background: #f0f8ff; border-radius: 4px; }
    .map-container h3 { margin-top: 0; color: #333; }
    .error { color: red; }
    .success { color: green; margin-top: 10px; font-weight: bold; }
    button { padding: 10px 20px; font-size: 16px; cursor: pointer; margin-top: 10px; }
  `]
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
    this.apiService.clockIn(this.location).subscribe({
      next: (res) => {
        this.successMessage = 'Absen berhasil pada ' + new Date().toLocaleTimeString('id-ID');
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
