/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { array, boolean, constant, date, Decoder, either, hardcoded, inexact, nullable, string } from 'decoders';
import { numericIdDecoder } from '../../value-objects';
import { DATA_TYPE } from '../data-type';
import { User } from './user';

export const userRoleDecoder = either(constant('admin'), constant('analyst'));

export const userDecoder: Decoder<User> = inexact({
	_tag: hardcoded(DATA_TYPE.USER),
	id: numericIdDecoder,
	groupIDs: array(numericIdDecoder),
	username: string,
	name: string,
	email: string,
	role: userRoleDecoder,
	isLocked: boolean,
	lastActivityDate: nullable(date),
	searchGroupID: nullable(string),
	synced: boolean,
});
