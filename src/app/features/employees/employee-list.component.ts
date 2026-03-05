import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import {
  EmployeeRecord,
  EmployeeService,
  PagedEmployeeResponse
} from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: EmployeeRecord[] = [];
  page = 0;
  readonly size = 10;
  loading = false;
  saving = false;
  errorMessage = '';

  form = {
    name: '',
    email: '',
    department: ''
  };

  editingIdentifier: number | string | null = null;

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.empService
      .getEmployees(this.page, this.size)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: EmployeeRecord[] | PagedEmployeeResponse) => {
          this.employees = Array.isArray(res) ? res : res.content ?? [];
        },
        error: () => {
          this.errorMessage = 'Unable to load employees.';
        }
      });
  }

  previousPage(): void {
    if (this.page === 0) {
      return;
    }

    this.page -= 1;
    this.load();
  }

  nextPage(): void {
    this.page += 1;
    this.load();
  }

  submit(): void {
    const name = this.form.name.trim();
    const email = this.form.email.trim();
    const department = this.form.department.trim();

    if (!name || !email || !department || this.saving) {
      return;
    }

    const payload: EmployeeRecord = { name, email, department };
    this.saving = true;
    this.errorMessage = '';

    const request$ =
      this.editingIdentifier === null
        ? this.empService.createEmployee(payload)
        : this.empService.updateEmployee(this.editingIdentifier, payload);

    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.resetForm();
        this.load();
      },
      error: () => {
        this.errorMessage =
          this.editingIdentifier === null
            ? 'Unable to create employee.'
            : 'Unable to update employee.';
      }
    });
  }

  startEdit(employee: EmployeeRecord): void {
    this.editingIdentifier = employee.id ?? employee.email;
    this.form.name = employee.name;
    this.form.email = employee.email;
    this.form.department = employee.department;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  remove(employee: EmployeeRecord): void {
    const identifier = employee.id ?? employee.email;

    this.errorMessage = '';
    this.empService.deleteEmployee(identifier).subscribe({
      next: () => this.load(),
      error: () => {
        this.errorMessage = 'Unable to delete employee.';
      }
    });
  }

  private resetForm(): void {
    this.form = {
      name: '',
      email: '',
      department: ''
    };
    this.editingIdentifier = null;
  }
}
