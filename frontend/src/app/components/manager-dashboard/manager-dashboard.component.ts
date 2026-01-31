import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <div class="container">
      <h2>Manager Dashboard</h2>

      <div class="add-employee-section">
        <h3>Set Office Location</h3>
        <div *ngIf="officeLocation" class="current-location">
          <p><strong>Current Office Location:</strong></p>
          <p>Name: {{ officeLocation.name || 'Not set' }}</p>
          <p>Coordinates: {{ officeLocation.latitude }}, {{ officeLocation.longitude }}</p>
          <p>Allowed Radius: {{ officeLocation.allowed_radius_meters }} meters</p>
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
          <label>Office Name: </label>
          <input [(ngModel)]="officeData.name" placeholder="e.g., Main Office" />
        </div>
        <div class="gps-picker-section">
          <button class="gps-btn" (click)="getCurrentLocation()" [disabled]="isGettingLocation">
            {{ isGettingLocation ? 'Getting Location...' : '📍 Use Current Location' }}
          </button>
          <span *ngIf="locationError" class="error">{{ locationError }}</span>
          <span *ngIf="locationSuccess" class="success">{{ locationSuccess }}</span>
        </div>
        <div class="form-group">
          <label>Latitude: </label>
          <input [(ngModel)]="officeData.latitude" type="number" step="0.000001" placeholder="e.g., -6.200000" />
        </div>
        <div class="form-group">
          <label>Longitude: </label>
          <input [(ngModel)]="officeData.longitude" type="number" step="0.000001" placeholder="e.g., 106.816666" />
        </div>
        <div class="form-group">
          <button class="preview-btn" (click)="toggleMapPicker()" type="button">
            {{ showMapPicker ? 'Hide Map Picker' : '🗺️ Pick Location on Map' }}
          </button>
        </div>
        <div *ngIf="showMapPicker && officeData.latitude && officeData.longitude" class="map-picker">
          <p><small>Click on the map to select a new location, or drag the marker</small></p>
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
          <p class="map-note"><small>Note: After selecting a location on the map, copy the coordinates from the URL or marker and paste them in the fields above.</small></p>
        </div>
        <div class="form-group">
          <label>Allowed Radius (meters): </label>
          <input [(ngModel)]="officeData.allowed_radius_meters" type="number" placeholder="e.g., 100" />
        </div>
        <button (click)="setOfficeLocation()">Save Office Location</button>
        <p *ngIf="officeMessage" [class.error]="isOfficeError" [class.success]="!isOfficeError">{{ officeMessage }}</p>
      </div>

      <hr />

      <div class="add-employee-section">
        <h3>Add New Employee</h3>
        <div class="form-group">
          <label>Username: </label>
          <input [(ngModel)]="newUser.username" placeholder="Username" />
        </div>
        <div class="form-group">
          <label>Password: </label>
          <input [(ngModel)]="newUser.password" type="password" placeholder="Password" />
        </div>
        <button (click)="createEmployee()">Create Employee</button>
        <p *ngIf="message" [class.error]="isError" [class.success]="!isError">{{ message }}</p>
      </div>

      <hr />

      <h3>All Employees</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
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
      <div *ngIf="employees.length === 0">No employees found.</div>

      <hr />

      <h3>Attendance Records</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Username</th>
            <th>Time</th>
            <th>Location</th>
            <th>Map View</th>
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
                  {{ selectedMapRecord === record.id ? 'Hide Map' : 'Show Map' }}
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
      <div *ngIf="records.length === 0">No attendance records found.</div>
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
        console.error('Failed to load records', err);
      }
    });
  }

  loadEmployees() {
    this.apiService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res.data;
      },
      error: (err) => {
        console.error('Failed to load employees', err);
      }
    });
  }

  createEmployee() {
    if (!this.newUser.username || !this.newUser.password) {
      this.message = 'Please fill in all fields';
      this.isError = true;
      return;
    }

    this.apiService.createEmployee(this.newUser).subscribe({
      next: (res) => {
        this.message = 'Employee created successfully!';
        this.isError = false;
        this.newUser = { username: '', password: '' };
        this.loadEmployees(); // Refresh employee list
      },
      error: (err) => {
        this.message = err.error?.error || 'Failed to create employee';
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
      this.locationError = 'Geolocation is not supported by your browser';
      this.isGettingLocation = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.officeData.latitude = position.coords.latitude;
        this.officeData.longitude = position.coords.longitude;
        this.locationSuccess = 'Location retrieved successfully!';
        this.isGettingLocation = false;
        setTimeout(() => this.locationSuccess = '', 3000);
      },
      (error) => {
        this.isGettingLocation = false;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationError = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            this.locationError = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            this.locationError = 'Location request timed out';
            break;
          default:
            this.locationError = 'An unknown error occurred';
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
        console.error('Failed to load office location', err);
      }
    });
  }

  setOfficeLocation() {
    if (!this.officeData.latitude || !this.officeData.longitude || !this.officeData.allowed_radius_meters) {
      this.officeMessage = 'Please fill in all required fields';
      this.isOfficeError = true;
      return;
    }

    this.apiService.setOfficeLocation(this.officeData).subscribe({
      next: (res) => {
        this.officeMessage = 'Office location saved successfully!';
        this.isOfficeError = false;
        this.loadOfficeLocation();
      },
      error: (err) => {
        this.officeMessage = err.error?.error || 'Failed to save office location';
        this.isOfficeError = true;
      }
    });
  }
}
