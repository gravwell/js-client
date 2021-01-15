/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString } from 'lodash';

// Used for scripting and ingesting entries via the webserver
export interface StringTagEntry {
	TS: string;
	Tag: string;
	SRC: string; // IP
	Data: string; // base64
	Enumerated: Array<EnumeratedPair>;
}

export const isStringTagEntry = (v: unknown): v is StringTagEntry => {
	try {
		const s = v as StringTagEntry;
		return (
			isString(s.TS) &&
			isString(s.Tag) &&
			isString(s.SRC) &&
			isString(s.Data) &&
			isArray(s.Enumerated) &&
			s.Enumerated.every(isEnumeratedPair)
		);
	} catch {
		return false;
	}
};

//search entry is the entry that makes it out of the search pipeline
export interface SearchEntry {
	TS: string;
	SRC: string; // IP
	Tag: number;
	Data: string; // base64
	Enumerated: Array<EnumeratedPair>;
}

export const isSearchEntry = (v: unknown): v is SearchEntry => {
	try {
		const s = v as SearchEntry;
		return (
			isString(s.TS) &&
			isString(s.SRC) &&
			isNumber(s.Tag) &&
			isString(s.Data) &&
			isArray(s.Enumerated) &&
			s.Enumerated.every(isEnumeratedPair)
		);
	} catch {
		return false;
	}
};

// EnumeratedPair is the string representation of enumerated values
export interface EnumeratedPair {
	Name: string;
	ValueStr: string;
	Value: RawEnumeratedValue;
}

export const isEnumeratedPair = (v: unknown): v is EnumeratedPair => {
	try {
		const e = v as EnumeratedPair;
		return isString(e.Name) && isString(e.ValueStr) && isRawEnumeratedValue(e.Value);
	} catch {
		return false;
	}
};

export interface RawEnumeratedValue {
	Type: number;
	Data: string; // base 64
}

export const isRawEnumeratedValue = (v: unknown): v is RawEnumeratedValue => {
	try {
		const r = v as RawEnumeratedValue;
		return isNumber(r.Type) && isString(r.Data);
	} catch {
		return false;
	}
};
