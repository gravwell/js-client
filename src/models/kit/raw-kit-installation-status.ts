/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawPercentage } from '~/value-objects';

export interface RawKitInstallationStatus {
	CurrentStep: string; // The last line in .Log
	Done: boolean;
	Error: string; // '' is null
	InstallID: RawNumericID;
	Log: string; // Has line breaks using "\n"
	Owner: RawNumericID;
	Percentage: RawPercentage; // 1 is 100%
	Updated: string; // timestamp
}
