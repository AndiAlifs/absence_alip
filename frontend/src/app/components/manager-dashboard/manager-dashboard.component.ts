import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <div class="container">
      <h2>Manager Dashboard</h2>

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
    .add-employee-section { background: #f9f9f9; padding: 15px; border: 1px solid #ddd; margin-bottom: 20px; }
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
  newUser = { username: '', password: '' };
  message = '';
  isError = false;

  constructor(private apiService: ApiService) { }

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
}
