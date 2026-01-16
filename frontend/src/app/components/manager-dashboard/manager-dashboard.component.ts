import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <div class="container">
      <h2>Manager Dashboard</h2>

      <h3>Attendance Records</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Time</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let record of records">
            <td>{{ record.user_id }}</td>
            <td>{{ record.clock_in_time | date:'medium' }}</td>
            <td>
              <a [href]="getMapLink(record.latitude, record.longitude)" target="_blank">
                View Position
              </a>
            </td>
          </tr>
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
  `]
})
export class ManagerDashboardComponent implements OnInit {
  records: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadRecords();
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

  getMapLink(lat: number, long: number): string {
    return `https://www.google.com/maps?q=${lat},${long}`;
  }
}
