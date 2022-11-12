import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { getPager } from "./pagination.helper";
import { Pager } from "../interfaces";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() currentPage = 1;

  @Output() filteredDataItems = new EventEmitter<any[]>();
  @Output() selectedPage = new EventEmitter<number>();

  pager: Pager = {} as Pager;

  ngOnInit(): void {
    this.setPage(this.currentPage);
  }

  setPage(page: number): void {
    this.pager = getPager(this.data.length, page);
    this.selectedPage.emit(page);
    this.filteredDataItems.emit(this.data.slice(this.pager.startIndex, this.pager.endIndex + 1));
  }
}
