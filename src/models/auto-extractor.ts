/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, RawNumericID, RawUUID, UUID } from '../value-objects';

export interface AutoExtractor {
	id: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;

	/**
	 * Human-friendly name for the extraction
	 */
	name: string;
	/**
	 * Human-friendly string that describes the extraction
	 */
	description: string;
	labels: Array<string>;

	isGlobal: boolean;

	lastUpdateDate: Date;

	/**
	 * Tag associated with the extraction
	 */
	tag: string;
	/**
	 * The processing module used for extraction
	 */
	module: AutoExtractorModule;
	/**
	 * The extraction definition
	 */
	parameters: string;
	/**
	 * Optional module-specific arguments used to change the behavior of the extracton module
	 */
	arguments: string | null;
}

export type RawAutoExtractorModule = 'csv' | 'fields' | 'regex' | 'slice';
export type AutoExtractorModule = RawAutoExtractorModule;

export interface RawAutoExtractor {
	UUID: RawUUID;

	UID: RawNumericID;
	GIDs: Array<RawNumericID> | null;

	Name: string;
	Desc: string;
	Labels: Array<string> | null;

	Global: boolean;
	LastUpdated: string; // Timestamp

	Tag: string;
	Module: RawAutoExtractorModule;
	Params: string;
	Args?: string;
	Accelerated: '';
}

export const toAutoExtractor = (raw: RawAutoExtractor): AutoExtractor => ({
	id: raw.UUID,

	userID: raw.UID.toString(),
	groupIDs: raw.GIDs?.map(id => id.toString()) ?? [],

	name: raw.Name,
	description: raw.Desc,
	labels: raw.Labels ?? [],

	isGlobal: raw.Global,
	lastUpdateDate: new Date(raw.LastUpdated),

	tag: raw.Tag,
	module: raw.Module,
	parameters: raw.Params,
	arguments: raw.Args ?? null,
});

export const isAutoExtractor = (value: any): value is AutoExtractor => {
	try {
		const ae = <AutoExtractor>value;
		return !!ae;
	} catch {
		return false;
	}
};
