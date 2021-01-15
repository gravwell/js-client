/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString, isUndefined } from 'lodash';
import { BaseRendererResponse } from './renderer';

export interface Chartable {
	Data: Array<number>;
	TS: string;
}

const isChartable = (v: unknown): v is Chartable => {
	try {
		const c = v as Chartable;
		return isArray(c.Data) && c.Data.every(isNumber) && isString(c.TS);
	} catch {
		return false;
	}
};

export interface KeyComponents {
	Keys: Array<string>;
}

const isKeyComponents = (v: unknown): v is KeyComponents => {
	try {
		const k = v as KeyComponents;
		return isArray(k.Keys) && k.Keys.every(isString);
	} catch {
		return false;
	}
};

//ChartableValueSet is what is returned when we have a request for data
//the length of Names MUST BE the same length as each set of Values in each Set
export interface ChartableValueSet {
	Names: string;
	KeyComps?: Array<KeyComponents>;
	Categories?: Array<string>;
	Values: Array<Chartable>;
}

const isChartableValueSet = (v: unknown): v is ChartableValueSet => {
	try {
		const c = v as ChartableValueSet;
		const keyCompsOK = isUndefined(c.KeyComps) ? true : isArray(c.KeyComps) && c.KeyComps.every(isKeyComponents);
		const categoriesOK = isUndefined(c.Categories) ? true : isArray(c.KeyComps) && c.KeyComps.every(isString);
		return isString(c.Names) && keyCompsOK && categoriesOK && isArray(c.Values) && c.Values.every(isChartable);
	} catch {
		return false;
	}
};

export interface ChartResponse extends BaseRendererResponse {
	Entries: ChartableValueSet;
}

export const isChartResponse = (v: BaseRendererResponse): v is ChartResponse => {
	try {
		const c = v as ChartResponse;
		return isChartableValueSet(c.Entries);
	} catch {
		return false;
	}
};
