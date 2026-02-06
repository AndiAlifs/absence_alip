import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-leave-request',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Navigation Buttons -->
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-3xl font-bold text-gray-900">Permohonan Cuti</h2>
          <div class="flex gap-2">
            <a routerLink="/clock-in" 
               class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Clock In
            </a>
            <a routerLink="/leave-history" 
               class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Riwayat Cuti
            </a>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Ajukan Permohonan Cuti</h3>
          
          <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
              <input 
                type="date" 
                formControlName="start_date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
              <input 
                type="date" 
                formControlName="end_date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Alasan</label>
              <textarea 
                formControlName="reason"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                placeholder="Jelaskan alasan cuti Anda..."></textarea>
            </div>
            
            <button 
              type="submit" 
              [disabled]="leaveForm.invalid || submitting"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-lg">
              <span *ngIf="!submitting">Kirim Permohonan</span>
              <span *ngIf="submitting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
            </button>
          </form>

          <div *ngIf="message" [class]="isError ? 'mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg' : 'mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg'">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg *ngIf="!isError" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg *ngIf="isError" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p [class]="isError ? 'text-sm text-red-700' : 'text-sm text-green-700'">{{ message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LeaveRequestComponent {
  leaveForm: FormGroup;
  submitting = false;
  message = '';
  isError = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.leaveForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      this.submitting = true;
      this.message = '';
      
      this.apiService.submitLeave(this.leaveForm.value).subscribe({
        next: (res) => {
          this.message = 'Permohonan cuti berhasil diajukan.';
          this.isError = false;
          this.submitting = false;
          this.leaveForm.reset();
        },
        error: (err) => {
          this.message = 'Gagal mengajukan permohonan cuti.';
          this.isError = true;
          this.submitting = false;
        }
      });
    }
  }
}
