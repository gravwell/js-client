/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isString } from 'lodash';

export interface RawRenderModule {
	Name: string;
	Description: string;
	Examples: Array<string>;

	SortRequired: boolean;
}

export interface RenderModule {
	name: string;
	description: string;
	examples: Array<string>;

	sortingRequired: boolean;
}

export const toRenderModule = (raw: RawRenderModule): RenderModule => ({
	name: raw.Name,
	description: raw.Description,
	examples: raw.Examples,

	sortingRequired: raw.SortRequired,
});

export const isRenderModule = (value: any): value is RenderModule => {
	try {
		const m = <RenderModule>value;
		return isString(m.name) && isString(m.description) && m.examples.every(isString) && isBoolean(m.sortingRequired);
	} catch {
		return false;
	}
};
