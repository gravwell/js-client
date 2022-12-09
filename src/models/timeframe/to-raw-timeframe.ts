/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableTimeframe } from './creatable-timeframe';
import { RawTimeframe } from './raw-timeframe';

export const toRawTimeframe = (tf: CreatableTimeframe): RawTimeframe => ({
	durationString: tf.durationString,
	timeframe: tf.timeframe,
	timezone: tf.timezone,
	start: tf.start?.toISOString() ?? null,
	end: tf.end?.toISOString() ?? null,
});
