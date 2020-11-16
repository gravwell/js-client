/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Observable, Subject } from 'rxjs';
import { ID, NumericID, Percentage, RawNumericID, RawPercentage, toNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	APISubscription,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeInstallOneKit = (makerOptions: APIFunctionMakerOptions) => {
	const queueOneKitForInstallation = makeQueueOneKitForInstallation(makerOptions);
	const getOneKitInstallationStatus = makeGetOneKitInstallationStatus(makerOptions);
	const subscribeToOneKitInstallationStatus = (authToken: string | null, installationID: ID) =>
		new Observable<KitInstallationStatus>(observer => {
			(async () => {
				while (observer.closed === false) {
					try {
						const status = await getOneKitInstallationStatus(authToken, installationID);
						observer.next(status);
						if (status.isDone) observer.complete();
						await wait(1000);
					} catch (err) {
						observer.error(err);
					}
				}
			})();
		});

	return async (
		authToken: string | null,
		data: InstallableKit,
	): Promise<APISubscription<KitInstallationStatus, never>> => {
		const _received$ = new Subject<KitInstallationStatus>();
		const _sent$ = new Subject<never>();

		const received: Array<KitInstallationStatus> = [];
		const sent = [] as Array<never>;

		_received$.subscribe(receivedMessage => received.push(receivedMessage));
		_sent$.subscribe(sentMessage => sent.push(sentMessage));

		const installationID = await queueOneKitForInstallation(authToken, data);
		const statusSub = subscribeToOneKitInstallationStatus(authToken, installationID).subscribe(status => {
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

const makeGetOneKitInstallationStatus = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, installationID: NumericID): Promise<KitInstallationStatus> => {
		const templatePath = '/api/kits/status/{installationID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { installationID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawKitInstallationStatus>(raw);
		return toKitInstallationStatus(rawRes);
	};
};

const toKitInstallationStatus = (raw: RawKitInstallationStatus): KitInstallationStatus => ({
	id: toNumericID(raw.InstallID),
	userID: toNumericID(raw.Owner),

	percentage: Percentage.from(raw.Percentage),
	isDone: raw.Done,

	logs: raw.Log.split('\n')
		.map(l => l.trim())
		.filter(l => l.length > 0),
	error: raw.Error === '' ? null : raw.Error,

	lastUpdateDate: new Date(raw.Updated),
});

export interface KitInstallationStatus {
	id: NumericID;
	userID: ID;

	percentage: Percentage;
	isDone: boolean;

	logs: Array<string>;
	error: string | null;

	lastUpdateDate: Date;
}

interface RawKitInstallationStatus {
	CurrentStep: string; // The last line in .Log
	Done: boolean;
	Error: string; // '' is null
	InstallID: RawNumericID;
	Log: string; // Has line breaks using "\n"
	Owner: RawNumericID;
	Percentage: RawPercentage; // 1 is 100%
	Updated: string; // timestamp
}

const makeQueueOneKitForInstallation = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, data: InstallableKit): Promise<NumericID> => {
		const templatePath = '/api/kits/{kitID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawInstallableKit(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawStatusID = await parseJSONResponse<RawNumericID>(raw);
			return toNumericID(rawStatusID);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface InstallableKit {
	labels?: Array<string>;
	isGlobal?: boolean;

	overwriteExisting?: boolean;
	allowUnsigned?: boolean;
	allowExternalResource?: boolean;

	settings?: Array<{
		type: 'macro value';
		name: string;
		description: string;
		defaultValue: string;
		value: string | null;
		valueType: 'tag' | 'string';
	}>;
}

export interface RawInstallableKit {
	Labels: Array<string>;
	Global: boolean;
	OverwriteExisting: boolean;
	AllowUnsigned: boolean;
	AllowExternalResource: boolean;
	ConfigMacros: Array<{
		DefaultValue: string;
		Description: string;
		MacroName: string;
		Value: string | null;
		Type: 'TAG' | 'STRING';
	}>;
}

export const toRawInstallableKit = (data: InstallableKit): RawInstallableKit => ({
	Labels: data.labels ?? [],
	Global: data.isGlobal ?? false,
	OverwriteExisting: data.overwriteExisting ?? false,
	AllowUnsigned: data.allowUnsigned ?? false,
	AllowExternalResource: data.allowExternalResource ?? false,
	ConfigMacros: (data.settings ?? []).map(s => ({
		DefaultValue: s.defaultValue,
		Description: s.description,
		MacroName: s.name,
		Value: s.value,
		Type: s.valueType === 'tag' ? 'TAG' : 'STRING',
	})),
});
