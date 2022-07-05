/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { Template } from './template';
import { TemplateData } from './template-data';

export const fromTemplateDataToTemplate = (data: TemplateData): Template => ({
	...data,
	_tag: DATA_TYPE.TEMPLATE,
});
