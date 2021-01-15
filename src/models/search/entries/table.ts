/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString } from 'lodash';
import { BaseRendererResponse } from './renderer';

export interface TableRow {
	TS: string;
	Row: Array<string>;
}

const isTableRow = (v: unknown): v is TableRow => {
	try {
		const t = v as TableRow;
		return isString(t.TS) && t.Row.every(isString);
	} catch {
		return false;
	}
};

export interface TableValueSet {
	Columns: Array<string>;
	Rows: Array<TableRow>;
}

const isTableValueSet = (v: unknown): v is TableValueSet => {
	try {
		const t = v as TableValueSet;
		return isArray(t.Columns) && t.Columns.every(isString) && isArray(t.Rows) && t.Rows.every(isTableRow);
	} catch {
		return false;
	}
};

export interface TableResponse extends BaseRendererResponse {
	Entries: TableValueSet;
}

export const isTableReponse = (v: BaseRendererResponse): v is TableResponse => {
	try {
		const t = v as TableResponse;
		return isTableValueSet(t.Entries);
	} catch {
		return false;
	}
};

// Gauge renderer
export interface GaugeValue {
	Name: string;
	Magnitude: number;
	Min: number;
	Max: number;
}

const isGaugeValue = (v: unknown): v is GaugeValue => {
	try {
		const g = v as GaugeValue;
		return isString(g.Name) && isNumber(g.Magnitude) && isNumber(g.Min) && isNumber(g.Max);
	} catch {
		return false;
	}
};

export interface GaugeResponse extends BaseRendererResponse {
	Entries: Array<GaugeValue>;
}

export const isGaugeResponse = (v: BaseRendererResponse): v is GaugeResponse => {
	try {
		const t = v as GaugeResponse;
		return isArray(t.Entries) && t.Entries.every(isGaugeValue);
	} catch {
		return false;
	}
};
