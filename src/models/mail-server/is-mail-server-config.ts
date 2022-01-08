/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isNil, isNumber, isPlainObject, isString } from 'lodash';
import { MailServerConfig } from './mail-server-config';

export const isMailServerConfig = (v: any): v is MailServerConfig => {
	if (isPlainObject(v)) {
		return (
			isOfTypeOrNil(v.server, isString) &&
			isOfTypeOrNil(v.password, isString) &&
			isOfTypeOrNil(v.string, isString) &&
			isOfTypeOrNil(v.port, isNumber) &&
			isOfTypeOrNil(v.useTLS, isBoolean) &&
			isOfTypeOrNil(v.insecureSkipVerify, isBoolean)
		);
	}
	return false;
};

const isOfTypeOrNil = (v: any, func: (value: any) => boolean): boolean => {
	return func(v) || isNil(v);
};
