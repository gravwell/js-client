/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { makeRestartIndexers } from '../../functions/indexers';
import { APIContext } from '../../functions/utils';
import { IndexersService } from './service';

export const createIndexersService = (context: APIContext): IndexersService => ({
	restart: makeRestartIndexers(context),
});
