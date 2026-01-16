import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-leave-request',
  template: `
    <div class="container">
      <h2>Submit Leave Request</h2>
      <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
        <div>
          <label>Start Date</label>
          <input type="date" formControlName="start_date">
        </div>
        <div>
          <label>End Date</label>
          <input type="date" formControlName="end_date">
        </div>
        <div>
          <label>Reason</label>
          <textarea formControlName="reason"></textarea>
        </div>
        <button type="submit" [disabled]="leaveForm.invalid || submitting">Submit Request</button>
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
          this.message = 'Leave request submitted successfully.';
          this.isError = false;
          this.submitting = false;
          this.leaveForm.reset();
        },
        error: (err) => {
          this.message = 'Failed to submit leave request.';
          this.isError = true;
          this.submitting = false;
        }
      });
    }
  }
}
