/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { appendFileSync } from 'fs';

// This function will add a code block in the bottom of some docs page (normally the html files),
// for example, it could add the following code block:
// <script>console.log('hello world')</script>
export const addCodeBlock = (filePath: string, code: string): void => {
	appendFileSync(filePath, code);
};
