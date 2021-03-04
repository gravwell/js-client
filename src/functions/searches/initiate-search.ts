/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isEmpty, isNil } from 'lodash';
import { filter, first } from 'rxjs/operators';
import {
	Query,
	RawAcceptSearchMessageSent,
	RawInitiateSearchMessageSent,
	RawSearchInitiatedMessageReceived,
	RawSearchMessageReceived,
	RawSearchMessageSent,
} from '~/models';
import { RawJSON } from '~/value-objects';
import { APISubscription, createProgrammaticPromise } from '../utils';

interface QueryQueueTask {
	run: () => Promise<void>;
	isRunning: boolean;
	isComplete: boolean;
}

class QueryQueue {
	private _tasksByQuery: Record<Query, undefined | Array<QueryQueueTask>> = {};

	public push<T>(query: Query, fn: () => Promise<T>): Promise<T> {
		// Create task
		const taskPromise = createProgrammaticPromise<T>();

		const task: QueryQueueTask = {
			run: async () => {
				task.isRunning = true;
				try {
					const result = await fn();
					taskPromise.resolve(result);
					task.isComplete = true;
				} catch (err) {
					taskPromise.reject(err);
					task.isComplete = true;
				}
			},
			isRunning: false,
			isComplete: false,
		};

		// Check query tasks once that's completed
		taskPromise.promise.then(() => {
			this._checkQueryTasks(query);
		});

		// Insert
		this._tasksByQuery[query] = this._tasksByQuery[query] ?? [];
		this._tasksByQuery[query]?.push(task);
		this._checkQueryTasks(query);

		return taskPromise.promise;
	}

	private _checkQueryTasks(query: Query): void {
		// Remove completed tasks from queue
		this._tasksByQuery[query] = (this._tasksByQuery[query] ?? []).filter(t => t.isComplete === false);
		if (isEmpty(this._tasksByQuery[query])) delete this._tasksByQuery[query];

		// Run next task
		const nextInternalTask = this._tasksByQuery[query]?.[0] ?? null;
		if (isNil(nextInternalTask)) return;
		if (nextInternalTask.isRunning === false) nextInternalTask.run();
	}
}

const QUERY_QUEUE = new QueryQueue();

export const initiateSearch = async (
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>,
	query: string,
	range: [Date, Date],
	options: { initialFilterID?: string; metadata?: RawJSON } = {},
): Promise<RawSearchInitiatedMessageReceived> => {
	const task = async (): Promise<RawSearchInitiatedMessageReceived> => {
		const searchInitMsgP = createProgrammaticPromise<RawSearchInitiatedMessageReceived>();
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
				Addendum: options.initialFilterID ? { filterID: options.initialFilterID } : {},
				Background: false,
				Metadata: options.metadata ?? {},
				SearchStart: range[0].toISOString(),
				SearchEnd: range[1].toISOString(),
				SearchString: query,
			},
		});

		const searchInitMsg = await searchInitMsgP.promise;
		return searchInitMsg;
	};

	return await QUERY_QUEUE.push(query, task);
};
