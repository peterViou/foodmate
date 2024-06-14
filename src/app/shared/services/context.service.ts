// src/app/shared/context.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  private context: any = {};

  setContext(key: string, value: any) {
    this.context[key] = value;
  }

  getContext(key: string) {
    return this.context[key];
  }

  clearContext() {
    this.context = {};
  }
}
