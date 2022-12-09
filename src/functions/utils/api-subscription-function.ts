/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APISubscription } from './api-subscription';

// (authToken: string | null): Promise<APISubscription<R, S>>;
// (authToken: string | null, one: any): Promise<APISubscription<R, S>>;
// (authToken: string | null, one: any, two: any): Promise<APISubscription<R, S>>;
// (authToken: string | null, one: any, two: any, three: any): Promise<APISubscription<R, S>>;
// (authToken: string | null, one: any, two: any, three: any, four: any): Promise<APISubscription<R, S>>;
export type APISubscriptionFunction<R, S> = (
	authToken: string | null,
	one: any,
	two: any,
	three: any,
	four: any,
	five: any,
) => Promise<APISubscription<R, S>>;
