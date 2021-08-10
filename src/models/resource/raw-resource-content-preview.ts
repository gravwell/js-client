/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawResourceContentPreview {
	ContentType: string; // eg. 'text/plain; charset=utf-8'
	Body: string; // base 64 encoded string
}
