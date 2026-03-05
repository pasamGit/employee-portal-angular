import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  log(message: string, payload?: unknown): void {
    if (payload !== undefined) {
      console.log(message, payload);
      return;
    }

    console.log(message);
  }

  error(message: string, payload?: unknown): void {
    if (payload !== undefined) {
      console.error(message, payload);
      return;
    }

    console.error(message);
  }
}
