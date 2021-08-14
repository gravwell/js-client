/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {MailServerConfig} from './mail-server-config';
import {isPlainObject, isBoolean, isString, isNumber, isNil} from 'lodash';

export const isMailServerConfig = (v: any): v is MailServerConfig => {
	if (isPlainObject(v)) {
		return isOfTypeOrNil(v.server, isString) &&
			isOfTypeOrNil(v.password, isString) &&
			isOfTypeOrNil(v.string, isString) &&
			isOfTypeOrNil(v.port, isNumber) &&
			isOfTypeOrNil(v.useTLS, isBoolean) &&
			isOfTypeOrNil(v.insecureSkipVerify, isBoolean);
	}
	return false;
}

const isOfTypeOrNil = (v: any, func: (value: any) => boolean): boolean => {
	return func(v) || isNil(v);
}
