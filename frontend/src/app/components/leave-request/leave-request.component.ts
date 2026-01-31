import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-leave-request',
  template: `
    <div class="container">
      <h2>Ajukan Permohonan Cuti</h2>
      <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
        <div>
          <label>Tanggal Mulai</label>
          <input type="date" formControlName="start_date">
        </div>
        <div>
          <label>Tanggal Selesai</label>
          <input type="date" formControlName="end_date">
        </div>
        <div>
          <label>Alasan</label>
          <textarea formControlName="reason"></textarea>
        </div>
        <button type="submit" [disabled]="leaveForm.invalid || submitting">Kirim Permohonan</button>
      </form>

      <div *ngIf="message" [class.error]="isError" [class.success]="!isError">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 500px; }
    div { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
    textarea { height: 100px; }
    .error { color: red; margin-top: 10px; }
    .success { color: green; margin-top: 10px; }
  `]
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
