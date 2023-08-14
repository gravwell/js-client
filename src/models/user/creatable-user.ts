/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Decoder, object, string } from 'decoders';
import { userRoleDecoder } from './is-valid-user';
import { UserRole } from './user';

export interface CreatableUser {
	username: string;
	password: string;
	name: string;
	email: string;
	role: UserRole;
}

export const creatableUserDecoder: Decoder<CreatableUser> = object({
	username: string,
	password: string,
	name: string,
	email: string,
	role: userRoleDecoder,
});
