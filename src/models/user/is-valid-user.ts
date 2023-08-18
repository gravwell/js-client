/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { date, Decoder, inexact, nullable as nullableDecoder } from 'decoders';
import { array, boolean, constant, either, nullable, string } from '~/functions/utils/verifiers';
import { numericIdDecoder } from '../../value-objects';
import { DATA_TYPE } from '../data-type';
import { User } from './user';

export const userRoleDecoder = either(constant('admin'), constant('analyst'));

export const userDecoder: Decoder<User> = inexact({
	_tag: constant(DATA_TYPE.USER),
	id: numericIdDecoder,
	groupIDs: array(numericIdDecoder),
	username: string,
	name: string,
	email: string,
	role: userRoleDecoder,
	isLocked: boolean,
	lastActivityDate: nullableDecoder(date),
	searchGroupID: nullable(string),
	synced: boolean,
});
