import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ClockInComponent } from './components/clock-in/clock-in.component';
import { LeaveRequestComponent } from './components/leave-request/leave-request.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { OfficeManagementComponent } from './components/office-management/office-management.component';
import { AttendanceReportsComponent } from './components/attendance-reports/attendance-reports.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'clock-in', component: ClockInComponent, canActivate: [AuthGuard] },
  { path: 'leave', component: LeaveRequestComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: ManagerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/offices', component: OfficeManagementComponent, canActivate: [AuthGuard] },
  { path: 'admin/reports', component: AttendanceReportsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClockInComponent,
    LeaveRequestComponent,
    ManagerDashboardComponent,
    AttendanceReportsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    OfficeManagementComponent
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
