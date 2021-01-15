/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString } from 'lodash';
import { BaseRendererResponse } from './renderer';

export interface StackGraphValue {
	Label: string;
	Value: number;
}

const isStackGraphValue = (v: unknown): v is StackGraphValue => {
	try {
		const s = v as StackGraphValue;
		return isString(s.Label) && isNumber(s.Value);
	} catch {
		return false;
	}
};

export interface StackGraphSet {
	Key: string;
	Values: Array<StackGraphValue>;
}

const isStackGraphSet = (v: unknown): v is StackGraphSet => {
	try {
		const s = v as StackGraphSet;
		return isString(s.Key) && s.Values.every(isStackGraphValue);
	} catch {
		return false;
	}
};

export interface StackGraphResponse extends BaseRendererResponse {
	Entries: Array<StackGraphSet>;
}

export const isStackGraphResponse = (v: BaseRendererResponse): v is StackGraphResponse => {
	try {
		const s = v as StackGraphResponse;
		return isArray(s.Entries) && s.Entries.every(isStackGraphSet);
	} catch {
		return false;
	}
};
