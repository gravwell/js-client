/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Observable, Subject } from 'rxjs';
import {
	InstallableKit,
	KitInstallationStatus,
	RawKitInstallationStatus,
	toKitInstallationStatus,
	toRawInstallableKit,
} from '~/models';
import { ID, NumericID, RawNumericID, toNumericID } from '~/value-objects';
import {
	APIContext,
	APISubscription,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeInstallOneKit = (context: APIContext) => {
	const queueOneKitForInstallation = makeQueueOneKitForInstallation(context);
	const getOneKitInstallationStatus = makeGetOneKitInstallationStatus(context);
	const subscribeToOneKitInstallationStatus = (installationID: ID) =>
		new Observable<KitInstallationStatus>(observer => {
			(async () => {
				while (observer.closed === false) {
					try {
						const status = await getOneKitInstallationStatus(installationID);
						observer.next(status);
						if (status.isDone) {
							observer.complete();
						}
						await wait(1000);
					} catch (err) {
						observer.error(err);
					}
				}
			})();
		});

	return async (data: InstallableKit): Promise<APISubscription<KitInstallationStatus, never>> => {
		const _received$ = new Subject<KitInstallationStatus>();
		const _sent$ = new Subject<never>();

		const received: Array<KitInstallationStatus> = [];
		const sent = [] as Array<never>;

		_received$.subscribe(receivedMessage => received.push(receivedMessage));
		_sent$.subscribe(sentMessage => sent.push(sentMessage));

		const installationID = await queueOneKitForInstallation(data);
		const statusSub = subscribeToOneKitInstallationStatus(installationID).subscribe(status => {
			_received$.next(status);
		});

		const close = () => {
			_received$.complete();
			_sent$.complete();
			statusSub.unsubscribe();
		};

		return {
			send: (): Promise<void> => Promise.resolve(),
			close,
			received,
			received$: _received$.asObservable(),
			sent,
			sent$: _sent$.asObservable(),
		};
	};
};

const wait = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

const makeGetOneKitInstallationStatus =
	(context: APIContext) =>
	async (installationID: NumericID): Promise<KitInstallationStatus> => {
		const templatePath = '/api/kits/status/{installationID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { installationID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawKitInstallationStatus>(raw);
		return toKitInstallationStatus(rawRes);
	};

const makeQueueOneKitForInstallation =
	(context: APIContext) =>
	async (data: InstallableKit): Promise<NumericID> => {
		const templatePath = '/api/kits/{kitID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http' });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawInstallableKit(data)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawStatusID = await parseJSONResponse<RawNumericID>(raw);
			return toNumericID(rawStatusID);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
