import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface EmployeeRecord {
  id?: number | string;
  email: string;
  name: string;
  department: string;
}

export interface PagedEmployeeResponse {
  content: EmployeeRecord[];
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly api = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getEmployees(
    page: number,
    size: number
  ): Observable<EmployeeRecord[] | PagedEmployeeResponse> {
    return this.http
      .get<EmployeeRecord[] | PagedEmployeeResponse>(
        `${this.api}?page=${page}&size=${size}`
      )
      .pipe(shareReplay(1));
  }

  createEmployee(data: EmployeeRecord): Observable<EmployeeRecord> {
    return this.http.post<EmployeeRecord>(this.api, data);
  }

  updateEmployee(
    identifier: number | string,
    data: EmployeeRecord
  ): Observable<EmployeeRecord> {
    return this.http.put<EmployeeRecord>(this.employeeUrl(identifier), data);
  }

  deleteEmployee(identifier: number | string): Observable<void> {
    return this.http.delete<void>(this.employeeUrl(identifier));
  }

  private employeeUrl(identifier: number | string): string {
    return `${this.api}/${encodeURIComponent(String(identifier))}`;
  }
}
