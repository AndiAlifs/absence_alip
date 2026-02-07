import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // Auth
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Attendance
  clockIn(data: { latitude: number, longitude: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/clock-in`, data, this.getHeaders());
  }

  clockOut(data: { latitude: number, longitude: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/clock-out`, data, this.getHeaders());
  }

  getTodayAttendance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-attendance/today`, this.getHeaders());
  }

  getMyAttendanceHistory(limit: number = 50, offset: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-attendance/history?limit=${limit}&offset=${offset}`, this.getHeaders());
  }

  // Leave
  submitLeave(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave`, data, this.getHeaders());
  }

  getTodayLeave(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-leave/today`, this.getHeaders());
  }

  getMyLeaveHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-leave/history`, this.getHeaders());
  }

  getAllLeaveRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/leaves`, this.getHeaders());
  }

  // Admin
  getAllRecords(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/records`, this.getHeaders());
  }

  getAttendanceRecords(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/records`, this.getHeaders());
  }

  updateLeaveStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/leave/${id}`, { status }, this.getHeaders());
  }

  createEmployee(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users`, userData, this.getHeaders());
  }

  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/employees`, this.getHeaders());
  }

  createEmployeeData(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/employees`, userData, this.getHeaders());
  }

  updateEmployee(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/employees/${id}`, userData, this.getHeaders());
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/employees/${id}`, this.getHeaders());
  }

  // Office Location
  getOfficeLocation(): Observable<any> {
    return this.http.get(`${this.apiUrl}/office-location`, this.getHeaders());
  }

  setOfficeLocation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/office-location`, data, this.getHeaders());
  }

  // Clock-in Time
  getClockInTime(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/clock-in-time`, this.getHeaders());
  }

  setClockInTime(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/clock-in-time`, data, this.getHeaders());
  }

  // Pending Clock-ins
  getPendingClockIns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/pending-clockins`, this.getHeaders());
  }

  updateClockInStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/clockin/${id}`, { status }, this.getHeaders());
  }

  // Daily Dashboard
  getDailyAttendance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/daily-attendance`, this.getHeaders());
  }

  // Office Management
  getOffices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/offices`, this.getHeaders());
  }

  getMyOffices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/my-offices`, this.getHeaders());
  }

  createOffice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/offices`, data, this.getHeaders());
  }

  updateOffice(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/offices/${id}`, data, this.getHeaders());
  }

  deleteOffice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/offices/${id}`, this.getHeaders());
  }

  assignOfficeToManager(managerId: number, officeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/offices/assign`, 
      { manager_id: managerId, office_id: officeId }, 
      this.getHeaders()
    );
  }

  unassignOfficeFromManager(managerId: number, officeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/offices/unassign`, 
      { manager_id: managerId, office_id: officeId }, 
      this.getHeaders()
    );
  }

  // For employees to see valid offices
  getEmployeeOffices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-offices`, this.getHeaders());
  }
}
