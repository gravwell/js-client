/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isDate, isNull, isString } from 'lodash';
import { PartialProps } from '../functions/utils';

export interface RawTimeframe {
	durationString: string | null;
	timeframe: string;
	start?: string | null; // Timestamp
	end?: string | null; // Timestamp
}

export interface Timeframe {
	durationString: string | null;
	timeframe: string;
	start: Date | null;
	end: Date | null;
}

export const toTimeframe = (raw: RawTimeframe): Timeframe => ({
	durationString: raw.durationString,
	timeframe: raw.timeframe,
	start: raw.start ? new Date(raw.start) : null,
	end: raw.end ? new Date(raw.end) : null,
});

export const toRawTimeframe = (tf: CreatableTimeframe): RawTimeframe => ({
	durationString: tf.durationString,
	timeframe: tf.timeframe,
	start: tf.start?.toISOString() ?? null,
	end: tf.end?.toISOString() ?? null,
});

export const isTimeframe = (value: any): value is Timeframe => {
	try {
		const tf = <Timeframe>value;
		return (
			(isString(tf.durationString) || isNull(tf.durationString)) &&
			isString(tf.timeframe) &&
			(isDate(tf.start) || isNull(tf.start)) &&
			(isDate(tf.end) || isNull(tf.end))
		);
	} catch {
		return false;
	}
};

export type CreatableTimeframe = PartialProps<Timeframe, 'start' | 'end'>;
