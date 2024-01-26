/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import fc from 'fast-check';
import { ScheduledQueryDuration } from '~/models/scheduled-task/scheduled-query-data';
import { durationToSeconds } from '~/models/scheduled-task/to-raw-creatable-scheduled-task';
import { secondsToDuration } from '~/models/scheduled-task/to-scheduled-task';

describe('ScheduledQueryDuration', (): void => {
	it('Seconds to Duration to Seconds should match original Seconds', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0 }), expectedSeconds => {
				const duration: ScheduledQueryDuration = secondsToDuration(expectedSeconds);
				const actualSeconds: number = durationToSeconds(duration);

				const p = actualSeconds === expectedSeconds;
				expect(p).toBeTrue();
				return p;
			}),
		);
	});

	it('ScheduledQueryDuration#hours bounds are ok', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0 }), expectedSeconds => {
				const duration: ScheduledQueryDuration = secondsToDuration(expectedSeconds);

				const p = duration.hours < 24 || duration.hours >= 0;
				expect(p).toBeTrue();
				return p;
			}),
		);
	});

	it('ScheduledQueryDuration#minutes bounds are ok', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0 }), expectedSeconds => {
				const duration: ScheduledQueryDuration = secondsToDuration(expectedSeconds);

				const p = duration.minutes < 60 || duration.minutes >= 0;
				expect(p).toBeTrue();
				return p;
			}),
		);
	});

	it('ScheduledQueryDuration#seconds bounds are ok', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0 }), expectedSeconds => {
				const duration: ScheduledQueryDuration = secondsToDuration(expectedSeconds);

				const p = duration.seconds < 60 || duration.seconds >= 0;
				expect(p).toBeTrue();
				return p;
			}),
		);
	});

	it('ScheduledQueryDuration#hours has no decimal', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0 }), expectedSeconds => {
				const duration: ScheduledQueryDuration = secondsToDuration(expectedSeconds);

				const p = Math.floor(duration.hours) === duration.hours;
				expect(p).toBeTrue();
				return p;
			}),
		);
	});

	it('ScheduledQueryDuration#minutes has no decimal', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0 }), expectedSeconds => {
				const duration: ScheduledQueryDuration = secondsToDuration(expectedSeconds);

				const p = Math.floor(duration.minutes) === duration.minutes;
				expect(p).toBeTrue();
				return p;
			}),
		);
	});

	it('ScheduledQueryDuration#seconds has no decimal', () => {
		fc.assert(
			fc.property(fc.integer({ min: 0 }), expectedSeconds => {
				const duration: ScheduledQueryDuration = secondsToDuration(expectedSeconds);

				const p = Math.floor(duration.seconds) === duration.seconds;
				expect(p).toBeTrue();
				return p;
			}),
		);
	});
});
