/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Observable, Subject } from 'rxjs';
import { InstallableKit } from '~/models/kit/installable-kit';
import { KitInstallationStatus } from '~/models/kit/kit-installation-status';
import { RawKitInstallationStatus } from '~/models/kit/raw-kit-installation-status';
import { toKitInstallationStatus } from '~/models/kit/to-kit-installation-status';
import { toRawInstallableKit } from '~/models/kit/to-raw-installable-kit';
import { ID, NumericID, RawNumericID, toNumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { APISubscription } from '../utils/api-subscription';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeInstallOneKit = (
	context: APIContext,
): ((data: InstallableKit) => Promise<APISubscription<KitInstallationStatus, never>>) => {
	const queueOneKitForInstallation = makeQueueOneKitForInstallation(context);
	const getOneKitInstallationStatus = makeGetOneKitInstallationStatus(context);

	const subscribeToOneKitInstallationStatus = (installationID: ID): Observable<KitInstallationStatus> =>
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

		_received$.subscribe({ next: receivedMessage => received.push(receivedMessage), error: err => console.warn(err) });
		_sent$.subscribe({ next: sentMessage => sent.push(sentMessage), error: err => console.warn(err) });

		const installationID = await queueOneKitForInstallation(data);
		const statusSub = subscribeToOneKitInstallationStatus(installationID).subscribe({
			next: status => {
				_received$.next(status);
			},
			error: err => console.warn(err),
		});

		const close = (): void => {
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

const wait = (ms: number): Promise<void> => new Promise<void>(res => setTimeout(res, ms));

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
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { kitID: data.id } });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawInstallableKit(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawStatusID = await parseJSONResponse<RawNumericID>(raw);
			return toNumericID(rawStatusID);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
