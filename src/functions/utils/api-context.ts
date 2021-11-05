/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { fetch } from './fetch';

export interface APIContext {
	host: string;
	useEncryption: boolean;
	authToken: string | null;
	fetch: typeof fetch;
}
