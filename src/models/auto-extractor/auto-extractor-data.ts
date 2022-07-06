/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';
import { AutoExtractorModule } from './auto-extractor';

export interface AutoExtractorData {
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
