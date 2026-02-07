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
import { LeaveHistoryComponent } from './components/leave-history/leave-history.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { OfficeManagementComponent } from './components/office-management/office-management.component';
import { LeaveManagementComponent } from './components/leave-management/leave-management.component';
import { AttendanceReportsComponent } from './components/attendance-reports/attendance-reports.component';
import { MyAttendanceHistoryComponent } from './components/my-attendance-history/my-attendance-history.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'clock-in', component: ClockInComponent, canActivate: [AuthGuard] },
  { path: 'leave', component: LeaveRequestComponent, canActivate: [AuthGuard] },
  { path: 'leave-request', component: LeaveRequestComponent, canActivate: [AuthGuard] },
  { path: 'leave-history', component: LeaveHistoryComponent, canActivate: [AuthGuard] },
  { path: 'my-attendance', component: MyAttendanceHistoryComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: ManagerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/offices', component: OfficeManagementComponent, canActivate: [AuthGuard] },
  { path: 'admin/reports', component: AttendanceReportsComponent, canActivate: [AuthGuard] },
  { path: 'admin/leaves', component: LeaveManagementComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LeaveHistoryComponent,
    ClockInComponent,
    LeaveRequestComponent,
    ManagerDashboardComponent,
    AttendanceReportsComponent,
    MyAttendanceHistoryComponent,
    LeaveManagementComponent,
    LandingPageComponent
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
