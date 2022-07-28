/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '~/value-objects';
import { AUTO_EXTRACTOR_MODULES } from './auto-extractor-modules';

// Named as AXDefinition in the Go source
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

export type RawAutoExtractorModule = typeof AUTO_EXTRACTOR_MODULES[number];
