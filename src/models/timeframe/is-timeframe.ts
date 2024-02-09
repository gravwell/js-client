/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { either, instanceOf, null_, object, string, Verifier } from '~/functions/utils/verifiers';
import { Timeframe } from './timeframe';

export const timeframeVerifier: Verifier<Timeframe> = object({
	durationString: either(string, null_),
	timeframe: either(string, null_),
	timezone: either(string, null_),
	start: either(instanceOf(Date), null_),
	end: either(instanceOf(Date), null_),
});

export const isTimeframe = timeframeVerifier.guard;
