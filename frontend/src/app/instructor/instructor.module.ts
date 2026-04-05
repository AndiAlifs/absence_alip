import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InstructorRoutingModule } from './instructor-routing.module';
import { InstructorDashboardComponent } from './components/instructor-dashboard/instructor-dashboard.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';
import { LearningPlanComponent } from './components/learning-plan/learning-plan.component';

@NgModule({
  declarations: [
    InstructorDashboardComponent,
    StudentManagementComponent,
    LearningPlanComponent
  ],
  imports: [CommonModule, FormsModule, InstructorRoutingModule]
})
export class InstructorModule {}
