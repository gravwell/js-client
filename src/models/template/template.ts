/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '../data-type';
import { TemplateData } from './template-data';

export interface Template extends TemplateData {
	_tag: DATA_TYPE.TEMPLATE;
}

export type TemplateVariable = {
	name: string; // eg %%VAR%%
	label: string;
	description?: string; // Hint
	required?: boolean;
	defaultValue?: string;
	previewValue?: string | null;
};
