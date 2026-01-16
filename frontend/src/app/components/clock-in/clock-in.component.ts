import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-clock-in',
  template: `
    <div class="container">
      <h2>Clock In</h2>
      <div *ngIf="loading">Getting location...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div *ngIf="location">
        <p>Latitude: {{ location.latitude }}</p>
        <p>Longitude: {{ location.longitude }}</p>
        <button (click)="submitClockIn()" [disabled]="submitting">
          {{ submitting ? 'Submitting...' : 'Clock In Now' }}
        </button>
      </div>

      <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .error { color: red; }
    .success { color: green; margin-top: 10px; font-weight: bold; }
    button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
  `]
})
export class ClockInComponent implements OnInit {
  location: { latitude: number, longitude: number } | null = null;
  loading = false;
  submitting = false;
  error = '';
  successMessage = '';

  constructor(private apiService: ApiService) {}

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
          this.error = 'Failed to get location. Please enable permissions.';
          this.loading = false;
        }
      );
    } else {
      this.error = 'Geolocation is not supported by this browser.';
      this.loading = false;
    }
  }

  submitClockIn() {
    if (!this.location) return;

    this.submitting = true;
    this.apiService.clockIn(this.location).subscribe({
      next: (res) => {
        this.successMessage = 'Clock-in successful at ' + new Date().toLocaleTimeString();
        this.submitting = false;
      },
      error: (err) => {
        this.error = 'Failed to clock in.';
        this.submitting = false;
      }
    });
  }
}
