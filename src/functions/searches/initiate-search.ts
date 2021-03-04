/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isEmpty, pick, uniqueId } from 'lodash';
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
import { APISubscription, promiseProgrammatically } from '../utils';

const TASK_ID_PREFIX = 'query-queue-task-id-';

interface QueryQueueTask {
	id: string;

	isReadyPromise: Promise<void>;

	isCompletePromise: Promise<void>;
	complete: () => void;
}

interface InternalQueryQueueTask extends QueryQueueTask {
	isComplete: boolean;
	ready: () => void;
}

class QueryQueue {
	private _tasksByQuery: Record<Query, undefined | Array<InternalQueryQueueTask>> = {};

	public push(query: Query): QueryQueueTask {
		// Create task
		const taskID = uniqueId(TASK_ID_PREFIX);
		const readyPromise = promiseProgrammatically();
		const completePromise = promiseProgrammatically();
		const internalTask: InternalQueryQueueTask = {
			id: taskID,

			isReadyPromise: readyPromise.promise,
			ready: () => readyPromise.resolve(),

			isComplete: false,
			isCompletePromise: completePromise.promise,
			complete: () => {
				internalTask.isComplete = true;
				completePromise.resolve();
			},
		};

		// Insert
		this._tasksByQuery[query] = this._tasksByQuery[query] ?? [];
		this._tasksByQuery[query]?.push(internalTask);
		this._checkQueryTasks(query);

		// Check query task once that's completed
		internalTask.isCompletePromise.then(() => {
			this._checkQueryTasks(query);
		});

		// Convert to external task and return it
		const task: QueryQueueTask = pick(internalTask, 'id', 'isReadyPromise', 'isCompletePromise', 'complete');
		return task;
	}

	private _checkQueryTasks(query: Query): void {
		// Remove completed tasks from queue
		this._tasksByQuery[query] = (this._tasksByQuery[query] ?? []).filter(t => t.isComplete === false);
		if (isEmpty(this._tasksByQuery[query])) delete this._tasksByQuery[query];

		// Mark next task as ready
		const nextInternalTask = this._tasksByQuery[query]?.[0];
		nextInternalTask?.ready();
	}
}

const QUERY_QUEUE = new QueryQueue();

export const initiateSearch = async (
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>,
	query: string,
	range: [Date, Date],
	options: { initialFilterID?: string; metadata?: RawJSON } = {},
): Promise<RawSearchInitiatedMessageReceived> => {
	const queueTask = QUERY_QUEUE.push(query);
	await queueTask.isReadyPromise;

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
			Addendum: options.initialFilterID ? { filterID: options.initialFilterID } : {},
			Background: false,
			Metadata: options.metadata ?? {},
			SearchStart: range[0].toISOString(),
			SearchEnd: range[1].toISOString(),
			SearchString: query,
		},
	});

	const searchInitMsg = await searchInitMsgP.promise;
	queueTask.complete();
	return searchInitMsg;
};
