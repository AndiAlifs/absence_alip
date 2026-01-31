import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

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

  getTodayAttendance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-attendance/today`, this.getHeaders());
  }

  // Leave
  submitLeave(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave`, data, this.getHeaders());
  }

  getTodayLeave(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-leave/today`, this.getHeaders());
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
}
