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

  // System Settings
  getSystemSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/settings`, this.getHeaders());
  }

  getSessionDuration(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/settings/session-duration`, this.getHeaders());
  }

  updateSessionDuration(durationHours: number): Observable<any> {
    // Ensure it's a number, not a string
    const numericDuration = Number(durationHours);
    return this.http.put(`${this.apiUrl}/admin/settings/session-duration`, 
      { duration_hours: numericDuration }, 
      this.getHeaders()
    );
  }

  // Minimum Work Hours Settings
  getMinimumWorkHours(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/settings/minimum-work-hours`, this.getHeaders());
  }

  updateMinimumWorkHours(hours: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/settings/minimum-work-hours`,
      { minimum_work_hours: hours },
      this.getHeaders()
    );
  }

  // Instructor - Students
  createStudent(data: {
    name: string;
    total_quota_hours: number;
    whatsapp: string;
    gender: string;
    meeting_point?: string;
    initial_schedule_date?: string;
    initial_start_time?: string;
    initial_end_time?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructor/students`, data, this.getHeaders());
  }

  getInstructorStudents(active?: string): Observable<any> {
    const params = active ? `?active=${active}` : '';
    return this.http.get(`${this.apiUrl}/instructor/students${params}`, this.getHeaders());
  }

  updateStudent(studentId: number, data: {
    name?: string;
    whatsapp?: string;
    gender?: string;
    meeting_point?: string;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/instructor/students/${studentId}`, data, this.getHeaders());
  }

  adjustStudentQuota(studentId: number, remainingQuotaHours: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/instructor/students/${studentId}/adjust-quota`,
      { remaining_quota_hours: remainingQuotaHours },
      this.getHeaders()
    );
  }

  archiveStudent(studentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/instructor/students/${studentId}/archive`, {}, this.getHeaders());
  }

  getStudentSessions(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructor/students/${studentId}/sessions`, this.getHeaders());
  }

  // Instructor - Learning plans
  createLearningPlan(data: {
    student_id: number;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    status?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructor/schedule`, data, this.getHeaders());
  }

  getLearningPlans(period: 'week' | 'month' = 'month', startDate?: string, endDate?: string): Observable<any> {
    let params = `?period=${period}`;
    if (startDate) params += `&start_date=${startDate}`;
    if (endDate) params += `&end_date=${endDate}`;
    return this.http.get(`${this.apiUrl}/instructor/schedule${params}`, this.getHeaders());
  }

  updateLearningPlan(planId: number, data: {
    scheduled_date?: string;
    start_time?: string;
    end_time?: string;
    status?: string;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/instructor/schedule/${planId}`, data, this.getHeaders());
  }

  deleteLearningPlan(planId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/instructor/schedule/${planId}`, this.getHeaders());
  }

  bulkCreateLearningPlans(data: {
    student_id: number;
    days_of_week: number[];    // 1=Mon .. 7=Sun
    start_time: string;
    end_time: string;
    from_date: string;
    to_date: string;
    force?: boolean;           // true = skip duplicates silently (after user confirms conflicts)
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructor/schedule/bulk`, data, this.getHeaders());
  }

  // Instructor - Student sessions
  startStudentSession(data: { student_id: number; latitude: number; longitude: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructor/session/start`, data, this.getHeaders());
  }

  endStudentSession(data: { session_id?: number; student_id?: number; notes?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/instructor/session/end`, data, this.getHeaders());
  }

  getActiveStudentSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructor/session/active`, this.getHeaders());
  }

  // Instructor - Quota presets
  getQuotaPresets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructor/quota-presets`, this.getHeaders());
  }

  // Admin - Student Management
  adminListStudents(params?: { instructor_id?: number; is_active?: boolean; q?: string }): Observable<any> {
    let query = '';
    if (params) {
      const parts: string[] = [];
      if (params.instructor_id != null) parts.push(`instructor_id=${params.instructor_id}`);
      if (params.is_active != null) parts.push(`is_active=${params.is_active}`);
      if (params.q) parts.push(`q=${encodeURIComponent(params.q)}`);
      if (parts.length) query = '?' + parts.join('&');
    }
    return this.http.get(`${this.apiUrl}/admin/students${query}`, this.getHeaders());
  }

  adminCreateStudent(data: {
    name: string;
    instructor_id: number;
    total_quota_hours: number;
    whatsapp: string;
    gender: string;
    meeting_point?: string;
    initial_schedule_date?: string;
    initial_start_time?: string;
    initial_end_time?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/students`, data, this.getHeaders());
  }

  adminUpdateStudent(id: number, data: {
    name?: string;
    whatsapp?: string;
    gender?: string;
    meeting_point?: string;
    instructor_id?: number;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/students/${id}`, data, this.getHeaders());
  }

  adminAdjustQuota(id: number, remainingQuotaHours: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/students/${id}/adjust-quota`,
      { remaining_quota_hours: remainingQuotaHours }, this.getHeaders());
  }

  adminArchiveStudent(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/students/${id}/archive`, {}, this.getHeaders());
  }

  adminReassignStudent(id: number, instructorId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/students/${id}/reassign`,
      { instructor_id: instructorId }, this.getHeaders());
  }

  adminGetStudentSessions(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/students/${id}/sessions`, this.getHeaders());
  }

  // Admin - Learning Plans
  adminListLearningPlans(params?: {
    instructor_id?: number;
    student_id?: number;
    period?: 'week' | 'month';
    start_date?: string;
    end_date?: string;
  }): Observable<any> {
    const parts: string[] = [];
    if (params) {
      if (params.instructor_id != null) parts.push(`instructor_id=${params.instructor_id}`);
      if (params.student_id != null) parts.push(`student_id=${params.student_id}`);
      if (params.period) parts.push(`period=${params.period}`);
      if (params.start_date) parts.push(`start_date=${params.start_date}`);
      if (params.end_date) parts.push(`end_date=${params.end_date}`);
    }
    const query = parts.length ? '?' + parts.join('&') : '';
    return this.http.get(`${this.apiUrl}/admin/learning-plans${query}`, this.getHeaders());
  }

  adminCreateLearningPlan(data: {
    student_id: number;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    status?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/learning-plans`, data, this.getHeaders());
  }

  adminUpdateLearningPlan(id: number, data: {
    scheduled_date?: string;
    start_time?: string;
    end_time?: string;
    status?: string;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/learning-plans/${id}`, data, this.getHeaders());
  }

  adminDeleteLearningPlan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/learning-plans/${id}`, this.getHeaders());
  }

  adminBulkCreateLearningPlan(data: {
    student_id: number;
    days_of_week: number[];
    start_time: string;
    end_time: string;
    from_date: string;
    to_date: string;
    force?: boolean;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/learning-plans/bulk`, data, this.getHeaders());
  }

  // Admin - Instructor Insight
  adminListInstructors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/instructors`, this.getHeaders());
  }

  adminGetInstructorLoad(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/instructor-load`, this.getHeaders());
  }

  adminDownloadStudentRoster(): Observable<Blob> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/admin/students/roster.xlsx`, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'blob'
    });
  }
}
