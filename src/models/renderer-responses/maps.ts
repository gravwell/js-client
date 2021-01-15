/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isArray, isNumber, isString, isUndefined } from 'lodash';
import { BaseRendererResponse } from './renderer';

export interface PointmapKV {
	Key: string;
	Value: string;
}

const isPointmapKV = (v: unknown): v is PointmapKV => {
	try {
		const p = v as PointmapKV;
		return isString(p.Key) && isString(p.Value);
	} catch {
		return false;
	}
};

export interface Location {
	Lat: number;
	Long: number;
}

const isLocation = (v: unknown): v is Location => {
	try {
		const l = v as Location;
		return isNumber(l.Lat) && isNumber(l.Long);
	} catch {
		return false;
	}
};

export interface PointmapValue {
	Loc: Location;
	Metadata?: Array<PointmapKV>;
}

const isPointmapValue = (v: unknown): v is PointmapValue => {
	try {
		const p = v as PointmapValue;
		const metadataOK = isUndefined(p.Metadata) || (isArray(p.Metadata) && p.Metadata.every(isPointmapKV));
		return isLocation(p.Loc) && metadataOK;
	} catch {
		return false;
	}
};

export interface PointmapResponse extends BaseRendererResponse {
	Entries?: Array<PointmapValue>;
}

export const isPointmapResponse = (v: BaseRendererResponse): v is PointmapResponse => {
	try {
		const p = v as PointmapResponse;
		return isUndefined(p.Entries) || (isArray(p.Entries) && p.Entries.every(isPointmapValue));
	} catch {
		return false;
	}
};

export interface HeatmapValue extends Location {
	Magnitude?: number;
}

const isHeatmapValue = (v: unknown): v is HeatmapValue => {
	try {
		const h = v as HeatmapValue;
		const magnitudeOK = isUndefined(h.Magnitude) || isNumber(h.Magnitude);
		return magnitudeOK && isLocation(h);
	} catch {
		return false;
	}
};

export interface HeatmapResponse extends BaseRendererResponse {
	Entries?: Array<HeatmapValue>;
}

export const isHeatmapResponse = (v: BaseRendererResponse): v is HeatmapResponse => {
	try {
		const p = v as HeatmapResponse;
		return isUndefined(p.Entries) || (isArray(p.Entries) && p.Entries.every(isHeatmapValue));
	} catch {
		return false;
	}
};

export interface P2PValue {
	Src: Location;
	Dst: Location;
	Magnitude?: number;
	Values?: Array<string>;
}

const isP2PValue = (v: unknown): v is P2PValue => {
	try {
		const p = v as P2PValue;
		const magnitudeOK = isUndefined(p.Magnitude) || isNumber(p.Magnitude);
		const valuesOK = isUndefined(p.Values) || (isArray(p.Values) && p.Values.every(isString));
		return isLocation(p.Src) && isLocation(p.Dst) && magnitudeOK && valuesOK;
	} catch {
		return false;
	}
};

export interface P2PResponse extends BaseRendererResponse {
	ValueNames: Array<string>;
	Entries?: Array<P2PValue>;
}

export const isP2PResponse = (v: BaseRendererResponse): v is P2PResponse => {
	try {
		const p = v as P2PResponse;
		const entriesOK = isUndefined(p.Entries) || (isArray(p.Entries) && p.Entries.every(isP2PValue));
		return isArray(p.ValueNames) && p.ValueNames.every(isString) && entriesOK;
	} catch {
		return false;
	}
};
