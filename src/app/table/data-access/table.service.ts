import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { TableInterface } from "../interfaces";
import { AUTH_CONFIG, AuthConfig } from "../../auth";

@Injectable({
    providedIn: 'root'
})
export class TableService {
    private readonly spreadsheetId = '2PACX-1vTXWas8nwFHokwcylq9IawJYW9-6RsL6aNK_yr76i5cW4ZWFfyNrZAX355ZC1lbBCAR7hvd0NFmavKh';
    private readonly spreadsheetAdditionalOptions = 'pub?gid=1147358502&single=true&output=csv';

    constructor(
        private readonly http: HttpClient,
        @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
    ) {
    }

    getTableData(): Observable<{ columns: string[], tableData: TableInterface[] }> {
        return this.http.get(`${this.authConfig.spreadsheetUrl}/${this.spreadsheetId}/${this.spreadsheetAdditionalOptions}`, { responseType: 'text' }).pipe(
            map((data: string) => this.csvToTableArr(data))
        );
    }

    private csvToTableArr(stringValue: string): { columns: string[], tableData: TableInterface[] } {
        const [keys, ...rest] = stringValue
            .trim()
            .replace(/\r/g, "")
            .split("\n")
            .map((item) => item.split(','));

        const columns: string[] = keys.map(el => {
            const data = el.split('_');
            if (data.length === 1) {
                return el
            }
            return data.map((word, index) => {
                if (index === 0) {
                    return word
                }
                return word[0].charAt(0).toUpperCase() + word.slice(1)
            }).join('')
        });

        const tableData = rest.map((item) => {
            const object: any = {};
            columns.forEach((column, index) => (object[column] = item[index]));
            return object;
        });

        return  {
            columns,
            tableData
        }
    }
}
