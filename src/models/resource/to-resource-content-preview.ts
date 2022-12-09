/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { decode as base64Decode } from 'base-64';
import { RawResourceContentPreview } from './raw-resource-content-preview';
import { ResourceContentPreview } from './resource-content-preview';

export const toResourceContentPreview = (raw: RawResourceContentPreview): ResourceContentPreview => ({
	contentType: raw.ContentType,
	body: base64Decode(raw.Body),
});
