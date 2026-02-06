import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Office {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  allowed_radius_meters: number;
  clock_in_time: string;
  is_active: boolean;
}

@Component({
  selector: 'app-office-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manajemen Kantor</h1>
            <p class="text-gray-600">Kelola lokasi kantor ({{offices.length}} dari 4)</p>
          </div>
          <div class="space-x-3">
            <button (click)="goToDashboard()" 
                    class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition-all shadow-lg">
              ← Kembali ke Dashboard
            </button>
            <button (click)="showAddOfficeForm()" 
                    class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-lg">
              + Tambah Kantor Baru
            </button>
          </div>
        </div>

        <!-- Office Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div *ngFor="let office of offices" 
               class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <!-- Map Preview -->
            <div class="w-full h-40 bg-gray-200 relative cursor-pointer" (click)="viewOnMap(office)">
              <iframe 
                [src]="getMapPreviewUrl(office)" 
                class="w-full h-full border-0 pointer-events-none"
                loading="lazy">
              </iframe>
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end justify-center pb-2">
                <span class="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                  📍 Klik untuk buka di Google Maps
                </span>
              </div>
            </div>
            
            <!-- Office Info -->
            <div class="p-5">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{office.name}}</h3>
              <p class="text-sm text-gray-600 mb-3">{{office.address || 'Alamat tidak tersedia'}}</p>
              
              <div class="space-y-1 text-sm mb-4">
                <p><strong>Radius:</strong> {{office.allowed_radius_meters}}m</p>
                <p><strong>Jam Masuk:</strong> {{office.clock_in_time}}</p>
                <p class="text-xs text-gray-500">{{office.latitude}}, {{office.longitude}}</p>
              </div>
              
              <div class="flex space-x-2">
                <button (click)="editOffice(office)" 
                        class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md">
                  Edit
                </button>
                <button (click)="viewOnMap(office)" 
                        class="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md">
                  Peta
                </button>
                <button (click)="deleteOffice(office)" 
                        class="px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add/Edit Form Modal -->
        <div *ngIf="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-4">
              {{formMode === 'add' ? 'Tambah Kantor Baru' : 'Edit Kantor'}}
            </h2>
            
            <form [formGroup]="officeForm" (ngSubmit)="saveOffice()">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Nama Kantor *</label>
                  <input type="text" formControlName="name" 
                         class="w-full border rounded px-3 py-2">
                  <span *ngIf="officeForm.get('name')?.invalid && officeForm.get('name')?.touched" 
                        class="text-red-500 text-sm">Nama kantor wajib diisi</span>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-1">Alamat</label>
                  <input type="text" formControlName="address" 
                         class="w-full border rounded px-3 py-2">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1">Latitude *</label>
                    <input type="number" step="any" formControlName="latitude" 
                           class="w-full border rounded px-3 py-2">
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Longitude *</label>
                    <input type="number" step="any" formControlName="longitude" 
                           class="w-full border rounded px-3 py-2">
                  </div>
                </div>

                <!-- Map Picker Buttons -->
                <div class="flex gap-3">
                  <button type="button" (click)="getCurrentLocation()" 
                          [disabled]="isGettingLocation"
                          class="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                    <svg *ngIf="!isGettingLocation" class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span *ngIf="isGettingLocation" class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {{ isGettingLocation ? 'Mengambil...' : 'Gunakan Lokasi Saat Ini' }}
                  </button>
                  <button type="button" (click)="toggleMapPicker()" 
                          class="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition-all shadow-md flex items-center justify-center">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {{ showMapPicker ? 'Sembunyikan Peta' : 'Pilih di Peta' }}
                  </button>
                </div>

                <!-- Map Picker -->
                <div *ngIf="showMapPicker" class="border-2 border-purple-200 rounded-lg overflow-hidden">
                  <iframe 
                    [src]="getMapPickerUrl()" 
                    width="100%" 
                    height="400" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy">
                  </iframe>
                  <p class="text-xs text-gray-600 p-3 bg-gray-50">
                    💡 Klik pada peta di atas, kemudian salin koordinat (latitude, longitude) ke form di atas
                  </p>
                </div>

                <!-- Success/Error Messages -->
                <div *ngIf="locationSuccess" class="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                  ✓ {{ locationSuccess }}
                </div>
                <div *ngIf="locationError" class="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  ✗ {{ locationError }}
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-1">Radius yang Diizinkan (meter) *</label>
                  <input type="number" formControlName="allowed_radius_meters" 
                         class="w-full border rounded px-3 py-2">
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-1">Jam Masuk (HH:MM) *</label>
                  <input type="time" formControlName="clock_in_time" 
                         class="w-full border rounded px-3 py-2">
                </div>
              </div>
              
              <div class="flex space-x-3 mt-6">
                <button type="submit" 
                        [disabled]="!officeForm.valid"
                        class="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {{formMode === 'add' ? 'Buat Kantor' : 'Update Kantor'}}
                </button>
                <button type="button" (click)="closeForm()" 
                        class="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition-all shadow-lg">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OfficeManagementComponent implements OnInit {
  offices: Office[] = [];
  isSuperAdmin: boolean = false;
  showForm: boolean = false;
  formMode: 'add' | 'edit' = 'add';
  selectedOffice: Office | null = null;
  officeForm: FormGroup;
  
  // Map picker properties
  isGettingLocation: boolean = false;
  showMapPicker: boolean = false;
  locationSuccess: string = '';
  locationError: string = '';

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isSuperAdmin = user.is_super_admin || false;
    
    this.officeForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      allowed_radius_meters: ['', [Validators.required, Validators.min(1)]],
      clock_in_time: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadOffices();
  }

  loadOffices() {
    this.api.getMyOffices().subscribe({
      next: (response) => {
        this.offices = response.data || [];
      },
      error: (error) => {
        console.error('Error loading offices:', error);
        alert('Gagal memuat data kantor');
      }
    });
  }

  showAddOfficeForm() {
    this.formMode = 'add';
    this.selectedOffice = null;
    this.officeForm.reset();
    this.showForm = true;
  }

  editOffice(office: Office) {
    this.formMode = 'edit';
    this.selectedOffice = office;
    this.officeForm.patchValue(office);
    this.showForm = true;
  }

  saveOffice() {
    if (!this.officeForm.valid) {
      return;
    }

    const officeData = this.officeForm.value;
    
    if (this.formMode === 'add') {
      this.api.createOffice(officeData).subscribe({
        next: () => {
          alert('Kantor berhasil dibuat');
          this.loadOffices();
          this.closeForm();
        },
        error: (error) => {
          alert('Gagal membuat kantor: ' + (error.error?.error || 'Kesalahan tidak diketahui'));
        }
      });
    } else {
      this.api.updateOffice(this.selectedOffice!.id, officeData).subscribe({
        next: () => {
          alert('Kantor berhasil diupdate');
          this.loadOffices();
          this.closeForm();
        },
        error: (error) => {
          alert('Gagal mengupdate kantor: ' + (error.error?.error || 'Kesalahan tidak diketahui'));
        }
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.selectedOffice = null;
    this.officeForm.reset();
    this.showMapPicker = false;
    this.locationSuccess = '';
    this.locationError = '';
  }

  // Map picker methods
  getCurrentLocation() {
    this.isGettingLocation = true;
    this.locationError = '';
    this.locationSuccess = '';

    if (!navigator.geolocation) {
      this.locationError = 'Browser Anda tidak mendukung geolocation';
      this.isGettingLocation = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        this.officeForm.patchValue({
          latitude: lat,
          longitude: lng
        });
        
        this.locationSuccess = `Lokasi berhasil didapatkan: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        this.isGettingLocation = false;
      },
      (error) => {
        let errorMessage = 'Gagal mendapatkan lokasi';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Izin lokasi ditolak. Mohon aktifkan izin lokasi di browser Anda.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informasi lokasi tidak tersedia';
            break;
          case error.TIMEOUT:
            errorMessage = 'Request timeout saat mendapatkan lokasi';
            break;
        }
        this.locationError = errorMessage;
        this.isGettingLocation = false;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  toggleMapPicker() {
    this.showMapPicker = !this.showMapPicker;
  }

  getMapPickerUrl(): SafeResourceUrl {
    const lat = this.officeForm.get('latitude')?.value || -6.200000;
    const lng = this.officeForm.get('longitude')?.value || 106.816666;
    const url = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15865.0!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1234567890`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getMapPreviewUrl(office: Office): SafeResourceUrl {
    const lat = office.latitude;
    const lng = office.longitude;
    const url = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15865.0!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1234567890`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goToDashboard() {
    window.location.href = '/admin';
  }

  viewOnMap(office: Office) {
    const url = `https://www.google.com/maps?q=${office.latitude},${office.longitude}`;
    window.open(url, '_blank');
  }

  deleteOffice(office: Office) {
    if (!confirm(`Apakah Anda yakin ingin menghapus kantor "${office.name}"?\n\nPeringatan: Kantor dengan riwayat absensi tidak dapat dihapus.`)) {
      return;
    }

    this.api.deleteOffice(office.id).subscribe({
      next: () => {
        alert('Kantor berhasil dihapus');
        this.loadOffices();
      },
      error: (error) => {
        alert('Gagal menghapus kantor: ' + (error.error?.error || 'Kesalahan tidak diketahui'));
      }
    });
  }
}
