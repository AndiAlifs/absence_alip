import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <div class="container">
      <h2>Dashboard Manajer</h2>

      <div class="add-employee-section">
        <h3>Atur Lokasi Kantor</h3>
        <div *ngIf="officeLocation" class="current-location">
          <p><strong>Lokasi Kantor Saat Ini:</strong></p>
          <p>Nama: {{ officeLocation.name || 'Belum diatur' }}</p>
          <p>Koordinat: {{ officeLocation.latitude }}, {{ officeLocation.longitude }}</p>
          <p>Radius yang Diizinkan: {{ officeLocation.allowed_radius_meters }} meter</p>
          <div class="map-container">
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
        <div class="form-group">
          <label>Nama Kantor: </label>
          <input [(ngModel)]="officeData.name" placeholder="contoh: Kantor Pusat" />
        </div>
        <div class="gps-picker-section">
          <button class="gps-btn" (click)="getCurrentLocation()" [disabled]="isGettingLocation">
            {{ isGettingLocation ? 'Mengambil Lokasi...' : '📍 Gunakan Lokasi Saat Ini' }}
          </button>
          <span *ngIf="locationError" class="error">{{ locationError }}</span>
          <span *ngIf="locationSuccess" class="success">{{ locationSuccess }}</span>
        </div>
        <div class="form-group">
          <label>Lintang: </label>
          <input [(ngModel)]="officeData.latitude" type="number" step="0.000001" placeholder="contoh: -6.200000" />
        </div>
        <div class="form-group">
          <label>Bujur: </label>
          <input [(ngModel)]="officeData.longitude" type="number" step="0.000001" placeholder="contoh: 106.816666" />
        </div>
        <div class="form-group">
          <button class="preview-btn" (click)="toggleMapPicker()" type="button">
            {{ showMapPicker ? 'Sembunyikan Pemilih Peta' : '🗺️ Pilih Lokasi di Peta' }}
          </button>
        </div>
        <div *ngIf="showMapPicker && officeData.latitude && officeData.longitude" class="map-picker">
          <p><small>Klik pada peta untuk memilih lokasi baru, atau seret penanda</small></p>
          <div class="map-container">
            <iframe 
              [src]="getPickerMapEmbed()" 
              width="100%" 
              height="400" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy">
            </iframe>
          </div>
          <p class="map-note"><small>Catatan: Setelah memilih lokasi di peta, salin koordinat dari URL atau penanda dan tempelkan di kolom di atas.</small></p>
        </div>
        <div class="form-group">
          <label>Radius yang Diizinkan (meter): </label>
          <input [(ngModel)]="officeData.allowed_radius_meters" type="number" placeholder="contoh: 100" />
        </div>
        <button (click)="setOfficeLocation()">Simpan Lokasi Kantor</button>
        <p *ngIf="officeMessage" [class.error]="isOfficeError" [class.success]="!isOfficeError">{{ officeMessage }}</p>
      </div>

      <hr />

      <div class="add-employee-section">
        <h3>Tambah Karyawan Baru</h3>
        <div class="form-group">
          <label>Nama Pengguna: </label>
          <input [(ngModel)]="newUser.username" placeholder="Nama Pengguna" />
        </div>
        <div class="form-group">
          <label>Kata Sandi: </label>
          <input [(ngModel)]="newUser.password" type="password" placeholder="Kata Sandi" />
        </div>
        <button (click)="createEmployee()">Buat Karyawan</button>
        <p *ngIf="message" [class.error]="isError" [class.success]="!isError">{{ message }}</p>
      </div>

      <hr />

      <h3>Semua Karyawan</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Pengguna</th>
            <th>Peran</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let employee of employees">
            <td>{{ employee.id }}</td>
            <td>{{ employee.username }}</td>
            <td>{{ employee.role }}</td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="employees.length === 0">Tidak ada karyawan ditemukan.</div>

      <hr />

      <h3>Catatan Absensi</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>ID Karyawan</th>
            <th>Nama Pengguna</th>
            <th>Waktu</th>
            <th>Lokasi</th>
            <th>Tampilan Peta</th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngFor="let record of records">
            <tr>
              <td>{{ record.user_id }}</td>
              <td>{{ record.user?.username || 'N/A' }}</td>
              <td>{{ record.clock_in_time | date:'medium' }}</td>
              <td>
                {{ record.latitude }}, {{ record.longitude }}
              </td>
              <td>
                <button class="map-toggle-btn" (click)="toggleMap(record.id)">
                  {{ selectedMapRecord === record.id ? 'Sembunyikan Peta' : 'Tampilkan Peta' }}
                </button>
              </td>
            </tr>
            <tr *ngIf="selectedMapRecord === record.id" class="map-row">
              <td colspan="5">
                <div class="map-container">
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
      <div *ngIf="records.length === 0">Tidak ada catatan absensi ditemukan.</div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .add-employee-section { background: #f9f9f9; padding: 15px; border: 1px solid #ddd; margin-bottom: 20px; }
    .current-location { background: #e3f2fd; padding: 10px; margin-bottom: 15px; border-radius: 4px; }
    .current-location p { margin: 5px 0; }
    .gps-picker-section { margin: 15px 0; padding: 10px; background: #fff3cd; border-radius: 4px; }
    .gps-btn { padding: 8px 15px; background-color: #28a745; color: white; border: none; cursor: pointer; border-radius: 4px; margin-right: 10px; }
    .gps-btn:hover:not(:disabled) { background-color: #218838; }
    .gps-btn:disabled { background-color: #6c757d; cursor: not-allowed; }
    .preview-btn { padding: 6px 12px; background-color: #17a2b8; color: white; border: none; cursor: pointer; border-radius: 4px; }
    .preview-btn:hover { background-color: #138496; }
    .map-picker { margin: 15px 0; padding: 10px; background: #e7f3ff; border-radius: 4px; }
    .map-note { font-style: italic; color: #666; margin-top: 10px; }
    .map-container { margin-top: 10px; border-radius: 4px; overflow: hidden; }
    .map-row td { padding: 0 !important; }
    .map-toggle-btn { padding: 4px 8px; background-color: #28a745; color: white; border: none; cursor: pointer; border-radius: 3px; font-size: 12px; }
    .map-toggle-btn:hover { background-color: #218838; }
    .form-group { margin-bottom: 10px; }
    input { padding: 5px; margin-left: 10px; }
    button { padding: 5px 10px; background-color: #007bff; color: white; border: none; cursor: pointer; }
    button:hover { background-color: #0056b3; }
    .error { color: red; }
    .success { color: green; }
  `]
})
export class ManagerDashboardComponent implements OnInit {
  records: any[] = [];
  employees: any[] = [];
  newUser = { username: '', password: '' };
  message = '';
  isError = false;
  officeLocation: any = null;
  officeData = { name: '', latitude: 0, longitude: 0, allowed_radius_meters: 100 };
  officeMessage = '';
  isOfficeError = false;
  selectedMapRecord: number | null = null;
  isGettingLocation = false;
  locationError = '';
  locationSuccess = '';
  showMapPicker = false;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadRecords();
    this.loadOfficeLocation();
    this.loadEmployees();
  }

  loadRecords() {
    this.apiService.getAllRecords().subscribe({
      next: (res) => {
        this.records = res.data;
      },
      error: (err) => {
        console.error('Gagal memuat catatan', err);
      }
    });
  }

  loadEmployees() {
    this.apiService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res.data;
      },
      error: (err) => {
        console.error('Gagal memuat karyawan', err);
      }
    });
  }

  createEmployee() {
    if (!this.newUser.username || !this.newUser.password) {
      this.message = 'Mohon isi semua kolom';
      this.isError = true;
      return;
    }

    this.apiService.createEmployee(this.newUser).subscribe({
      next: (res) => {
        this.message = 'Karyawan berhasil dibuat!';
        this.isError = false;
        this.newUser = { username: '', password: '' };
        this.loadEmployees(); // Refresh employee list
      },
      error: (err) => {
        this.message = err.error?.error || 'Gagal membuat karyawan';
        this.isError = true;
      }
    });
  }

  getMapLink(lat: number, long: number): string {
    return `https://www.google.com/maps?q=${lat},${long}`;
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
            name: res.data.name || '',
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            allowed_radius_meters: res.data.allowed_radius_meters
          };
        }
      },
      error: (err) => {
        console.error('Gagal memuat lokasi kantor', err);
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
