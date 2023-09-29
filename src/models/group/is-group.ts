/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { boolean, constant, inexact, nullable, string, Verifier } from '~/functions/utils/verifiers';
import { numericIdDecoder } from '../../value-objects';
import { DATA_TYPE } from '../data-type';
import { Group } from './group';

export const groupDecoder: Verifier<Group> = inexact({
	_tag: constant(DATA_TYPE.GROUP),
	id: numericIdDecoder,
	name: string,
	description: nullable(string),
	isSynced: boolean,
});
