/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { filter, first } from 'rxjs/operators';
import {
	RawAcceptSearchMessageSent,
	RawInitiateSearchMessageSent,
	RawSearchInitiatedMessageReceived,
	RawSearchMessageReceived,
	RawSearchMessageSent,
} from '~/models';
import { APISubscription, promiseProgrammatically } from '../../utils';

export const initiateSearch = async (
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>,
	query: string,
	range: [Date, Date],
): Promise<RawSearchInitiatedMessageReceived> => {
	const searchInitMsgP = promiseProgrammatically<RawSearchInitiatedMessageReceived>();
	rawSubscription.received$
		.pipe(
			filter((msg): msg is RawSearchInitiatedMessageReceived => {
				try {
					const _msg = <RawSearchInitiatedMessageReceived>msg;
					return _msg.type === 'search' && _msg.data.RawQuery === query;
				} catch {
					return false;
				}
			}),
			first(),
		)
		.subscribe(
			msg => {
				searchInitMsgP.resolve(msg);
				rawSubscription.send(<RawAcceptSearchMessageSent>{
					type: 'search',
					data: { OK: true, OutputSearchSubproto: msg.data.OutputSearchSubproto },
				});
			},
			err => searchInitMsgP.reject(err),
		);

	rawSubscription.send(<RawInitiateSearchMessageSent>{
		type: 'search',
		data: {
			Background: false,
			Metadata: {} as any,
			SearchStart: range[0].toISOString(),
			SearchEnd: range[1].toISOString(),
			SearchString: query,
		},
	});

	return await searchInitMsgP.promise;
};
