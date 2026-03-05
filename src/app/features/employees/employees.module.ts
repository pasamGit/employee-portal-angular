import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EmployeeListComponent } from './employee-list.component';
import { EmployeesRoutingModule } from './employees-routing.module';

@NgModule({
  declarations: [EmployeeListComponent],
  imports: [CommonModule, FormsModule, EmployeesRoutingModule]
})
export class EmployeesModule {}
