import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

interface AttendanceRecord {
  id: number;
  clock_in_time: string;
  clock_out_time?: string;
  status: string;
  distance: number;
  work_hours?: number;
  is_late: boolean;
  minutes_late: number;
  latitude: number;
  longitude: number;
  approved_office?: {
    id: number;
    name: string;
    address: string;
  };
}

@Component({
  selector: 'app-my-attendance-history',
  templateUrl: './my-attendance-history.component.html',
  styleUrls: ['./my-attendance-history.component.css']
})
export class MyAttendanceHistoryComponent implements OnInit {
  attendanceRecords: AttendanceRecord[] = [];
  isLoading = true;
  errorMessage = '';
  total = 0;
  limit = 50;
  offset = 0;
  currentPage = 1;
  totalPages = 1;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAttendanceHistory();
  }

  loadAttendanceHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.apiService.getMyAttendanceHistory(this.limit, this.offset).subscribe(
      (response) => {
        this.attendanceRecords = response.data || [];
        this.total = response.total || 0;
        this.totalPages = Math.ceil(this.total / this.limit);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading attendance history:', error);
        this.errorMessage = 'Gagal memuat riwayat absensi. Silakan coba lagi.';
        this.isLoading = false;
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'approved':
        return 'Disetujui';
      case 'pending':
        return 'Menunggu';
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.offset = (this.currentPage - 1) * this.limit;
      this.loadAttendanceHistory();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.offset = (this.currentPage - 1) * this.limit;
      this.loadAttendanceHistory();
    }
  }

  goBack(): void {
    this.router.navigate(['/clock-in']);
  }

  viewLocation(lat: number, lng: number): void {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  }
}
