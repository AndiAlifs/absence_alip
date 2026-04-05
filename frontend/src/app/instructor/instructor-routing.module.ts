import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InstructorDashboardComponent } from './components/instructor-dashboard/instructor-dashboard.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';
import { LearningPlanComponent } from './components/learning-plan/learning-plan.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: InstructorDashboardComponent },
  { path: 'students', component: StudentManagementComponent },
  { path: 'learning-plan', component: LearningPlanComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule {}
