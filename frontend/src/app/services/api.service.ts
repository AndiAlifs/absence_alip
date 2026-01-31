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

  // Leave
  submitLeave(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave`, data, this.getHeaders());
  }

  // Admin
  getAllRecords(): Observable<any> {
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

  // Office Location
  getOfficeLocation(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/office-location`, this.getHeaders());
  }

  setOfficeLocation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/office-location`, data, this.getHeaders());
  }
}
