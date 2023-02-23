/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omitUndefinedShallow } from '~/functions/utils';
import { CreatableUser } from './creatable-user';
import { RawCreatableUser } from './raw-creatable-user';

export const toRawCreatableUser = (creatable: CreatableUser): RawCreatableUser =>
	omitUndefinedShallow({
		User: creatable.username,
		Pass: creatable.password,
		Name: creatable.name,
		Email: creatable.email,
		Admin: creatable.role === 'admin',
	});
