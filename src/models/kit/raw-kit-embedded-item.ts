/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawKitEmbeddedItem {
	Type: 'license'; // for now only licenses
	Name: string;
	Content: string; // base64 encoded
}
