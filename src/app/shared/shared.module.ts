// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextService } from './services/context.service';
import { ChatService } from './services/chat.service';

@NgModule({
  imports: [CommonModule],
  providers: [ContextService, ChatService],
  exports: [ContextService, ChatService],
})
export class SharedModule {}
