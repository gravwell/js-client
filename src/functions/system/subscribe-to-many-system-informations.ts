/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APIContext, APISubscription, apiSubscriptionFromWebSocket, buildURL, WebSocket } from '../utils';

export type SystemStatusMessageReceived =
	| { Resp: 'ACK' }
	| SystemStatusPingMessage
	| SystemStatusSystemDescriptionMessage
	| SystemStatusSystemStatusMessage
	| SystemStatusIngestorsStatusMessage
	| SystemStatusIndexersStatusMessage;

type SystemStatusPingMessage = {
	type: 'ping';
	data: { States: { [key: string]: 'OK' } };
};

type SystemStatusSystemDescriptionMessage = {
	type: 'sysDesc';
	data: {
		[key: string]: {
			VirtSystem: string;
			VirtRole: string;
			CPUCount: number;
			CPUModel: string;
			CPUMhz: string;
			CPUCache: string;
			TotalMemoryMB: number;
			SystemVersion: string;
		};
	};
};

type SystemStatusSystemStatusMessage = {
	type: 'sysStats';
	data: {
		Stats: {
			[key: string]: {
				Stats: {
					Uptime: number;
					TotalMemory: number;
					ProcessHeapAllocation: number;
					ProcessSysReserved: number;
					MemoryUsedPercent: number;
					Disks: Array<{
						Mount: string;
						Partition: string;
						Total: number;
						Used: number;
					}>;
					CPUUsage: number;
					CPUCount: number;
					HostHash: string;
					Net: {
						Up: number;
						Down: number;
					};
					IO: Array<{
						Device: string;
						Read: number;
						Write: number;
					}>;
					VirtSystem: string;
					VirtRole: string;
					BuildInfo: {
						Major: number;
						Minor: number;
						Point: number;
						BuildDate: string;
						BuildID: string;
						GUIBuildID: string;
					};
				};
			};
		};
	};
};

type SystemStatusIngestorsStatusMessage = {
	type: 'igstStats';
	data: {
		Stats: {
			[key: string]: {
				QuotaUsed: number;
				QuotaMax: number;
				TotalCount: number;
				TotalSize: number;
				Ingesters: Array<{
					RemoteAddress: string;
					Count: number;
					Size: number;
					Uptime: number;
					Name: string;
					Version: string;
					UUID: string;
					Tags: Array<string>;
				}>;
			};
		};
	};
};

type SystemStatusIndexersStatusMessage = {
	type: 'idxStats';
	data: {
		Stats: {
			[key: string]: {
				UUID: string;
				IndexStats: Array<{
					Name: string;
					Stats: Array<{
						Data: number;
						Entries: number;
						Path: string;
						Cold: boolean;
						Accelerator?: string;
						Extractor?: string;
					}>;
				}>;
			};
		};
	};
};

export type SystemStatusMessageSent = { Subs: Array<SystemStatusCategoryToken> };

const SYSTEM_STATUS_CATEGORIES = {
	'system description': 'sysDesc',
	'system status': 'sysStats',
	'ingestors status': 'igstStats',
	'indexers status': 'idxStats',
	ping: 'ping',
} as const;
export type SystemStatusCategory = keyof typeof SYSTEM_STATUS_CATEGORIES;
type SystemStatusCategoryToken = typeof SYSTEM_STATUS_CATEGORIES[SystemStatusCategory];

export const makeSubscribeToManySystemInformations = (context: APIContext) => {
	const templatePath = '/api/ws/stats';
	const url = buildURL(templatePath, { ...context, protocol: 'ws' });

	return async (
		statusCategories: Array<SystemStatusCategory>,
	): Promise<APISubscription<SystemStatusMessageReceived, SystemStatusMessageSent>> => {
		const socket = new WebSocket(url, context.authToken ?? undefined);
		const subscription = apiSubscriptionFromWebSocket<SystemStatusMessageReceived, SystemStatusMessageSent>(socket);
		const Subs = statusCategories.map(category => SYSTEM_STATUS_CATEGORIES[category]);
		subscription.send({ Subs });
		return subscription;
	};
};
