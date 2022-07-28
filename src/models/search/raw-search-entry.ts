/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNull, isNumber, isString } from 'lodash';

// Named SearchEntry in Go
/**
 * The entry that makes it out of the search pipeline
 */
export interface RawSearchEntry {
	TS: string;
	Tag: number;
	SRC: string; // IP
	Data: string | null; // base64
	Enumerated: Array<RawEnumeratedPair>;
}

export const isRawSearchEntry = (v: unknown): v is RawSearchEntry => {
	try {
		const s = v as RawSearchEntry;
		return (
			isString(s.TS) &&
			isString(s.SRC) &&
			isNumber(s.Tag) &&
			(isString(s.Data) || isNull(s.Data)) &&
			isArray(s.Enumerated) &&
			s.Enumerated.every(isRawEnumeratedPair)
		);
	} catch {
		return false;
	}
};

// Named StringTagEntry in Go
/**
 * Used for scripting and ingesting entries via the webserver
 */
export interface RawStringTagEntry {
	TS: string;
	Tag: string;
	SRC: string; // IP
	Data: string | null; // base64
	Enumerated: Array<RawEnumeratedPair>;
}

export const isRawStringTagEntry = (v: unknown): v is RawStringTagEntry => {
	try {
		const s = v as RawStringTagEntry;
		return (
			isString(s.TS) &&
			isString(s.Tag) &&
			isString(s.SRC) &&
			(isString(s.Data) || isNull(s.Data)) &&
			isArray(s.Enumerated) &&
			s.Enumerated.every(isRawEnumeratedPair)
		);
	} catch {
		return false;
	}
};

// Named EnumeratedPair in Go
/**
 * String representation of enumerated values
 */
export interface RawEnumeratedPair {
	Name: string;
	ValueStr: string;

	// Kris: .Value is internal to Go an should NOT be exposed
	// Value: RawEnumeratedValue;
}

export const isRawEnumeratedPair = (v: unknown): v is RawEnumeratedPair => {
	try {
		const e = v as RawEnumeratedPair;
		return isString(e.Name) && isString(e.ValueStr);
	} catch {
		return false;
	}
};
