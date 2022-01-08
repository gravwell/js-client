/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawValidatedScript } from './raw-validated-script';
import { ValidatedScript } from './validated-script';

export const toValidatedScript = (raw: RawValidatedScript): ValidatedScript => {
	switch (raw.OK) {
		case true:
			return {
				isValid: true,
				error: null,
			};
		case false:
			return {
				isValid: false,
				error: {
					message: raw.Error ?? 'Unknown error',
					line: raw.ErrorLine === -1 ? null : raw.ErrorLine,
					column: raw.ErrorColumn === -1 ? null : raw.ErrorColumn,
				},
			};
	}
};
