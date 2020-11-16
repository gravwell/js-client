/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { VOFloat } from '@lucaspaganini/value-objects';

/**
 * Floating point number with two decimal digits from 0.00 to 100.00.
 */
export class Percentage extends VOFloat({ min: 0, max: 100, precision: 2, precisionTrim: 'round' }) {
	constructor(raw: RawPercentage) {
		super(raw * 100);
	}

	public toString(): string {
		return this.valueOf() + '%';
	}

	public static from(raw: RawPercentage): Percentage {
		return new Percentage(raw);
	}
}

/**
 * Floating point number from 0 to 1.
 */
export type RawPercentage = number;

export const isPercentage = (v: any): v is Percentage => v instanceof Percentage;
