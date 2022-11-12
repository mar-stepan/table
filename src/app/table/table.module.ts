import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { TableComponent } from './table.component';
import { AUTH_CONFIG, AuthConfig } from "../auth";
import { PaginationModule } from "../shared/pagination";

@NgModule({
  declarations: [TableComponent],
    imports: [CommonModule, PaginationModule, MatProgressSpinnerModule, MatIconModule, MatCheckboxModule],
})
export class TableModule {
  static forRoot(config: AuthConfig): ModuleWithProviders<TableModule> {
    return {
      ngModule: TableModule,
      providers: [
        {
          provide: AUTH_CONFIG,
          useValue: config,
        }
      ]
    }
  }
}
