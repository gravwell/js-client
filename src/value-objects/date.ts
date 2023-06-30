/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { iso8601 } from 'decoders';
import { mkTypeGuard } from '../functions/utils/type-guards';

/**
 * Returns true if the value can be parsed as an ISO8601 date string, otherwise
 * false
 */
export const isTimestamp: (value: unknown) => boolean = mkTypeGuard(iso8601);
