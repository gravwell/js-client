/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isMacroData } from './is-macro-data';
import { Macro } from './macro';

export const isMacro = (value: unknown): value is Macro => {
	try {
		const m = <Macro>value;
		return m._tag === DATA_TYPE.MACRO && isMacroData(m);
	} catch {
		return false;
	}
};
