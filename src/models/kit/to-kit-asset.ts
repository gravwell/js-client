/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNil } from 'lodash';
import { KitAsset } from './kit-asset';
import { RawKitAsset } from './raw-kit-asset';

export const toKitAsset = (rawKitAsset: RawKitAsset, kitGlobalID: string): KitAsset => {
	switch (rawKitAsset.Type) {
		case 'readme':
			return {
				type: 'readme',
				url: `kits/remote/${kitGlobalID}/${rawKitAsset.Source}`,
				isFeatured: rawKitAsset.Featured,
			};
		case 'image':
			return {
				type: 'image',
				description: rawKitAsset.Legend,
				url: `kits/remote/${kitGlobalID}/${rawKitAsset.Source}`,
				isFeatured: rawKitAsset.Featured,
				isBanner: rawKitAsset.Banner,
			};
	}
};

export const toRawKitAsset = (kitAsset: KitAsset): RawKitAsset => {
	const source = kitAsset.url.split('/').reverse()[0];
	const rawSource = source ?? '';

	// Shouldn't be nil!
	if (isNil(source)) {
		console.warn('KitAsset.source is nil');
	}

	switch (kitAsset.type) {
		case 'readme':
			return {
				Type: 'readme',
				Source: rawSource,
				Featured: kitAsset.isFeatured,
				Legend: '',
				Banner: false,
			};
		case 'image':
			return {
				Type: 'image',
				Legend: kitAsset.description,
				Source: rawSource,
				Featured: kitAsset.isFeatured,
				Banner: kitAsset.isBanner,
			};
	}
};
