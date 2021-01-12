/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export const getEnvVar = (key: string): string | undefined => {
	const value = (window as any).__env__[key];
	return value === 'undefined' ? undefined : value;
};
