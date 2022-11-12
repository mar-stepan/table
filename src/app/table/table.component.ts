import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

import { TableService } from "./data-access";
import { TableHeaderInterface, TableInterface } from "./interfaces";
import { TranslatedObjectsWithActions } from "./helpers";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
    readonly error$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    readonly translatedObjectsWithActions: { [key: string]: TableHeaderInterface } = TranslatedObjectsWithActions;

    displayedColumns: string[] = [];

    tableData: TableInterface[] = [];
    filteredTableData: TableInterface[] = [];

    selectedRows: { [key: number]: boolean[] }  = [];

    selectedPage = 1;

    get isAllSelected(): boolean {
        return this.selectedRows[this.selectedPage]?.length === this.filteredTableData?.length;
    }

    get isSomeRowsChecked(): boolean {
        return this.selectedRows[this.selectedPage].some(el => el);
    }

    get isSelectedRowsLength(): boolean {
        return this.selectedRows[this.selectedPage] && this.selectedRows[this.selectedPage].length > 0 || false
    }

    constructor(private readonly tableService: TableService) {
    }

    ngOnInit(): void {
        this.loading$.next(true);
        this.tableService.getTableData()
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe({
                next: (value: { columns: string[], tableData: TableInterface[] }) => {
                    this.tableData = value.tableData;
                    this.displayedColumns = value.columns;
                },
                error: ({ message }) => this.error$.next(message)
            })
    }

    masterToggle(): void {
        if (this.isAllSelected) {
            this.selectedRows[this.selectedPage] = [];
        } else {
            this.filteredTableData.forEach((row, index) => {
                if (!this.selectedRows[this.selectedPage]) {
                    this.selectedRows[this.selectedPage] = [];
                }
                this.selectedRows[this.selectedPage][index] = true;
            });
        }
    }

    selectRow(index: number): void {
        if (!this.selectedRows[this.selectedPage]) {
            this.selectedRows[this.selectedPage] = [];
        }
        this.selectedRows[this.selectedPage][index] = !this.selectedRows[this.selectedPage][index];
    }

    isRowChecked(index: number): boolean {
        return this.selectedRows[this.selectedPage] && this.selectedRows[this.selectedPage][index];
    }
}
