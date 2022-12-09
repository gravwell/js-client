/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { fetch } from './fetch';

type UnpackedPromise<P> = P extends Promise<infer T> ? T : never;

export type Response = UnpackedPromise<ReturnType<typeof fetch>>;
